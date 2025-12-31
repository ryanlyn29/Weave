# ✅ Backend Setup Complete

## What Has Been Installed/Configured

1. ✅ **Maven Wrapper** - Downloaded and configured (no global Maven install needed)
2. ✅ **H2 Database** - Added as fallback (works without PostgreSQL)
3. ✅ **Java** - Detected and JAVA_HOME configured
4. ✅ **Startup Scripts** - Created `start.ps1` and `mvnw.cmd`
5. ✅ **Configuration** - Updated to work with H2 or PostgreSQL

## 🚀 How to Start the Backend

### Method 1: Using npm script (Recommended)
From project root:
```powershell
npm run dev:backend
```

### Method 2: Direct command
```powershell
cd backend-java
.\mvnw.cmd spring-boot:run
```

### Method 3: Using PowerShell script
```powershell
cd backend-java
.\start.ps1
```

## ⏱️ First Time Startup

**Important**: First startup takes 2-5 minutes because Maven downloads all dependencies.

You'll see output like:
```
Downloading from central: https://repo.maven.apache.org/maven2/...
Downloaded: ...
```

Wait until you see:
```
Started WeaveApplication in X.XXX seconds
```

## 🌐 Access Points

Once running, open in browser:
- **Swagger UI**: http://localhost:8080/swagger-ui
- **API Docs**: http://localhost:8080/v3/api-docs

## 🔍 Verify Backend is Running

```powershell
# Check if port 8080 is open
Test-NetConnection -ComputerName localhost -Port 8080

# Check if Java process is running
Get-Process -Name java
```

## 📝 Current Configuration

- **Database**: H2 in-memory (no PostgreSQL needed)
- **Port**: 8080
- **Firebase**: Optional (works without it)
- **Maven**: Using wrapper (no global install needed)

## ⚠️ Troubleshooting

### Backend won't start
1. **Check Java**: `java -version` (should be 21+)
2. **Check port**: `netstat -ano | findstr :8080` (should be free)
3. **Check logs**: Look at terminal output for errors
4. **Wait longer**: First startup takes 2-5 minutes

### Swagger UI not loading
1. Wait 30-60 seconds after "Started WeaveApplication"
2. Try: http://localhost:8080/swagger-ui/index.html
3. Check browser console for errors

### Maven wrapper issues
- The wrapper downloads Maven automatically on first use
- If it fails, manually download: https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
- Place in: `backend-java/.mvn/wrapper/maven-wrapper.jar`

## 🎯 Next Steps

1. Start the backend using one of the methods above
2. Wait 2-5 minutes for first-time dependency download
3. Open http://localhost:8080/swagger-ui in your browser
4. Start the frontend: `npm run dev:frontend` (from project root)

## 📚 Additional Info

- **H2 Console**: http://localhost:8080/h2-console (if enabled)
- **Database URL**: `jdbc:h2:mem:weave`
- **Username**: `sa`
- **Password**: (empty)


