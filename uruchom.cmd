@echo off
chcp 65001 >nul
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
  start "Prezentacja - serwer" /min cmd /c "py -m http.server 8000"
) else (
  start "Prezentacja - serwer" /min cmd /c "python -m http.server 8000"
)

timeout /t 2 /nobreak >nul
start "" "http://localhost:8000/?anim=1"
exit /b
