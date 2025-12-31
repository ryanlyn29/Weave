@echo off
echo Starting WEAVE Backend...
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 21 from https://adoptium.net/
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Maven is not installed.
    echo.
    echo To install Maven:
    echo 1. Download from https://maven.apache.org/download.cgi
    echo 2. Extract to C:\Program Files\Apache\maven
    echo 3. Add C:\Program Files\Apache\maven\bin to your PATH
    echo.
    pause
    exit /b 1
)

echo Starting Spring Boot application...
echo Backend will be available at: http://localhost:8080
echo Swagger UI will be available at: http://localhost:8080/swagger-ui
echo.

mvn spring-boot:run


