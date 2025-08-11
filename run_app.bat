@echo off
echo Starting Aura RMT Application...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher and try again
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies if requirements.txt exists
if exist "requirements.txt" (
    echo Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo WARNING: Some dependencies may not have installed correctly
    )
) else (
    echo WARNING: requirements.txt not found, dependencies may not be installed
)

REM Start the application
echo.
echo Starting Aura RMT server...
echo The application will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python app.py

REM Keep window open if there's an error
if errorlevel 1 (
    echo.
    echo Application stopped with an error
    pause
) 