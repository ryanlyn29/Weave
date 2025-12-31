# WEAVE - Living Memory Messaging Platform

A production-grade, consumer-facing web app where everyday chat automatically becomes a structured, shared, searchable knowledge base.

## Features

- **Automatic Entity Extraction**: Plans, decisions, recommendations, promises, and memories are automatically extracted from conversations
- **Bidirectional Linking**: Every entity links back to its source chat message
- **Intent-Based Search**: Find information by intent, not just keywords
- **Voice Integration**: ElevenLabs-powered voice briefings and voice-first capture
- **ML-Powered**: Importance scoring, entity evolution tracking, and intelligent recall

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (no gradients, no shadows)
- **Icons**: Lucide React

## Design Principles

- NO gradients anywhere
- NO shadows anywhere
- Solid colors only
- Bubbly UI (rounded, friendly) but restrained and professional
- Small typography (14-15px base)
- Density from layout, spacing, alignment, and color

## Getting Started

```bash
cd weave
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
weave/
├── app/
│   ├── api/              # API route stubs
│   ├── app/              # Protected app routes
│   ├── auth/             # Authentication
│   └── page.tsx          # Homepage
├── components/
│   ├── layout/           # Sidebar, TopBar, BottomBar
│   ├── inbox/            # Inbox components
│   ├── thread/           # Thread components
│   ├── library/          # Library components
│   ├── search/           # Search components
│   ├── activity/         # Activity components
│   ├── profile/          # Profile components
│   ├── settings/         # Settings components
│   └── home/             # Homepage components
└── lib/
    ├── types.ts          # TypeScript types
    └── mockData.ts       # Mock data
```

## Routes

### Public
- `/` - Marketing homepage
- `/auth` - Login/Signup

### Protected (requires auth)
- `/app/inbox` - Conversation list with context preview
- `/app/thread/[id]` - Full thread view with context rail
- `/app/library` - Database view of all entities
- `/app/search` - Intent-based search
- `/app/activity` - Timeline of activities
- `/app/profile` - User profile and stats
- `/app/settings` - App settings

## API Routes

All API routes are stubbed with mock implementations:
- `/api/inbox/threads` - Get all threads
- `/api/inbox/threads/[id]` - Get thread details
- `/api/messages/send` - Send a message
- `/api/entities/extract` - Extract entities from message
- `/api/library/query` - Query library with filters
- `/api/search` - Intent-based search
- `/api/activity` - Get activity feed
- `/api/voice/generate` - Generate voice audio (ElevenLabs)

## License

MIT

