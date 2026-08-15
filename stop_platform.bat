@echo off
title Stop TexCycle Platform
echo ======================================================
echo          STOPPING TEXCYCLE PLATFORM SERVICES
echo ======================================================
echo.

echo Stopping FastAPI python process...
taskkill /f /im python.exe

echo Stopping Vite node process...
taskkill /f /im node.exe

echo.
echo ======================================================
echo Services stopped successfully.
echo ======================================================
pause
