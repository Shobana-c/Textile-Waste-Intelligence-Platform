@echo off
title TexCycle Server Launcher
echo ===================================================
echo   TexCycle Circularity Platform Server Launcher
echo ===================================================
echo.
echo Launching Backend FastAPI Server (Port 8000)...
start "TexCycle Backend" cmd /k "cd backend && .\venv\Scripts\activate && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

echo.
echo Launching Frontend Vite React Server (Port 5173)...
start "TexCycle Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo   Success: Both servers are starting up!
echo   - Frontend: http://localhost:5173/
echo   - Backend Docs: http://127.0.0.1:8000/docs
echo ===================================================
echo.
pause
