@echo off
setlocal
echo ========================================================
echo  Push Online Quiz System to GitHub
echo  Email: 24eg107d21@anurag.edu.in
echo ========================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/quiz-system.git): "
if "%REPO_URL%"=="" (
    echo [ERROR] No URL entered. Aborting.
    pause
    exit /b
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
echo.
echo Pushing code to %REPO_URL% on branch main...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo  [SUCCESS] Code successfully pushed to GitHub!
    echo ========================================================
) else (
    echo.
    echo [ERROR] Push failed. Make sure you are logged into GitHub or provide a Personal Access Token (PAT).
)
echo.
pause
