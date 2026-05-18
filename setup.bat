@echo off
echo ========================================
echo Digital Signature App - Setup Script
echo ========================================
echo.

echo 1. Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo.
echo 2. Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo 3. Creating .env files...
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Backend: npm run backend
echo Frontend: npm run frontend
echo.
echo Or run both together:
echo npm run dev
echo.
pause
