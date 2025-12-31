# WEAVE Backend Startup Script
Write-Host "=== WEAVE Backend Startup ===" -ForegroundColor Cyan
Write-Host ""

# Set JAVA_HOME if not set
if (-not $env:JAVA_HOME) {
    $javaPath = (Get-Command java -ErrorAction SilentlyContinue).Source
    if ($javaPath) {
        $env:JAVA_HOME = Split-Path (Split-Path $javaPath)
        Write-Host "Set JAVA_HOME to: $env:JAVA_HOME" -ForegroundColor Yellow
    } else {
        Write-Host "ERROR: Java not found in PATH" -ForegroundColor Red
        exit 1
    }
}

# Check if Maven wrapper jar exists
if (-not (Test-Path ".mvn\wrapper\maven-wrapper.jar")) {
    Write-Host "Downloading Maven Wrapper..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path ".mvn\wrapper" -Force | Out-Null
    Invoke-WebRequest -Uri "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar" -OutFile ".mvn\wrapper\maven-wrapper.jar"
}

Write-Host "Starting Spring Boot backend..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Swagger UI: http://localhost:8080/swagger-ui" -ForegroundColor Cyan
Write-Host ""

# Start the backend
java -jar .mvn\wrapper\maven-wrapper.jar org.apache.maven.wrapper.MavenWrapperMain spring-boot:run


