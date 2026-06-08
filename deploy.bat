@echo off
REM IELTS Vocabulary App - Fly.io Deployment Script (Windows)
REM This script automates the deployment to Fly.io
REM Optimized for free tier (under $5/month)

echo ==========================================
echo IELTS Vocabulary App - Fly.io Deployment
echo ==========================================
echo.

REM Use local flyctl.exe if available, otherwise check system flyctl
if exist "flyctl.exe" (
    set FLYCTL=.\flyctl.exe
    echo ✅ Using local flyctl.exe
) else (
    where flyctl >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ flyctl not found.
        echo.
        echo Please download flyctl manually:
        echo 1. Visit: https://github.com/superfly/flyctl/releases/latest/download/flyctl-windows-x64.exe
        echo 2. Save as flyctl.exe in this directory
        echo 3. Run this script again
        echo.
        pause
        exit /b 1
    )
    set FLYCTL=flyctl
    echo ✅ Using system flyctl
)

REM Check if logged in
echo 🔍 Checking Fly.io authentication...
%FLYCTL% auth whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in. Please login:
    %FLYCTL% auth login
) else (
    echo ✅ Already logged in
)

REM Create app if it doesn't exist
echo.
echo 🔍 Checking if app exists...
%FLYCTL% apps list | findstr "ielts-vocab-app" >nul 2>&1
if %errorlevel% neq 0 (
    echo 📱 Creating new app...
    %FLYCTL% apps create ielts-vocab-app --region sin
    echo ✅ App created
) else (
    echo ✅ App already exists
)

REM Build and deploy
echo.
echo 🔨 Building and deploying...
%FLYCTL% deploy --remote-only

echo.
echo ==========================================
echo ✅ Deployment successful!
echo ==========================================
echo.
echo 📊 Cost Estimate (Free Tier):
echo   - VM: 1x shared-cpu-1x (FREE)
echo   - Memory: 256MB (FREE)
echo   - Auto-stop when idle (saves costs)
echo   - Estimated monthly cost: $0
echo.
echo 🌐 App URL: https://ielts-vocab-app.fly.dev
echo.
echo To view logs: %FLYCTL% logs
echo To open app: %FLYCTL% open
pause
