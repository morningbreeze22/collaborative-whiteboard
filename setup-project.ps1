# Project Setup Script for Collaborative Whiteboard
Write-Host "Setting up Collaborative Whiteboard Project" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Create backend structure
Write-Host "`nCreating backend structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path backend/cmd/server
New-Item -ItemType Directory -Force -Path backend/internal/handlers
New-Item -ItemType Directory -Force -Path backend/internal/models
New-Item -ItemType Directory -Force -Path backend/internal/websocket
New-Item -ItemType Directory -Force -Path backend/internal/storage
New-Item -ItemType Directory -Force -Path backend/internal/database
New-Item -ItemType Directory -Force -Path backend/pkg/utils

# Create frontend structure
Write-Host "Creating frontend structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path frontend/src/components/Canvas
New-Item -ItemType Directory -Force -Path frontend/src/components/Toolbar
New-Item -ItemType Directory -Force -Path frontend/src/components/Sidebar
New-Item -ItemType Directory -Force -Path frontend/src/components/Common

# Create config directories
New-Item -ItemType Directory -Force -Path config
New-Item -ItemType Directory -Force -Path scripts
New-Item -ItemType Directory -Force -Path tests/frontend
New-Item -ItemType Directory -Force -Path tests/backend
New-Item -ItemType Directory -Force -Path .github/workflows

Write-Host "`nProject structure created!" -ForegroundColor Green

# Initialize Git repository
if (!(Test-Path .git)) {
    Write-Host "`nInitializing Git repository..." -ForegroundColor Yellow
    git init
}

Write-Host "`nSetup complete! Next steps:" -ForegroundColor Green
Write-Host "1. Run 'cd backend' and 'go mod init github.com/yourusername/collaborative-whiteboard'" -ForegroundColor Cyan
Write-Host "2. Run 'cd frontend' and 'npm create vite@latest . -- --template react-ts'" -ForegroundColor Cyan
Write-Host "3. Configure your environment variables in .env files" -ForegroundColor Cyan 