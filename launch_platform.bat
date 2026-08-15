@echo off
title TexCycle Platform Launcher
echo ======================================================
echo          TEXCYCLE TEXTILE WASTE PLATFORM LAUNCHER
echo ======================================================
echo.

echo 1. Launching FastAPI Backend Server...
start "TexCycle Backend" cmd /k "cd /d C:\Users\CHOKKALINGAM\OneDrive\Pictures\Documents\textile-waste-platform\backend && .\venv\Scripts\python run.py"

echo 2. Launching React/Vite Frontend Server...
start "TexCycle Frontend" cmd /k "cd /d C:\Users\CHOKKALINGAM\OneDrive\Pictures\Documents\textile-waste-platform\frontend && npm run dev"

echo 3. Launching Web Browser...
timeout /t 3 >nul
start http://localhost:3000

echo.
echo ======================================================
echo Platform launched successfully!
echo Close the two newly opened cmd windows to stop the servers.
echo ======================================================
timeout /t 5
