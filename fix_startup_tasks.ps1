# This script fixes the Moodify startup tasks
# Run as Administrator

# Delete existing task if it exists
$taskExists = Get-ScheduledTask -TaskName "Moodify Startup" -ErrorAction SilentlyContinue
if ($taskExists) {
    Unregister-ScheduledTask -TaskName "Moodify Startup" -Confirm:$false
    Write-Host "Removed existing Moodify Startup task"
}

# Create a new task to run at startup
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Maximized -Command `"& {Start-Process -FilePath '$PWD\start_moodify.ps1' -Wait -NoNewWindow}`""
$trigger = New-ScheduledTaskTrigger -AtLogon
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 0)

Register-ScheduledTask -TaskName "Moodify Startup" -Action $action -Trigger $trigger -Principal $principal -Settings $settings

Write-Host "Successfully created new Moodify Startup task"
Write-Host "The frontend (port 3000) and backend (port 5000) will now start automatically at logon"
