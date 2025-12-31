# WEAVE Backend Startup Script
Write-Host "Starting WEAVE Backend..." -ForegroundColor Cyan

# Check if Java is installed
$javaVersion = java -version 2>&1 | Select-String "version"
if (-not $javaVersion) {
    Write-Host "ERROR: Java is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Java 21 from https://adoptium.net/" -ForegroundColor Yellow
    exit 1
}
Write-Host "Java found: $javaVersion" -ForegroundColor Green

# Check if Maven is installed
$mavenVersion = mvn --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Maven is not installed." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To install Maven:" -ForegroundColor Yellow
    Write-Host "1. Download from https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    Write-Host "2. Extract to C:\Program Files\Apache\maven" -ForegroundColor Yellow
    Write-Host "3. Add C:\Program Files\Apache\maven\bin to your PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternatively, you can use the Maven Wrapper (mvnw.cmd) if available." -ForegroundColor Yellow
    exit 1
}
Write-Host "Maven found: $($mavenVersion | Select-Object -First 1)" -ForegroundColor Green

# Check if PostgreSQL is running (optional check)
Write-Host ""
Write-Host "Checking PostgreSQL connection..." -ForegroundColor Cyan
$pgTest = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue
if (-not $pgTest) {
    Write-Host "WARNING: PostgreSQL is not running on port 5432" -ForegroundColor Yellow
    Write-Host "Start it with: docker-compose up -d postgres" -ForegroundColor Yellow
    Write-Host "The backend will fail to start without PostgreSQL." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
} else {
    Write-Host "PostgreSQL is running" -ForegroundColor Green
}

# Start the backend
Write-Host ""
Write-Host "Starting Spring Boot application..." -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Swagger UI will be available at: http://localhost:8080/swagger-ui" -ForegroundColor Cyan
Write-Host ""

mvn spring-boot:run


