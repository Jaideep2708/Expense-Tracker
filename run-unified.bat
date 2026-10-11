@echo off
title Expense Tracker 2.0 - Unified Port 8080
echo ===================================================
echo   Starting Expense Tracker 2.0 on Unified Port 8080
echo ===================================================
echo.
cd /d "%~dp0backend"
echo Launching Spring Boot server (serving React + API on http://localhost:8080)...
call .\mvnw.cmd spring-boot:run
pause
