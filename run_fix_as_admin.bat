@echo off
powershell -Command "Start-Process PowerShell -ArgumentList '-ExecutionPolicy Bypass -File \"%~dp0fix_startup_tasks.ps1\"' -Verb RunAs"
