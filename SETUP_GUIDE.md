# Collaborative Whiteboard - Setup Guide

## Prerequisites Installation (Windows)

### Step 1: Run Setup Script (As Administrator)

Open PowerShell as Administrator and run:

```powershell
# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Navigate to project directory
cd C:\Users\58297\collaborative-whiteboard

# Run the setup script
.\setup-windows.ps1
```

This will install:
- Chocolatey (Package Manager)
- Node.js LTS
- Git
- PostgreSQL 14
- Redis
- Go
- Docker Desktop (optional)

### Step 2: Initialize Project Structure

After restarting your terminal, run:

```powershell
.\setup-project.ps1
```

## Manual Setup Steps

### Backend Setup

1. **Initialize Go module:**
   ```powershell
   cd backend
   go mod tidy
   ```

2. **Create .env file:**
   ```powershell
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Setup Database:**
   ```powershell
   # Using Docker Compose (recommended)
   cd ..
   docker-compose -f docker-compose.dev.yml up -d

   # Or manually with psql
   psql -U postgres -c "CREATE DATABASE whiteboard;"
   psql -U postgres -d whiteboard -f scripts/init-db.sql
   ```

### Frontend Setup

1. **Initialize Vite project:**
   ```powershell
   cd frontend
   npm create vite@latest . -- --template react-ts
   # When prompted, select:
   # - Framework: React
   # - Variant: TypeScript
   ```

2. **Install dependencies (latest stable versions):**
   ```powershell
   npm install fabric@5.3.0 socket.io-client@4.7.5 zustand@4.4.7
   npm install -D tailwindcss@3.4.1 postcss@8.4.38 autoprefixer@10.4.16 @types/fabric@4.3.7 @types/react@18.2.66 @types/react-dom@18.2.18
   ```

3. **Initialize Tailwind CSS config:**
   ```powershell
   npx tailwindcss init -p
   # If you get an error with this command, ensure you are using tailwindcss v3.x. For v4+, follow the latest Tailwind docs to manually create tailwind.config.js and postcss.config.js.
   ```

4. **Create .env file:**
   ```powershell
   cp env.example .env
   ```

---

#### Troubleshooting
- If you see errors about deprecated packages or 'could not determine executable to run', ensure you are using the versions above and have deleted `node_modules` and `package-lock.json` before running `npm install`.
- For Tailwind v4+ (beta), see https://tailwindcss.com/docs/installation for updated setup steps.

## Running the Application

### Start Backend Services

```powershell
# Start database and Redis (if using Docker)
docker-compose -f docker-compose.dev.yml up -d

# Start Go server
cd backend
go run cmd/server/main.go
```

### Start Frontend Development Server

```powershell
# In a new terminal
cd frontend
npm run dev
```

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Adminer (DB UI)**: http://localhost:8081
- **Redis Commander**: http://localhost:8082

## Development Workflow

1. Backend API runs on port 8080
2. Frontend dev server runs on port 5173
3. WebSocket connections on ws://localhost:8080/ws/:boardId
4. PostgreSQL stores board metadata
5. Redis handles real-time state and pub/sub

## Common Issues

### PowerShell Script Execution
If scripts won't run, execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Port Conflicts
Check if ports are in use:
```powershell
netstat -ano | findstr :8080
netstat -ano | findstr :5173
```

### Node/npm Not Found
Restart terminal or run:
```powershell
refreshenv
```

## Next Steps

1. Implement WebSocket handlers in backend
2. Create React components for whiteboard
3. Set up Fabric.js canvas
4. Implement drawing tools
5. Add real-time synchronization
6. Deploy to AWS/Google Cloud

## Useful Commands

```powershell
# Backend
go run cmd/server/main.go     # Run server
go test ./...                 # Run tests
go build -o whiteboard.exe    # Build binary

# Frontend
npm run dev                   # Development server
npm run build                 # Production build
npm run preview              # Preview production build

# Docker
docker-compose -f docker-compose.dev.yml up    # Start services
docker-compose -f docker-compose.dev.yml down  # Stop services
docker-compose -f docker-compose.dev.yml logs  # View logs
``` 