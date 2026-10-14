@echo off
echo ========================================================
echo  Starting Full Online Quiz System (Backend + Frontend)
echo ========================================================
echo.
echo [1/2] Starting Spring Boot Backend (Port 8080)...
start "Quiz System - Backend (Port 8080)" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"

echo [2/2] Starting React Frontend (Port 3000)...
start "Quiz System - Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo  Both servers are starting in separate windows!
echo   * Backend API:  http://localhost:8080
echo   * Frontend Web: http://localhost:3000
echo   * H2 Database:  http://localhost:8080/h2-console
echo ========================================================
echo Opening browser in 6 seconds...
timeout /t 6 >nul
start http://localhost:3000
