# Quick Start - WEAVE Backend

## ✅ What's Already Set Up

1. **Maven Wrapper** - No need to install Maven globally
2. **Java** - Already installed on your system
3. **H2 Database** - In-memory database (works without PostgreSQL)

## 🚀 Start the Backend (3 Steps)

### Step 1: Open Terminal in backend-java folder
```powershell
cd backend-java
```

### Step 2: Set JAVA_HOME (if not already set)
```powershell
$env:JAVA_HOME = (Split-Path (Split-Path (Get-Command java).Source))
```

### Step 3: Start Backend
```powershell
.\mvnw.cmd spring-boot:run
```

**OR use the startup script:**
```powershell
.\start.ps1
```

## 🌐 Access Points

Once running, the backend will be available at:
- **Swagger UI**: http://localhost:8080/swagger-ui
- **API Docs**: http://localhost:8080/v3/api-docs
- **Health Check**: http://localhost:8080/v1/threads (requires auth)

## 📝 Notes

- **H2 Database**: The backend uses H2 in-memory database by default (no PostgreSQL needed)
- **First Run**: Maven will download dependencies (takes 2-5 minutes)
- **Port**: Backend runs on port 8080
- **Firebase**: Optional - backend works without Firebase credentials (auth will be skipped)

## 🔧 Troubleshooting

### Backend won't start
1. Check Java: `java -version` (should be 21+)
2. Check port 8080: `netstat -ano | findstr :8080`
3. Check logs in the terminal for errors

### Swagger UI not loading
1. Wait 30-60 seconds after backend starts
2. Try: http://localhost:8080/swagger-ui/index.html
3. Check backend logs for errors

### Database errors
- H2 database is in-memory (data is lost on restart)
- To use PostgreSQL: Start Docker Desktop, then run `docker-compose up -d postgres` from project root


