# WEAVE Backend (Java/Spring Boot)

Production-grade backend service for WEAVE living memory messaging platform.

## Tech Stack

- **Java 21**
- **Spring Boot 3.2**
- **PostgreSQL 15**
- **Flyway** (database migrations)
- **Firebase Admin SDK** (authentication)
- **Spring Data JPA** (ORM)
- **OpenAPI/Swagger** (API documentation)

## Prerequisites

- Java 21 JDK
- Maven 3.8+
- Docker & Docker Compose (for PostgreSQL)
- Firebase service account JSON file

## Setup

### 1. Start PostgreSQL

```bash
# From repo root
docker-compose up -d postgres
```

### 2. Configure Firebase

Place your Firebase service account JSON file at:
```
backend-java/src/main/resources/firebase-service-account.json
```

**Important**: The file must be in the `src/main/resources/` directory so it's available on the classpath when the application runs (both in development and when packaged as a JAR).

### 3. Configure Database

Update `src/main/resources/application.yml` or set environment variables:

```bash
export DB_USERNAME=weave
export DB_PASSWORD=weave
export DB_URL=jdbc:postgresql://localhost:5432/weave
```

### 4. Run Backend

```bash
# From backend-java directory
mvn spring-boot:run

# Or from repo root
npm run dev:backend
```

The backend will start on `http://localhost:8080`

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8080/swagger-ui
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Endpoints

All endpoints are under `/v1/`:

- `GET /v1/threads` - List threads (supports `?sort=recent|attention|unresolved`)
- `GET /v1/threads/{id}` - Get thread details
- `POST /v1/messages/send` - Send a message
- `POST /v1/entities/extract` - Extract entities from message
- `GET /v1/library` - Query library entities
- `GET /v1/search?q=...` - Search
- `GET /v1/activity` - Get activity feed
- `GET /v1/notifications` - Get notifications
- `POST /v1/voice/generate` - Generate voice (stub)
- `POST /v1/onboarding/complete` - Complete onboarding

## Authentication

The backend expects Firebase ID tokens in the `Authorization` header:

```
Authorization: Bearer <firebase_id_token>
```

The Next.js frontend API routes proxy requests with this header automatically.

## Database Migrations

Flyway automatically runs migrations on startup from:
```
src/main/resources/db/migration/
```

Migrations are versioned (V1__, V2__, etc.) and run in order.

## Development

### Running Tests

```bash
mvn test
```

### Building

```bash
mvn clean package
```

### Running with Profile

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Environment Variables

- `DB_USERNAME` - PostgreSQL username (default: weave)
- `DB_PASSWORD` - PostgreSQL password (default: weave)
- `SERVER_PORT` - Server port (default: 8080)

**Note**: Firebase credentials are now loaded from the classpath (`src/main/resources/firebase-service-account.json`). The `FIREBASE_CREDENTIALS_PATH` environment variable is no longer used.


