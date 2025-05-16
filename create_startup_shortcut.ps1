$scriptPath = "c:\Users\tmodh\Desktop\moodify git OG\Moodify-Emotion-Music-App-master\start_servers.ps1"
$startupFolder = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup"
$shortcutPath = "$startupFolder\MoodifyServers.lnk"

$WScriptShell = New-Object -ComObject WScript.Shell
$shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "powershell.exe"
$shortcut.Arguments = "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`""
$shortcut.WorkingDirectory = "c:\Users\tmodh\Desktop\moodify git OG\Moodify-Emotion-Music-App-master"
$shortcut.Save()

Write-Host "Startup shortcut created successfully at: $shortcutPath"
