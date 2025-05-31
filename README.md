# Collaborative Whiteboard

A real-time collaborative whiteboard application where multiple users can draw, add shapes, text, and images together.

## Features

- Real-time collaboration (up to 10 users per board)
- Drawing tools with color selection
- Basic shapes (rectangle, circle, line)
- Text tool
- Image upload and placement
- No account required - access via unique URLs
- Mobile and desktop support (Chrome/Edge)

## Tech Stack

### Frontend
- React (TypeScript)
- Vite
- Tailwind CSS
- Zustand (State Management)
- Fabric.js (Canvas Library)
- Socket.io-client (Real-time Communication)

### Backend
- Go (Golang)
- Gin (Web Framework)
- Gorilla WebSocket
- Redis (Session & Cache)
- PostgreSQL (Metadata)
- AWS S3 (Image Storage)

## Project Structure

```
collaborative-whiteboard/
├── frontend/          # React frontend application
├── backend/           # Go backend server
├── docker/           # Docker configurations
├── docs/             # Documentation
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Go (v1.21+)
- Redis
- PostgreSQL
- Docker (optional)

### Development Setup

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   go mod download
   go run main.go
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Environment Variables

Create `.env` files in both `frontend` and `backend` directories. See `.env.example` files for required variables.

## Deployment

The application is designed to run on AWS or Google Cloud. See the `docker/` directory for containerization setup.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License 