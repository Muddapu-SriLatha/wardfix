# 📍 WardFix – Urban Infrastructure & Ward Problem Resolution Portal

> **"Your Ward, Your Voice"** — An Enterprise Full-Stack Municipal Operations & Spatial Intelligence System.

[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-00d8ff.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933.svg)](https://nodejs.org/)
[![Python FastAPI](https://img.shields.io/badge/AI_Service-FastAPI%20%2B%20PyTorch-009688.svg)](https://fastapi.tiangolo.com/)
[![Leaflet GIS](https://img.shields.io/badge/Spatial-Leaflet%20GIS-199900.svg)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🏙️ Executive Overview

**WardFix** is an end-to-end urban infrastructure management platform engineered to connect citizens, municipal authorities, and field maintenance crews. Built specifically to handle high-stakes civic issues (potholes, coal dust pollution, open manholes, drainage blockages, and water leaks), WardFix automates the entire lifecycle of problem detection, proximity deduplication, contractor dispatch, and resolution verification.

---

## ✨ Key Features & Capability Matrix

### 👤 1. Citizen Engagement & One-Touch Reporting
* **📍 One-Touch Geotagging**: Automatic EXIF GPS coordinate extraction from smartphone camera photos.
* **🎙️ Multilingual Voice Note Complaints**: Voice recording support powered by WebSpeech API for Hindi, English, Bengali, Tamil, and Telugu.
* **📊 4-Step Resolution Tracker**: Real-time visual timeline tracker (*Pending $\rightarrow$ In Review $\rightarrow$ Work Scheduled $\rightarrow$ Completed*).
* **👍 Community Upvoting**: Citizen backing counter to prioritize urgent neighborhood complaints.

### 🤖 2. Smart AI & 50-Meter Proximity Deduplication Engine
* **🔍 AI Image Classification**: Python FastAPI microservice utilizing PyTorch for automatic category and SLA priority detection.
* **📍 50m Proximity Ticket Merging**: Haversine GIS algorithm automatically detects duplicate complaints within 50 meters, merging them into a single master ticket while incrementing the affected citizen counter.

### 📊 3. Municipal Officer Triage & Dispatcher
* **🗺️ Interactive GIS Map & Heatmap**: Split-screen report feed and Leaflet map displaying active ward complaints across Dhanbad and urban municipal zones.
* **🚜 Contractor Work Order Dispatcher**: Direct ticket assignment to field crews with department SLA timers (12h, 24h, 48h).

### 🚜 4. Field Contractor Operations
* **🗺️ Turn-by-Turn Route Navigation**: 1-click Google Maps GPS navigation to exact complaint coordinates.
* **📷 Resolution Proof Photo Upload**: Required before-and-after photo verification prior to closing municipal work orders.

---

## 🛠️ Technology Stack

| Layer | Technology & Libraries |
| :--- | :--- |
| **Client Frontend** | React 18, Vite, Leaflet GIS, Socket.io Client, Lucide React Icons, Vanilla CSS |
| **Backend REST API** | Node.js, Express.js, Socket.io, Knex.js SQL Query Builder, Multer, `exif-parser`, JWT |
| **AI Microservice** | Python 3.10, FastAPI, Uvicorn, PyTorch (`torchvision`), Pillow, Pydantic |
| **Database & GIS** | SQLite (Dev) / PostgreSQL 15 + PostGIS Extension (Prod) |

---

## 📄 Resume & Portfolio Project Descriptions

### 🎯 **Option A: Concise Resume Bullet Points (Ideal for Software Engineering Resumes)**
```text
WardFix | Full-Stack Urban Infrastructure & Municipal Resolution System
• Developed a full-stack civic platform connecting citizens, officers, and contractors with React 18, Node.js, and Leaflet GIS.
• Engineered a 50-meter Haversine proximity deduplication algorithm in Express.js to automatically merge duplicate citizen tickets.
• Integrated a Python FastAPI microservice with PyTorch image classification for automated issue categorization and SLA priority assignment.
• Built multilingual voice recording tools (Hindi, English, Bengali, Tamil, Telugu) and 4-step real-time resolution timeline trackers.
```

### 🎯 **Option B: Portfolio & LinkedIn Project Summary**
```text
WardFix is an enterprise urban management portal designed to streamline municipal issue reporting and resolution. 
Featuring 1-touch EXIF geotagging, multilingual voice note complaints, AI image classification, 50m radius duplicate merging, 
and role-aware portals for Citizens, Municipal Officers, and Field Contractors.
```

---

## 🚀 Quickstart & Local Setup Guide

### 1. Prerequisites
* **Node.js**: `v18.0.0` or higher
* **Python**: `v3.10.0` or higher
* **Git**: `v2.30.0` or higher

### 2. Installation & Running Locally

#### 🟢 Step A: Start Express Backend API Server
```bash
cd server
npm install
npm run dev
```
*Server runs at `http://localhost:5000`*

#### 🔵 Step B: Start React Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend app runs at `http://localhost:3000`*

#### 🟡 Step C: Start Python AI Microservice (Optional)
```bash
cd ai-service
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python main.py
```
*AI service runs at `http://localhost:8000`*

---

## 🌐 Demo Credentials (Local Testing)

| Role | Email | Password | Dashboard Features |
| :--- | :--- | :--- | :--- |
| **Citizen** | `aarav@civicfix.in` | `password123` | Report issues, track timeline, upvote complaints |
| **Municipal Officer** | `admin@bbmp.gov.in` | `password123` | Triage queue, department analytics, contractor dispatch |
| **Field Contractor** | `contractor@pwd.gov.in` | `password123` | Assigned work orders, GPS route maps, proof photo upload |

---

## 📜 License & Copyright

Designed & Developed by **[Muddapu-SriLatha](https://github.com/Muddapu-SriLatha)**.  
Released under the [MIT License](LICENSE).
