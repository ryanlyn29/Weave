# Starting the WEAVE Backend

## Prerequisites

1. **Java 21 JDK** - Download from https://adoptium.net/ or https://www.oracle.com/java/technologies/downloads/#java21
2. **Maven 3.8+** - Download from https://maven.apache.org/download.cgi
3. **Docker Desktop** - For PostgreSQL (download from https://www.docker.com/products/docker-desktop)

## Quick Start

### 1. Install Java 21
```powershell
# Verify Java is installed
java -version
# Should show version 21.x.x
```

### 2. Install Maven
```powershell
# Download Maven from https://maven.apache.org/download.cgi
# Extract to C:\Program Files\Apache\maven
# Add to PATH: C:\Program Files\Apache\maven\bin

# Verify Maven is installed
mvn --version
```

### 3. Start PostgreSQL (Docker)
```powershell
# Make sure Docker Desktop is running
docker-compose up -d postgres

# Verify it's running
docker-compose ps
```

### 4. Start Backend
```powershell
cd backend-java
mvn spring-boot:run
```

The backend will start on http://localhost:8080

### 5. Verify Backend is Running
- Open http://localhost:8080/swagger-ui in your browser
- Or check: http://localhost:8080/v3/api-docs

## Alternative: Use Maven Wrapper (if available)

If `mvnw` or `mvnw.cmd` exists in backend-java:
```powershell
cd backend-java
.\mvnw.cmd spring-boot:run
```

## Troubleshooting

### Backend won't start
- Check Java version: `java -version` (must be 21)
- Check Maven: `mvn --version`
- Check PostgreSQL: `docker-compose ps`
- Check logs in backend-java for errors

### Database connection errors
- Ensure Docker Desktop is running
- Start PostgreSQL: `docker-compose up -d postgres`
- Check if port 5432 is available

### Port 8080 already in use
- Change port in `application.yml`: `server.port: 8081`
- Or stop the process using port 8080


