@echo off
echo ========================================
echo  EcoWatch AI - Starting Backend
echo ========================================
cd /d "%~dp0backend"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
