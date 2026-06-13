@echo off
echo.
echo ========================================
echo  CampaignOS Service Health Check
echo ========================================
echo.

REM Check API Server (port 3000)
echo Checking API Server (port 3000)...
curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] API Server is running
) else (
    echo [FAIL] API Server not responding
    echo   Start with: pnpm run dev --filter=api
)

echo.
echo Checking Channel Service (port 3001)...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Channel Service is running
) else (
    echo [FAIL] Channel Service not responding
    echo   Start with: pnpm run dev --filter=channel-service
)

echo.
echo Checking Web App (port 3002)...
curl -s http://localhost:3002 >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Web App is running
) else (
    echo [FAIL] Web App not responding
    echo   Start with: pnpm run dev --filter=web
)

echo.
echo ========================================
echo  All services checked
echo ========================================
echo.
pause
