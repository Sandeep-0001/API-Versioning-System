# API Versioning System

A complete full-stack solution demonstrating industry-standard API versioning strategies, backward compatibility, and smooth data migration. 

##  Overview
This project implements a robust **API Versioning System** that allows multiple API versions (V1 and V2) to coexist. It features a **Node.js/Express backend** with distinct versioned routes and a **React frontend** that interacts with both versions simultaneously.

Key capabilities include:
- **Dual API Support**: V1 (Single Name) and V2 (Split Name) running side-by-side.
- **Backward Compatibility**: A Translation Layer allows V2 endpoints to accept V1 data formats.
- **Deprecation Warning**: Middleware injects `Warning` and `X-Deprecation-Date` headers for older versions.
- **Data Migration**: Automated scripts to migrate and transform data from V1 to V2 collections.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Features**: Rate Limiting, CORS, Helmet, Morgan

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS (Custom Theme: Cream, Dark Green, Terracotta)
- **HTTP Client**: Axios

## Project Structure

```
API-Versioning-System/
├── backend/
│   ├── src/
│   │   ├── v1/          # V1 Routes, Controllers, Models
│   │   ├── v2/          # V2 Routes, Controllers, Models
│   │   ├── middleware/  # Deprecation & Security Middleware
│   │   └── utils/       # Translation Layer
│   └── scripts/         # Data Migration Scripts
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI Components
    │   └── services/    # API Integration
    └── ...
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Server runs on `http://localhost:3000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

## Key Features Guide

### API Versioning
- **V1**: `POST /api/v1/users` - Accepts `{ "name": "John Doe", "email": "..." }`
- **V2**: `POST /api/v2/users` - Accepts `{ "firstName": "John", "lastName": "Doe", "email": "..." }`

### Backward Compatibility
You can send a **V1 payload** to the **V2 endpoint**, and the system will automatically translate it:
```bash
# Sending V1 format to V2 endpoint
curl -X POST http://localhost:3000/api/v2/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Jane Doe", "email": "jane@example.com"}'
# Result: Stored as firstName="Jane", lastName="Doe" in V2 collection
```

### Data Migration
To migrate existing V1 users to the V2 structure:
```bash
cd backend
node scripts/migrate_v1_to_v2.js
```

##  Frontend Theme
The UI uses a custom "Bold" personality theme:
- **Background**: Cream (`#FDF6E3`)
- **Primary Text**: Dark Green (`#1A3C40`)
- **Accents**: Terracotta (`#E67E51`) & Mustard (`#E6B325`)

