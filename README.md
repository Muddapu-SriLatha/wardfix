# 🏙️ CivicFix - Civic Problem Reporting & Tracking System

**CivicFix** is a full-stack civic engagement platform that allows citizens to capture, geotag, and report municipal problems (potholes, trash build-up, broken streetlights, water main breaks) with automated AI verification and real-time status updates, while providing city leaders with spatial analytics and management tools.

---

## 🌟 Key Features

- **📸 Geotagged Photo Reporting**: Citizens upload photos with automatic EXIF GPS metadata extraction.
- **🤖 Automated AI Classification**: Python FastAPI microservice analyzes issue images to auto-fill category and severity predictions.
- **🗺️ GIS Spatial Mapping**: Leaflet interactive map rendering issue markers, cluster density heatmaps, and spatial proximity filtering (`ST_DWithin`).
- **⚡ Real-Time WebSocket Sync**: Instant updates for status changes, new report creation, and upvote counters via Socket.io.
- **📊 Municipal Admin Analytics**: Dashboard with SLA tracking, resolution metrics, and problem spatial distribution graphs.

---

## 🛠️ Technology Stack

- **Client**: React (Vite), Leaflet GIS, Socket.io Client, Lucide Icons, Vanilla CSS Glassmorphism
- **Server API**: Node.js, Express, Socket.io, Knex.js, `exif-parser`, JWT, Multer
- **AI Microservice**: Python FastAPI, PyTorch / torchvision, Pillow, Pydantic
- **Database**: PostgreSQL 15 + PostGIS Spatial Extension

---

## 🚀 Quickstart Guide

### 1. Prerequisite Checklist
- [Node.js (v18+)](https://nodejs.org/)
- [Python (v3.10+)](https://www.python.org/)
- [Docker Desktop](https://www.docker.com/) (Optional for containerized database & services)
- [PostgreSQL with PostGIS extension](https://postgis.net/)

### 2. Setup Environment Variables
```bash
cp .env.example .env
cp server/.env.example server/.env
```

### 3. Run via Docker Compose (Recommended)
```bash
docker-compose up -d
```

### 4. Manual / Local Development Setup

#### Database Setup
Ensure PostgreSQL is running and create the PostGIS database:
```sql
CREATE DATABASE civicfix_db;
\c civicfix_db;
CREATE EXTENSION postgis;
```

#### Server Backend Setup
```bash
cd server
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

#### AI Microservice Setup
```bash
cd ai-service
python -m venv venv
# On Windows: venv\Scripts\activate
# On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python main.py
```

#### Frontend Client Setup
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📖 Architecture & Blueprint

For full architectural details, ER diagrams, PostGIS spatial queries, and API specifications, consult **[PLAN.md](file:///c:/Users/SRI%20LATHA/OneDrive/Desktop/New%20folder/PLAN.md)**.
