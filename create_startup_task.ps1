# Create Windows Task Scheduler task for Moodify
$taskName = "Start Moodify Servers"
$scriptPath = Join-Path $PSScriptRoot "setup_and_run.ps1"

$action = New-ScheduledTaskAction `
    -Execute "PowerShell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""

$trigger = New-ScheduledTaskTrigger -AtLogOn
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Highest

# Delete existing task if it exists
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

# Create the new task
Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Description "Starts Moodify frontend and backend servers at login"
