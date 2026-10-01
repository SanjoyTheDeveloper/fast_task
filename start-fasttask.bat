@echo off
title FastTask Academic LMS Server
cd /d "%~dp0"
echo ========================================================
echo       Starting FastTask Academic LMS Platform
echo ========================================================
echo.
echo Courses and materials will be available at:
echo http://localhost:3000/lms
echo.
echo Keeping server running...
call npm run dev
pause
