@echo off
title Build and Run Expense Tracker 2.0 (Unified Port 8080)
echo =======================================================
echo   Step 1: Building React Frontend...
echo =======================================================
cd /d "%~dp0frontend"
call npm run build

echo.
echo =======================================================
echo   Step 2: Syncing build assets into Spring Boot...
echo =======================================================
cd /d "%~dp0"
powershell -Command "Copy-Item -Path 'frontend\build\*' -Destination 'backend\src\main\resources\static' -Recurse -Force"

echo.
echo =======================================================
echo   Step 3: Starting Spring Boot on http://localhost:8080
echo =======================================================
cd /d "%~dp0backend"
call .\mvnw.cmd spring-boot:run
pause
