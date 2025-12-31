# WEAVE - Living Memory Messaging Platform

A production-grade, consumer-facing web app for high-trust groups to have conversations that are automatically remembered, organized, and searchable.

## Architecture

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Java 21, Spring Boot 3, PostgreSQL, Flyway
- **Authentication**: NextAuth.js + Firebase
- **Real-time**: Server-Sent Events (SSE) for thread updates

## Quick Start

### Prerequisites

- Node.js 18+
- Java 21 JDK
- Maven 3.8+
- Docker & Docker Compose

### 1. Start PostgreSQL

```bash
docker-compose up -d postgres
```

### 2. Configure Firebase

Place your Firebase service account JSON at:
```
backend-java/firebase-service-account.json
```

Or set:
```bash
export FIREBASE_CREDENTIALS_PATH=/path/to/firebase-service-account.json
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment

Create `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
# Add your NextAuth and Firebase config here
```

### 5. Run Both Services

```bash
# Run frontend and backend together
npm run dev:all

# Or separately:
npm run dev:frontend  # Next.js on :3000
npm run dev:backend   # Spring Boot on :8080
```

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (proxies to Java backend)
│   ├── app/               # Main app pages (inbox, thread, library, etc.)
│   └── auth/              # Authentication pages
├── components/             # React components
│   ├── weave/            # WEAVE-specific components
│   └── ui/               # Reusable UI components
├── backend-java/          # Spring Boot backend
│   ├── src/main/java/    # Java source code
│   └── src/main/resources/ # Config & migrations
├── lib/                   # Shared utilities & types
└── docker-compose.yml     # PostgreSQL container
```

## Development

### Frontend Development

```bash
npm run dev:frontend
```

Visit http://localhost:3000

### Backend Development

```bash
cd backend-java
mvn spring-boot:run
```

Visit http://localhost:8080/swagger-ui for API docs

### Database Migrations

Flyway automatically runs migrations on backend startup. Migrations are in:
```
backend-java/src/main/resources/db/migration/
```

## API Endpoints

All backend endpoints are under `/v1/`:

- **Threads**: `GET /v1/threads`, `GET /v1/threads/{id}`
- **Messages**: `POST /v1/messages/send`
- **Entities**: `POST /v1/entities/extract`
- **Library**: `GET /v1/library`
- **Search**: `GET /v1/search?q=...`
- **Activity**: `GET /v1/activity`
- **Notifications**: `GET /v1/notifications`
- **Voice**: `POST /v1/voice/generate` (stub)
- **Onboarding**: `POST /v1/onboarding/complete`

## Authentication Flow

1. User authenticates via NextAuth.js (Firebase)
2. Next.js API routes get Firebase ID token from session
3. API routes proxy requests to Java backend with `Authorization: Bearer <token>`
4. Java backend verifies token via Firebase Admin SDK
5. Backend auto-provisions user if missing

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
# Firebase config
```

### Backend (application.yml or env vars)

```env
DB_USERNAME=weave
DB_PASSWORD=weave
FIREBASE_CREDENTIALS_PATH=./firebase-service-account.json
SERVER_PORT=8080
```

## Building for Production

### Frontend

```bash
npm run build
npm start
```

### Backend

```bash
cd backend-java
mvn clean package
java -jar target/backend-1.0.0.jar
```

## Troubleshooting

### Backend won't start

1. Check PostgreSQL is running: `docker-compose ps`
2. Verify database credentials in `application.yml`
3. Check Firebase credentials path is correct
4. Review logs: `mvn spring-boot:run` or check `logs/` directory

### Frontend can't connect to backend

1. Verify `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
2. Check backend is running on port 8080
3. Check CORS settings in `SecurityConfig.java`

### Database connection errors

1. Ensure PostgreSQL container is running: `docker-compose up -d postgres`
2. Check connection string in `application.yml`
3. Verify database `weave` exists (created automatically)

## License

Proprietary - All rights reserved
