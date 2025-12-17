@echo off
title FTP Trainer Baslatici
color 0A

echo ==========================================
echo   FTP TRAINER AI - BASLATILIYOR
echo ==========================================
echo.

echo 1. Web Sunucusu baslatiliyor...
start "FTP Trainer Web Server" cmd /k "cd C:\projects1\GeminiStravaClient\FTPTrainer && npm run dev"

echo 2. Tarayici aciliyor...
timeout /t 5 >nul
start http://localhost:3000/coach

echo.
echo ==========================================
echo   SISTEM HAZIR!
echo ==========================================
echo.
echo Lutfen Gemini CLI penceresine donun ve su komutu yazin:
echo.
echo      Otomatik Mod
echo.
echo (Bu komut ile AI, web arayuzunu dinlemeye baslayacak)
echo.
pause
