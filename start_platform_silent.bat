@echo off
title TexCycle Platform Starter
echo ======================================================
echo          STARTING TEXCYCLE PLATFORM IN BACKGROUND
echo ======================================================
echo.

:: Clean up any existing instances first to prevent port conflicts
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1

echo Starting background services silently (via PowerShell)...
powershell -windowstyle hidden -command "Start-Process cmd -ArgumentList '/c cd /d %~dp0backend && python run.py' -WindowStyle Hidden; Start-Process cmd -ArgumentList '/c cd /d %~dp0frontend && npm run dev' -WindowStyle Hidden"

echo Waiting for services to initialize...
ping 127.0.0.1 -n 5 >nul

echo Opening browser at http://127.0.0.1:3000...
start http://127.0.0.1:3000

echo.
echo ======================================================
echo Services are running invisibly in the background.
echo To stop them at any time, run 'stop_platform.bat'.
echo ======================================================
ping 127.0.0.1 -n 3 >nul
