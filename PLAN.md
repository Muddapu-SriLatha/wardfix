# CivicFix - Comprehensive Architecture & Project Blueprint

CivicFix is a modern, full-stack civic problem reporting and resolution tracking web application. It empowers citizens to report local infrastructure issues (such as potholes, uncollected garbage, broken streetlights, water leaks, and damaged signs) using geotagged photographs. It provides real-time status tracking via WebSockets and an interactive GIS map, automated AI image classification for category verification, and a municipal admin dashboard with spatial analytics for city management.

---

## 1. System Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                 React (Vite SPA) + Leaflet Maps + Socket.io                   |  |
|  |    Citizen Mobile/Desktop Portal   |      Municipal Admin Dashboard         |  |
|  +-----------------------------------------------------------------------------+  |
+------------------------------------------+----------------------------------------+
                                           |
                              Dual Proxying via Vite Dev Server / Nginx
                      +--------------------+--------------------+
                      | /api & /socket.io                       | /ai
                      v                                         v
+------------------------------------------+   +------------------------------------+
|               BACKEND TIER                |   |              AI TIER               |
|                                          |   |                                    |
|  Node.js + Express REST API              |   |  FastAPI Microservice              |
|  - JWT Authentication & Auth Middleware  |   |  - PyTorch / torchvision           |
|  - Multer + EXIF GPS Metadata Extractor  |   |  - `/ai/classify` Image Endpoint   |
|  - Socket.io Real-Time Event Gateway     |   |  - Automated Category & Severity   |
|  - Knex Query Builder / Spatial Queries  |   |    Prediction                      |
+---------------------+--------------------+   +------------------------------------+
                      |
                      v
+-----------------------------------------------------------------------------------+
|                                DATABASE TIER                                      |
|                                                                                   |
|  PostgreSQL 15+ with PostGIS Spatial Extension                                     |
|  - `geometry(Point, 4326)` Spatial Indexing (GIST)                                |
|  - Spatial Proximity & Density Clustering Queries (`ST_DWithin`, `ST_ClusterDBSCAN`) |
|  - Relational Schema for Users, Issues, Categories, Comments, Upvotes, Logs       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Technology Stack & Rationale

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | Fast HMR, component-driven architecture, ideal for rich single-page interfaces. |
| **Styling & Icons** | Vanilla CSS Tokens + Lucide Icons | Clean, high-performance styling without heavy framework overhead; glassmorphism design system. |
| **Interactive Maps** | Leaflet + React-Leaflet | Open-source, lightweight GIS mapping library supporting OpenStreetMap tiles, custom markers, and geo-selection. |
| **Real-Time Gateway** | Socket.io Client / Server | Bidirectional event emitter for instant status updates, live upvote counters, and admin alert broadcasts. |
| **Backend Runtime** | Node.js + Express | Async I/O for handling file uploads, API requests, and WebSocket connections seamlessly. |
| **Database** | PostgreSQL 15 + PostGIS | Enterprise-grade spatial relational database supporting spatial indexes (`GIST`), geographic coordinates (`EPSG:4326`), and spatial functions (`ST_DWithin`, `ST_Distance`). |
| **Query & Migrations** | Knex.js | Flexible SQL query builder with robust schema migration and seeding tools. |
| **AI Classification** | Python FastAPI + torchvision | High-performance Python async web engine dedicated to running computer vision models for issue classification. |
| **EXIF Extractor** | `exif-parser` / `jpeg-js` | Server-side utility for extracting embedded GPS coordinates (lat/lng), camera timestamps, and device metadata from uploaded image headers. |

---

## 3. Directory Structure

```
civicfix/
├── PLAN.md                         # Comprehensive Architecture Blueprint
├── docker-compose.yml              # Multi-container orchestration (DB, API, AI)
├── .env.example                    # Master environment variables template
├── .gitignore                      # Git exclusion rules
├── README.md                       # Documentation & Quickstart Guide
│
├── client/                         # Frontend React SPA
│   ├── package.json
│   ├── vite.config.js              # Vite config with dual API & WebSocket proxies
│   ├── index.html
│   └── src/
│       ├── main.jsx                # React app mounting point
│       ├── App.jsx                 # Main application component & routes
│       ├── index.css               # Global glassmorphism design system
│       ├── services/
│       │   ├── api.js              # Axios/Fetch HTTP client module
│       │   └── socket.js           # Socket.io connection manager
│       ├── components/
│       │   ├── Navbar.jsx          # Header & navigation
│       │   ├── IssueCard.jsx       # Issue feed item component
│       │   ├── IssueMap.jsx        # Interactive Leaflet GIS map
│       │   ├── CategoryBadge.jsx   # Status & category tag pills
│       │   └── AnalyticsChart.jsx  # Chart renderers for Admin Dashboard
│       └── pages/
│           ├── ReportIssuePage.jsx # Citizen reporting form wizard with EXIF & AI autofill
│           ├── IssueDetailPage.jsx # Issue detail page with comments & timeline
│           ├── IssueListPage.jsx   # List/Grid view of reported issues with filters
│           └── AdminDashboard.jsx  # Municipal analytics dashboard
│
├── server/                         # Backend Express API Service
│   ├── package.json
│   ├── knexfile.js                 # Knex database configuration
│   ├── .env.example
│   ├── src/
│   │   ├── index.js                # Express & Socket.io entry point
│   │   ├── config/
│   │   │   └── db.js               # PostgreSQL connection pool
│   │   ├── utils/
│   │   │   └── exifExtractor.js    # EXIF metadata parser utility
│   │   ├── db/
│   │   │   ├── migrations/         # PostGIS database migrations
│   │   │   │   └── 20260816000000_init_civicfix_schema.js
│   │   │   └── seeds/              # Mock sample data seeds
│   │   │       └── 01_civicfix_seed.js
│   │   ├── websocket/
│   │   │   └── socketHandler.js    # Socket.io event emitter handlers
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT verification middleware
│   │   │   └── uploadMiddleware.js # Multer image storage middleware
│   │   ├── controllers/
│   │   │   ├── authController.js   # User registration & login logic
│   │   │   ├── issueController.js  # Issue CRUD, upvotes, spatial queries
│   │   │   └── adminController.js  # Municipal analytics & status update handlers
│   │   └── routes/
│   │       ├── authRoutes.js       # /api/auth endpoints
│   │       ├── issueRoutes.js      # /api/issues endpoints
│   │       └── adminRoutes.js      # /api/admin endpoints
│   └── uploads/                    # Local storage directory for user photos
│
└── ai-service/                     # Python FastAPI Image Classifier Service
    ├── requirements.txt            # Python dependencies
    ├── Dockerfile                  # Container definition for AI service
    ├── main.py                     # FastAPI application script
    ├── classifier.py               # ML model loading & inference engine
    └── models/                     # Model weights & label definitions
```

---

## 4. PostGIS Database Schema Design

### 4.1 Tables & Entity Relationships

```
+-------------------+        +-------------------+        +-------------------+
|      USERS        |        |    CATEGORIES     |        |      ISSUES       |
+-------------------+        +-------------------+        +-------------------+
| id (PK)           |<-------| id (PK)           |<-------| id (PK)           |
| email             |        | name              |        | title             |
| password_hash     |        | icon              |        | description       |
| full_name         |        | sla_hours         |        | category_id (FK)  |
| role (citizen/    |        +-------------------+        | reporter_id (FK)  |
|      admin)       |                                     | status            |
| department        |                                     | priority          |
+-------------------+                                     | image_url         |
        |                                                 | location (Point)  |<--- PostGIS WGS84
        |                                                 | address           |
        |                                                 | latitude          |
        |                                                 | longitude         |
        |                                                 | exif_data (JSONB) |
        |                                                 | ai_confidence     |
        |                                                 | upvotes_count     |
        |                                                 +-------------------+
        |                                                           |
        +----------------------------+------------------------------+
                                     |
                +--------------------+--------------------+
                v                                         v
+-------------------------------+       +-------------------------------+
|           COMMENTS            |       |           UPVOTES             |
+-------------------------------+       +-------------------------------+
| id (PK)                       |       | id (PK)                       |
| issue_id (FK)                 |       | issue_id (FK)                 |
| user_id (FK)                  |       | user_id (FK)                  |
| content                       |       | created_at                    |
| is_internal (boolean)         |       +-------------------------------+
| created_at                    |
+-------------------------------+
```

### 4.2 PostGIS Spatial Definition SQL

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen', -- 'citizen', 'admin', 'field_worker'
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'alert-circle',
    default_priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    sla_hours INT DEFAULT 48
);

-- Issues Table with Spatial Geometry
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- 'submitted', 'verified', 'in_progress', 'resolved', 'rejected'
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    image_url VARCHAR(512),
    location GEOMETRY(Point, 4326), -- Spatial WGS84 Point
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    address TEXT,
    neighborhood VARCHAR(150),
    exif_data JSONB, -- Extracted camera/GPS EXIF metadata
    ai_predicted_category VARCHAR(100),
    ai_confidence NUMERIC(5, 4), -- e.g., 0.9420
    upvotes_count INT DEFAULT 0,
    assigned_department VARCHAR(100),
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial GIST Index for spatial queries
CREATE INDEX idx_issues_location ON issues USING GIST (location);

-- Comments & Activity Logs Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    issue_id INT REFERENCES issues(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE, -- Internal notes for municipal admins
    status_change VARCHAR(50), -- Optional status change recorded with comment
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Upvotes Table
CREATE TABLE upvotes (
    id SERIAL PRIMARY KEY,
    issue_id INT REFERENCES issues(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(issue_id, user_id)
);
```

---

## 5. API Routes Specification

### 5.1 Authentication (`/api/auth`)
- `POST /api/auth/register`: Register citizen or admin account.
- `POST /api/auth/login`: Authenticate user and return JWT bearer token.
- `GET /api/auth/me`: Get active user profile info.

### 5.2 Issues Management & Spatial Endpoints (`/api/issues`)
- `POST /api/issues`: Create new issue report. Expects `multipart/form-data` containing image file + report details. Parses EXIF data, invokes AI classification, inserts spatial `Point(lng lat)` into PostGIS, and broadcasts Socket.io notification.
- `GET /api/issues`: Fetch list of issues with filter parameters (`category`, `status`, `priority`, `page`, `limit`).
- `GET /api/issues/nearby`: Spatial radius query. Accepts `lat`, `lng`, `radius_km`. Uses PostGIS `ST_DWithin` to find nearby issues.
- `GET /api/issues/:id`: Fetch single issue details, including comments and upvote state.
- `POST /api/issues/:id/upvote`: Toggle upvote on an issue. Updates `upvotes_count` and emits real-time WebSocket update.
- `POST /api/issues/:id/comments`: Add a comment or internal work note.

### 5.3 Municipal Admin & Analytics (`/api/admin`)
- `GET /api/admin/analytics`: Get high-level summary metrics (total issues, resolution rate, average SLA compliance time, category breakdown).
- `GET /api/admin/clusters`: Perform PostGIS density clustering (`ST_ClusterDBSCAN`) to detect problem hot-spots on map.
- `PATCH /api/admin/issues/:id/status`: Update issue status (`in_progress`, `resolved`, `rejected`), assign department, and emit real-time updates.

### 5.4 AI Classification Microservice (`/ai`)
- `POST /ai/classify`: FastAPI endpoint receiving image binary; returns top predicted category (`pothole`, `garbage`, `streetlight_broken`, `water_leak`, `other`), confidence score, and severity grade.
- `GET /ai/health`: Microservice health check.

---

## 6. Real-Time WebSocket Architecture

Socket.io is initialized on the Node.js server. Clients auto-connect on application mount and join spatial or topic rooms.

### Event Definitions
| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `issue:created` | Server -> All | `{ issueId, title, category, location, status }` | Broadcasted when a citizen submits a new report. Appends marker to active map. |
| `issue:status_updated` | Server -> All / Room | `{ issueId, oldStatus, newStatus, resolvedAt }` | Broadcasted when admin changes progress status. Updates status badge in real time. |
| `issue:upvoted` | Server -> All | `{ issueId, upvotesCount }` | Real-time counter sync across active user views. |
| `admin:alert` | Server -> Admin Room | `{ issueId, priority, title }` | Urgent notification sent to admins when high-severity issue is created. |

---

## 7. Dual API Proxy Configuration in Vite (`client/vite.config.js`)

To simplify local development without CORS friction:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/ai': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai/, ''),
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});
```

---

## 8. Development & Deployment Workflow

1. **Environment Setup**: Copy `.env.example` to `.env` in root and `server/`.
2. **Docker Orchestration**: Run `docker-compose up -d` to spin up PostgreSQL + PostGIS, Express Backend, and FastAPI AI Service simultaneously.
3. **Database Migration & Seeding**: Execute `npm run db:migrate` and `npm run db:seed` in `server/`.
4. **Vite Dev Server**: Start frontend with `npm run dev` in `client/` at `http://localhost:3000`.
