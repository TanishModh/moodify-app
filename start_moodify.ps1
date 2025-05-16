# Start Moodify Frontend and Backend Servers
# This script starts both the React frontend and Flask backend

# Log file for diagnostics
$logPath = "$PSScriptRoot\moodify_startup_log.txt"
"Starting Moodify servers at $(Get-Date)" | Out-File -FilePath $logPath

# Function to log messages
function Log-Message {
    param([string]$Message)
    "$(Get-Date) - $Message" | Out-File -FilePath $logPath -Append
    Write-Host $Message
}

# Check and create directories if they don't exist
try {
    # Backend
    $backendPath = "C:\Users\tmodh\OneDrive\Desktop\moodify git OG\Moodify-Emotion-Music-App-master\backend"
    if (!(Test-Path $backendPath)) {
        Log-Message "ERROR: Backend directory does not exist: $backendPath"
        exit 1
    }
    # Frontend
    $frontendPath = "C:\Users\tmodh\OneDrive\Desktop\moodify git OG\Moodify-Emotion-Music-App-master\frontend"
    if (!(Test-Path $frontendPath)) {
        Log-Message "ERROR: Frontend directory does not exist: $frontendPath"
        exit 1
    }
    Log-Message "Directories verified successfully"
} catch {
    Log-Message "ERROR checking directories: $_"
    exit 1
}

# Start Backend Server
try {
    Log-Message "Starting backend server..."
    # Create a direct shortcut to cmd with the right command instead of using Start-Process
    $backendCmd = "cmd.exe /k ""cd /d $backendPath && python mongo_auth.py"""
    Log-Message "Running command: $backendCmd"
    
    # Use explorer to launch the cmd window which should be more robust
    Start-Process explorer.exe -ArgumentList "$backendCmd"
    Log-Message "Backend process started"
} catch {
    Log-Message "ERROR starting backend: $_"
}

# Wait a moment for backend to initialize
Log-Message "Waiting for backend to initialize..."
Start-Sleep -Seconds 5

# Start Frontend Server
try {
    Log-Message "Starting frontend server..."
    # Create a direct shortcut to cmd with the right command instead of using Start-Process
    $frontendCmd = "cmd.exe /k ""cd /d $frontendPath && npm start"""
    Log-Message "Running command: $frontendCmd"
    
    # Use explorer to launch the cmd window which should be more robust
    Start-Process explorer.exe -ArgumentList "$frontendCmd"
    Log-Message "Frontend process started"
} catch {
    Log-Message "ERROR starting frontend: $_"
}

Log-Message "Startup script completed"

