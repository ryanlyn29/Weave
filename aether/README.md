# AETHER - Real-time Multiplayer Generative 3D Environment

A high-performance web application where multiple users can collaborate in a 3D scene, using AI to generate assets on the fly.

## Architecture

### Monorepo Structure
```
aether/
├── apps/
│   ├── web/          # Next.js 14 Frontend (React Three Fiber)
│   └── server/        # Go Backend (WebSocket Server)
└── packages/
    └── shared/        # Shared TypeScript Types & Utils
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **3D Engine**: React Three Fiber (Three.js) with WebGPU support
- **State Management**: TanStack Query + Zustand
- **Real-time Sync**: Yjs (CRDT) + WebSocket
- **Styling**: Tailwind CSS

### Backend
- **Language**: Go (Golang)
- **WebSocket**: Gorilla WebSocket
- **Concurrency**: Go Routines for handling thousands of connections
- **Spatial Hashing**: In-memory chunk-based room system

### AI Integration
- **OpenAI**: Asset generation from text prompts
- **ElevenLabs**: Voice generation for NPC dialogue and spawn sounds

### Storage (Mocked)
- **DynamoDB**: Local NoSQL structure
- **S3**: AWS SDK for asset storage

## Getting Started

### Prerequisites
- Node.js 18+
- Go 1.21+
- npm or yarn

### Backend Setup

```bash
cd apps/server
go mod download
go run main.go
```

Server runs on `http://localhost:8080`

### Frontend Setup

```bash
cd apps/web
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### Environment Variables

Create `.env.local` in `apps/web/`:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key
```

## Features

### Spatial Hashing
Users are grouped into "chunks" based on their 3D position. Only users in the same chunk receive updates from each other, enabling scalability.

### Real-time Collaboration
- Position synchronization via WebSocket
- Asset spawning with AI generation
- Multi-user presence visualization

### AI Asset Generation
1. User enters text prompt (e.g., "Red Dragon")
2. OpenAI generates asset properties (type, scale, color)
3. Asset spawns in world
4. ElevenLabs generates spawn audio

## Development

### Adding New Features
1. Update shared types in `packages/shared/types/`
2. Implement backend logic in `apps/server/`
3. Create frontend components in `apps/web/components/`
4. Sync state via WebSocket messages

### Testing
- Backend: `go test ./...`
- Frontend: `npm test` (when tests are added)

## License

MIT


