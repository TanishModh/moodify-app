# Moodify Setup and Run Script
$ErrorActionPreference = "Stop"
$logFile = ".\moodify_setup.log"

function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Tee-Object -FilePath $logFile -Append
}

# Check if Python is installed
Write-Log "Checking Python installation..."
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Log "Python is not installed. Please install Python 3.8 or later from https://www.python.org/downloads/"
    Write-Log "After installing Python, run this script again."
    exit 1
}

# Check if Node.js is installed
Write-Log "Checking Node.js installation..."
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Log "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    Write-Log "After installing Node.js, run this script again."
    exit 1
}

# Setup Backend
Write-Log "Setting up backend..."
if (-not (Test-Path ".venv")) {
    Write-Log "Creating Python virtual environment..."
    python -m venv .venv
}

Write-Log "Activating virtual environment..."
.\.venv\Scripts\Activate.ps1

Write-Log "Installing Python dependencies..."
pip install -r requirements.txt

# Setup Frontend
Write-Log "Setting up frontend..."
Set-Location .\frontend
npm install
Set-Location ..

# Function to start the backend server
function Start-BackendServer {
    Write-Log "Starting backend server on port 8000..."
    Set-Location .\backend
    $env:FLASK_APP = "mongo_auth.py"
    $env:FLASK_ENV = "development"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m flask run --port 8000"
    Set-Location ..
}

# Function to start the frontend server
function Start-FrontendServer {
    Write-Log "Starting frontend server on port 3000..."
    Set-Location .\frontend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
    Set-Location ..
}

# Start both servers
Start-BackendServer
Start-Sleep -Seconds 5  # Wait for backend to initialize
Start-FrontendServer

Write-Log "Servers started successfully!"
Write-Log "Frontend running on http://localhost:3000"
Write-Log "Backend running on http://localhost:8000"
