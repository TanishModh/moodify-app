# Paths to your project directories
$backendDir  = 'C:\Users\tmodh\OneDrive\Desktop\moodify git OG\Moodify-Emotion-Music-App-master\backend'
$frontendDir = 'C:\Users\tmodh\OneDrive\Desktop\moodify git OG\Moodify-Emotion-Music-App-master\frontend'

# Launch Django server in a new PowerShell window
Start-Process -FilePath 'powershell.exe' `
  -ArgumentList '-NoExit','-Command','python manage.py runserver 0.0.0.0:5000' `
  -WorkingDirectory $backendDir

Start-Sleep -Seconds 2

# Launch React dev server in a new PowerShell window
Start-Process -FilePath 'powershell.exe' `
  -ArgumentList '-NoExit','-Command','npm start' `
  -WorkingDirectory $frontendDir

Start-Sleep -Seconds 15

# Open browser to React UI
Start-Process "http://localhost:3000"
