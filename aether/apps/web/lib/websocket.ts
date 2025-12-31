import { WebSocketMessage, Position, Asset, ChunkID } from '../../../packages/shared/types'
import { useAetherStore } from './store'
import { positionToChunkID } from '../../../packages/shared/utils/spatial'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws'

export class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(userId: string, initialPosition: Position) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    this.ws = new WebSocket(WS_URL)

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      useAetherStore.getState().setConnected(true)
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      useAetherStore.getState().setConnected(false)
      this.attemptReconnect(userId, initialPosition)
    }
  }

  private attemptReconnect(userId: string, initialPosition: Position) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect(userId, initialPosition)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const store = useAetherStore.getState()

    switch (message.type) {
      case 'world_state':
        const worldState = JSON.parse(message.payload as any)
        // Initialize world state
        if (worldState.users) {
          Object.entries(worldState.users).forEach(([id, user]: [string, any]) => {
            store.addUser(user)
          })
        }
        if (worldState.assets) {
          Object.entries(worldState.assets).forEach(([id, asset]: [string, any]) => {
            store.addAsset(asset)
          })
        }
        break

      case 'user_join':
        const newUser = JSON.parse(message.payload as any)
        store.addUser(newUser)
        break

      case 'user_leave':
        const leftUser = JSON.parse(message.payload as any)
        store.removeUser(leftUser.id)
        break

      case 'position_update':
        const updatedUser = JSON.parse(message.payload as any)
        if (updatedUser.id !== store.userId) {
          store.updateUser(updatedUser.id, updatedUser.position)
        }
        break

      case 'asset_spawn':
        const newAsset = JSON.parse(message.payload as any)
        store.addAsset(newAsset)
        break

      case 'chunk_change':
        const chunkUser = JSON.parse(message.payload as any)
        store.updateUser(chunkUser.id, chunkUser.position)
        break
    }
  }

  sendPosition(position: Position) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'position_update',
        payload: position as any,
        timestamp: Date.now(),
        userId: useAetherStore.getState().userId || '',
      }
      this.ws.send(JSON.stringify(message))
    }
  }

  sendAssetSpawn(asset: Omit<Asset, 'id' | 'createdAt' | 'createdBy'>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'asset_spawn',
        payload: asset as any,
        timestamp: Date.now(),
        userId: useAetherStore.getState().userId || '',
      }
      this.ws.send(JSON.stringify(message))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const wsManager = new WebSocketManager()


