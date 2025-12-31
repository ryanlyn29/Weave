# AETHER Server

Go WebSocket server for real-time multiplayer 3D collaboration.

## Features

- **WebSocket Hub**: Manages thousands of concurrent connections using Go Routines
- **Spatial Hashing**: Groups users into chunks based on 3D position (100 unit chunks)
- **Chunk-based Broadcasting**: Only sends updates to users in the same spatial chunk
- **Asset Management**: Handles asset spawning and synchronization

## Architecture

### Spatial Hashing
Users are assigned to chunks based on their position:
- Chunk size: 100 units
- Chunk ID: `(floor(x/100), floor(y/100), floor(z/100))`
- Only users in the same chunk receive each other's updates

### Message Types
- `position_update`: User position changed
- `asset_spawn`: New asset created
- `user_join`: User connected
- `user_leave`: User disconnected
- `chunk_change`: User moved to different chunk
- `world_state`: Initial world state on connection

## Running

```bash
go mod download
go run main.go
```

Server listens on `:8080`

## WebSocket Endpoint

`ws://localhost:8080/ws`

## Message Format

```json
{
  "type": "position_update",
  "payload": { "x": 0, "y": 0, "z": 0 },
  "timestamp": 1234567890,
  "userId": "user_123"
}
```


