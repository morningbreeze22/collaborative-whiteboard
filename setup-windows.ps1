# Windows Setup Script for Collaborative Whiteboard
# Run this script in PowerShell as Administrator

Write-Host "Collaborative Whiteboard - Windows Setup" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Host "This script needs to be run as Administrator. Exiting..." -ForegroundColor Red
    Exit 1
}

# Install Chocolatey if not installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Install required software
Write-Host "`nInstalling required software..." -ForegroundColor Yellow

# Node.js LTS
Write-Host "Installing Node.js..." -ForegroundColor Cyan
choco install nodejs-lts -y

# Git
Write-Host "Installing Git..." -ForegroundColor Cyan
choco install git -y

# PostgreSQL
Write-Host "Installing PostgreSQL..." -ForegroundColor Cyan
choco install postgresql14 -y --params '/Password:postgres'

# Redis
Write-Host "Installing Redis..." -ForegroundColor Cyan
choco install redis-64 -y

# Go (for backend development)
Write-Host "Installing Go..." -ForegroundColor Cyan
choco install golang -y

# Docker Desktop (optional)
$installDocker = Read-Host "`nDo you want to install Docker Desktop? (y/n)"
if ($installDocker -eq 'y') {
    Write-Host "Installing Docker Desktop..." -ForegroundColor Cyan
    choco install docker-desktop -y
}

# Refresh environment variables
Write-Host "`nRefreshing environment variables..." -ForegroundColor Yellow
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "Please restart your terminal and run 'setup-project.ps1' to initialize the project." -ForegroundColor Yellow 