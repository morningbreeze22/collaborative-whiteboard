# Product Requirements Document: Collaborative Whiteboard

## 1. Executive Summary

A web-based collaborative whiteboard application that allows multiple users to draw, sketch, and brainstorm together in real-time through a simple shareable link.

## 2. Product Overview

### 2.1 Vision
Enable seamless real-time collaboration for teams and individuals to visualize ideas together, regardless of location, without friction of account creation.

### 2.2 Target Users
- Remote teams
- Educators and students
- Design professionals
- Anyone needing quick visual collaboration

## 3. Functional Requirements

### 3.1 Core Features

#### 3.1.1 Board Creation
- Users can create new whiteboards from homepage
- Choose board dimensions (e.g., 1920x1080, 2560x1440, 3840x2160)
- Generate unique shareable URL
- Optional board name and password protection

#### 3.1.2 Drawing Tools
- **Freehand drawing** with pressure sensitivity (where supported)
- **Color picker** with preset colors and custom color input
- **Brush size** adjustment (1px - 50px)
- **Eraser** tool with size adjustment
- **Undo/Redo** functionality (Ctrl+Z/Ctrl+Y)

#### 3.1.3 Shape Tools
- Rectangle (filled/outline)
- Circle/Ellipse (filled/outline)
- Line/Arrow
- Triangle
- All shapes support color and stroke width customization

#### 3.1.4 Text Tool
- Add text anywhere on canvas
- Font size adjustment (12px - 72px)
- Basic font selection
- Text color customization
- Edit existing text by double-clicking

#### 3.1.5 Image Support
- Upload images (JPG, PNG, GIF, WEBP)
- Drag and drop support
- Resize and rotate images
- Maximum file size: 5MB
- Images stored in cloud storage

#### 3.1.6 Real-time Collaboration
- See other users' cursors with names/colors
- Live drawing updates (< 50ms latency)
- User presence indicators
- Maximum 10 concurrent users per board
- Conflict resolution for simultaneous edits

#### 3.1.7 Board Persistence
- Auto-save every action
- Boards accessible via URL indefinitely
- View-only mode after 30 days of inactivity
- Export board as image (PNG/JPG)

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance
- Page load time < 2 seconds
- Drawing latency < 16ms (60 FPS)
- Real-time sync latency < 100ms
- Support 200+ concurrent users across all boards

#### 3.2.2 Compatibility
- Chrome 90+
- Edge 90+
- Mobile responsive (touch support)
- Minimum screen resolution: 768x1024

#### 3.2.3 Security
- HTTPS only
- Input sanitization
- Rate limiting (100 requests/minute per IP)
- CORS protection
- XSS prevention

#### 3.2.4 Scalability
- Horizontal scaling capability
- Auto-scaling based on load
- CDN for static assets
- Database read replicas

## 4. User Interface

### 4.1 Homepage
- Clean landing page with "Create New Board" CTA
- Board dimension selector
- Recent boards (stored in local storage)
- Simple tutorial/feature showcase

### 4.2 Whiteboard Interface
- **Top toolbar**: Drawing tools, shapes, colors
- **Left sidebar**: Layers, users online
- **Canvas**: Central drawing area
- **Bottom bar**: Zoom controls, export options
- **Mobile**: Collapsible toolbars, gesture support

## 5. Technical Architecture

### 5.1 Frontend Architecture
```
React App
├── Canvas Component (Fabric.js)
├── Toolbar Components
├── WebSocket Manager
├── State Management (Zustand)
└── Gesture Handlers
```

### 5.2 Backend Architecture
```
Load Balancer
├── WebSocket Servers (Horizontal scaling)
├── REST API Servers
├── Redis (Pub/Sub + Cache)
├── PostgreSQL (Metadata)
└── S3/GCS (Image storage)
```

### 5.3 Data Flow
1. User actions → WebSocket → Server
2. Server → Redis Pub/Sub → All connected clients
3. Persistent data → PostgreSQL
4. Images → S3 with CDN

## 6. Database Schema

### Boards Table
- id (UUID)
- name (VARCHAR)
- width (INT)
- height (INT)
- created_at (TIMESTAMP)
- last_modified (TIMESTAMP)
- is_active (BOOLEAN)
- password_hash (VARCHAR, nullable)

### Board_Users Table
- board_id (UUID, FK)
- user_session_id (UUID)
- user_name (VARCHAR)
- user_color (VARCHAR)
- joined_at (TIMESTAMP)

### Board_Actions Table
- id (BIGINT)
- board_id (UUID, FK)
- action_type (ENUM)
- action_data (JSONB)
- created_at (TIMESTAMP)

## 7. API Endpoints

### REST API
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get board metadata
- `POST /api/boards/:id/export` - Export board as image
- `POST /api/upload` - Upload image

### WebSocket Events
- `join_board` - Join a board session
- `leave_board` - Leave a board session
- `draw_action` - Drawing/shape/text action
- `cursor_move` - Cursor position update
- `board_update` - Broadcast board changes

## 8. Development Phases

### Phase 1: MVP (Week 1-2)
- Basic drawing functionality
- Real-time sync for 2 users
- Simple shapes and colors

### Phase 2: Core Features (Week 3-4)
- Full shape tools
- Text tool
- User presence
- 10-user support

### Phase 3: Advanced Features (Week 5-6)
- Image upload
- Board persistence
- Export functionality
- Mobile optimization

### Phase 4: Production Ready (Week 7-8)
- Performance optimization
- Security hardening
- Deployment setup
- Monitoring and analytics

## 9. Success Metrics

- User engagement: Average session > 5 minutes
- Performance: 99% of actions < 100ms
- Reliability: 99.9% uptime
- User satisfaction: > 4.0/5 rating

## 10. Future Enhancements

- User accounts with board history
- Board templates
- Voice/video chat integration
- AI-powered shape recognition
- Infinite canvas
- Board versioning/history 