package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/google/uuid"
)

const (
	CHUNK_SIZE = 100.0
)

// Position represents a 3D coordinate
type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
}

// ChunkID represents a spatial chunk identifier
type ChunkID struct {
	ChunkX int `json:"chunkX"`
	ChunkY int `json:"chunkY"`
	ChunkZ int `json:"chunkZ"`
}

// User represents a connected user in the world
type User struct {
	ID       string   `json:"id"`
	Position Position `json:"position"`
	ChunkID  ChunkID  `json:"chunkID"`
	Username string   `json:"username,omitempty"`
}

// Asset represents a generated 3D asset
type Asset struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	Position  Position  `json:"position"`
	Scale     Position  `json:"scale"`
	Color     string    `json:"color,omitempty"`
	MeshData  string    `json:"meshData,omitempty"`
	CreatedAt int64     `json:"createdAt"`
	CreatedBy string    `json:"createdBy"`
}

// WebSocketMessage represents a message sent over WebSocket
type WebSocketMessage struct {
	Type      string          `json:"type"`
	Payload   json.RawMessage `json:"payload"`
	Timestamp int64           `json:"timestamp"`
	UserID    string          `json:"userId"`
}

// Client represents a WebSocket client connection
type Client struct {
	ID     string
	User   *User
	Conn   *websocket.Conn
	Hub    *Hub
	Send   chan []byte
	Chunks map[string]bool // Track which chunks this client is subscribed to
}

// Hub maintains the set of active clients and broadcasts messages
type Hub struct {
	// Registered clients
	Clients map[*Client]bool

	// Inbound messages from clients
	Broadcast chan []byte

	// Register requests from clients
	Register chan *Client

	// Unregister requests from clients
	Unregister chan *Client

	// Spatial hash: chunkID -> set of clients
	Chunks map[string]map[*Client]bool

	// Users by ID
	Users map[string]*User

	// Assets by ID
	Assets map[string]*Asset

	// Mutex for thread-safe operations
	mu sync.RWMutex
}

// NewHub creates a new Hub instance
func NewHub() *Hub {
	return &Hub{
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Chunks:     make(map[string]map[*Client]bool),
		Users:      make(map[string]*User),
		Assets:     make(map[string]*Asset),
	}
}

// Run starts the hub's main loop
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.mu.Lock()
			h.Clients[client] = true
			h.Users[client.User.ID] = client.User
			
			// Add client to chunk
			chunkKey := chunkIDToString(client.User.ChunkID)
			if h.Chunks[chunkKey] == nil {
				h.Chunks[chunkKey] = make(map[*Client]bool)
			}
			h.Chunks[chunkKey][client] = true
			client.Chunks[chunkKey] = true
			h.mu.Unlock()

			// Broadcast user join
			h.broadcastToChunk(chunkKey, createMessage("user_join", client.User, client.User.ID))

		case client := <-h.Unregister:
			h.mu.Lock()
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				delete(h.Users, client.User.ID)
				
				// Remove from chunks
				for chunkKey := range client.Chunks {
					if h.Chunks[chunkKey] != nil {
						delete(h.Chunks[chunkKey], client)
						if len(h.Chunks[chunkKey]) == 0 {
							delete(h.Chunks, chunkKey)
						}
					}
				}
				
				close(client.Send)
			}
			h.mu.Unlock()

			// Broadcast user leave
			for chunkKey := range client.Chunks {
				h.broadcastToChunk(chunkKey, createMessage("user_leave", client.User, client.User.ID))
			}

		case message := <-h.Broadcast:
			// Broadcast to all clients (for system messages)
			h.mu.RLock()
			for client := range h.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.Clients, client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

// broadcastToChunk broadcasts a message to all clients in a specific chunk
func (h *Hub) broadcastToChunk(chunkKey string, message []byte) {
	h.mu.RLock()
	clients, exists := h.Chunks[chunkKey]
	if !exists {
		h.mu.RUnlock()
		return
	}
	
	for client := range clients {
		select {
		case client.Send <- message:
		default:
			close(client.Send)
			delete(h.Clients, client)
		}
	}
	h.mu.RUnlock()
}

// positionToChunkID converts a position to a ChunkID
func positionToChunkID(pos Position) ChunkID {
	return ChunkID{
		ChunkX: int(pos.X / CHUNK_SIZE),
		ChunkY: int(pos.Y / CHUNK_SIZE),
		ChunkZ: int(pos.Z / CHUNK_SIZE),
	}
}

// chunkIDToString converts ChunkID to string key
func chunkIDToString(chunkID ChunkID) string {
	return fmt.Sprintf("%d,%d,%d", chunkID.ChunkX, chunkID.ChunkY, chunkID.ChunkZ)
}

// createMessage creates a WebSocket message
func createMessage(msgType string, payload interface{}, userID string) []byte {
	payloadBytes, _ := json.Marshal(payload)
	msg := WebSocketMessage{
		Type:      msgType,
		Payload:   payloadBytes,
		Timestamp: time.Now().UnixMilli(),
		UserID:    userID,
	}
	msgBytes, _ := json.Marshal(msg)
	return msgBytes
}

// readPump pumps messages from the WebSocket connection to the hub
func (c *Client) readPump() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		var wsMsg WebSocketMessage
		if err := json.Unmarshal(message, &wsMsg); err != nil {
			log.Printf("error unmarshaling message: %v", err)
			continue
		}

		c.handleMessage(&wsMsg)
	}
}

// writePump pumps messages from the hub to the WebSocket connection
func (c *Client) writePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued messages
			n := len(c.Send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-c.Send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// handleMessage processes incoming WebSocket messages
func (c *Client) handleMessage(msg *WebSocketMessage) {
	switch msg.Type {
	case "position_update":
		var pos Position
		if err := json.Unmarshal(msg.Payload, &pos); err != nil {
			return
		}

		oldChunkKey := chunkIDToString(c.User.ChunkID)
		c.User.Position = pos
		c.User.ChunkID = positionToChunkID(pos)
		newChunkKey := chunkIDToString(c.User.ChunkID)

		// If chunk changed, update subscriptions
		if oldChunkKey != newChunkKey {
			c.Hub.mu.Lock()
			// Remove from old chunk
			if c.Hub.Chunks[oldChunkKey] != nil {
				delete(c.Hub.Chunks[oldChunkKey], c)
			}
			// Add to new chunk
			if c.Hub.Chunks[newChunkKey] == nil {
				c.Hub.Chunks[newChunkKey] = make(map[*Client]bool)
			}
			c.Hub.Chunks[newChunkKey][c] = true
			delete(c.Chunks, oldChunkKey)
			c.Chunks[newChunkKey] = true
			c.Hub.mu.Unlock()

			// Broadcast chunk change
			c.Hub.broadcastToChunk(oldChunkKey, createMessage("chunk_change", c.User, c.User.ID))
			c.Hub.broadcastToChunk(newChunkKey, createMessage("user_join", c.User, c.User.ID))
		}

		// Broadcast position update to chunk
		c.Hub.broadcastToChunk(newChunkKey, createMessage("position_update", c.User, c.User.ID))

	case "asset_spawn":
		var asset Asset
		if err := json.Unmarshal(msg.Payload, &asset); err != nil {
			return
		}

		asset.ID = uuid.New().String()
		asset.CreatedAt = time.Now().UnixMilli()
		asset.CreatedBy = c.User.ID

		c.Hub.mu.Lock()
		c.Hub.Assets[asset.ID] = &asset
		c.Hub.mu.Unlock()

		// Broadcast to chunk
		chunkKey := chunkIDToString(positionToChunkID(asset.Position))
		c.Hub.broadcastToChunk(chunkKey, createMessage("asset_spawn", asset, c.User.ID))
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins in development
	},
}

// serveWs handles WebSocket requests from clients
func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// Create new user
	userID := uuid.New().String()
	user := &User{
		ID:       userID,
		Position: Position{X: 0, Y: 0, Z: 0},
		ChunkID:  ChunkID{ChunkX: 0, ChunkY: 0, ChunkZ: 0},
	}

	client := &Client{
		ID:     userID,
		User:   user,
		Hub:    hub,
		Conn:   conn,
		Send:   make(chan []byte, 256),
		Chunks: make(map[string]bool),
	}

	client.Hub.Register <- client

	// Send initial world state
	hub.mu.RLock()
	worldState := map[string]interface{}{
		"users":  hub.Users,
		"assets": hub.Assets,
	}
	hub.mu.RUnlock()

	initialMsg := createMessage("world_state", worldState, userID)
	client.Send <- initialMsg

	go client.writePump()
	go client.readPump()
}

func main() {
	hub := NewHub()
	go hub.Run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	log.Println("AETHER Server starting on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

