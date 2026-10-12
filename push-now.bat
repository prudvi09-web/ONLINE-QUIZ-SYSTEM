@echo off
echo ========================================================
echo  Pushing Online Quiz System to GitHub
echo  Repository: https://github.com/prudvi09-web/online-quiz-system.git
echo  Author: 24eg107d21@anurag.edu.in
echo ========================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  [SUCCESS] All code has been successfully pushed!
    echo ========================================================
) else (
    echo [NOTICE] If this is your first push, please complete the sign-in prompt in your browser window.
)
echo.
pause
