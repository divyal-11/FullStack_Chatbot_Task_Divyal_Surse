# DroneTV — AI Support & Lead Management System

A full-stack enterprise web application and AI assistant built for **DroneTV**, an Indian commercial aerial drone solutions and DGCA-certified pilot training academy.

This project strictly fulfills all requirements of the **IPAGE Group Full Stack Developer Technical Assignment**, featuring a React + TypeScript frontend, an intelligent rule-based chatbot with in-chat lead submission, a cloud PostgreSQL database, and a real-time admin management dashboard.

---

## 🌐 Live Demo Links

| Component | Platform | URL |
|---|---|---|
| **Frontend Application** | Vercel | [https://full-stack-chatbot-task-divyal-surs.vercel.app](https://full-stack-chatbot-task-divyal-surs.vercel.app) |
| **Backend REST API** | Render | [https://fullstack-chatbot-task-divyal-surse.onrender.com](https://fullstack-chatbot-task-divyal-surse.onrender.com) |
| **Cloud Database** | Neon PostgreSQL | Hosted on AWS (`ap-southeast-1`) via Serverless Pooler |
| **Admin Dashboard** | Direct Route | [https://full-stack-chatbot-task-divyal-surs.vercel.app/admin](https://full-stack-chatbot-task-divyal-surs.vercel.app/admin) |
| **API Health Probe** | Public Endpoint | [https://fullstack-chatbot-task-divyal-surse.onrender.com/api/health](https://fullstack-chatbot-task-divyal-surse.onrender.com/api/health) |

> **Admin Demo Token**: `dronetv_admin_secret_2026` *(A 1-click **Quick Demo Access** button is provided on the admin login screen for instant evaluation)*

---

## 📸 Screenshots

### 1. Landing Page & Aviation Telemetry Hero
*Dark aviation instrument panel theme with interactive radar sweep and operational telemetry metrics:*
![DroneTV Landing Page](docs/screenshots/hero.png)

### 2. Commercial Aerial Services & DGCA Courses
*Full catalog of enterprise drone surveying solutions and DGCA-certified pilot courses:*
![DroneTV Services](docs/screenshots/core_services.png)
![DroneTV Courses](docs/screenshots/pilot_courses.png)

### 3. AI Chatbot with Embedded Lead Routing Form
*Rule-based AI assistant with quick-reply chips, conversation reset, and in-chat lead enquiry form:*
![Chatbot Lead Form](docs/screenshots/chatbot.png)

### 4. Admin Management Dashboard (`/admin`)
*Real-time KPI overview cards, search bar, Student/Customer filter tabs, and full enquiries table:*
![Admin Dashboard](docs/screenshots/admin.png)

### 5. Enquiry Inspection Modal & Lifecycle Management
*Modal displaying complete lead details, timestamp metadata, and live status updater:*
![Admin Details Modal](docs/screenshots/modal.png)

---

## 🚀 Features

### 1. Modern Aviation Frontend Experience
- **Single-Page Section Glide**: Fluid smooth-scroll navigation across `#home`, `#services`, `#courses`, and `#contact` sections using GSAP and Motion physics.
- **Deep-Linked Views**: Dedicated route URLs (`/`, `/services`, `/courses`, `/contact`, `/admin`) with synced navbar active state.
- **Dark Aviation Aesthetic**: Instrument-panel theme using curated dark tokens (`#0D1117`, `#161B22`), amber highlights (`#F2A63C`), and sage telemetry accents (`#68D391`).
- **Fully Responsive**: Seamless layout transitions tailored for mobile (<480px), tablet (768px), and high-DPI desktop viewports (>1024px).

### 2. Rule-Based Chatbot Assistant
- **Predefined Query Matching**: 1-click quick-reply chips for core inquiries:
  - *"What services does DroneTV provide?"*
  - *"What courses / training are available?"*
  - *"How can I contact DroneTV?"*
  - *"How can I register?"*
  - *"I am interested in a service."*
  - *"I am a student."*
  - *"I want to speak with someone."*
- **Chatbot → Enquiry Submission Flow**: Prominently allows submitting official enquiries right inside the chat window with all 6 required fields (Name, Email, Phone, User Type, Interest, Message).
- **Session Continuity**: Entire conversation history stored in `sessionStorage`, persisting across page refreshes.
- **1-Click Reset (`↺`)**: Clears conversation state and resets storage with a single click.
- **Unknown-Question Fallback**: Graceful guidance for unmatched queries, suggesting follow-up chips or prompting enquiry routing.

### 3. Administrative Enquiry Portal (`/admin`)
- **Navbar Access & Direct Route**: Accessible directly via the **Admin** button in the top navigation bar or via the direct route `/admin`.
- **Real-Time KPI Cards**: Live counters for **Total Leads**, **New**, **Contacted**, **In Progress**, and **Closed**.
- **Search & Multi-Filtering**: Instant search by Name, Email, or Interest with tabbed filters for User Type (`All Types`, `Student`, `Customer`, `Other`) and Status (`All Status`, `New`, `Contacted`, `In Progress`, `Closed`).
- **Detailed Modal Inspection**: "View" button opens an inspector displaying all lead fields and timestamp logs.
- **Live Status Progression**: Real-time status update dropdown with optimistic UI and instant KPI sync.
- **Safe Deletion**: Protected delete action with double-confirmation dialog.
- **CSV Data Export**: 1-click download exporting all filtered leads to CSV format.

### 4. Multi-Layer Security & Error Handling
- **Frontend Validation**: Client-side regex for email, minimum 7-digit phone, and required lengths.
- **Network Gateway Security**: Helmet security headers (CSP, HSTS, X-Content-Type-Options) and rate-limiting (100 req / 15 min).
- **Backend Schema Validation**: Strict Zod validation returning structured HTTP `400 Bad Request` messages.
- **Error Concealment**: Server/database runtime failures return generic HTTP `500` messages, concealing stack traces and internal connection strings.
- **Non-Existent Records**: Missing enquiry IDs return clean HTTP `404 Not Found` messages (`{"error": "Enquiry not found"}`).

---

## 🛠️ Technologies Used

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Motion (`motion/react`), GSAP, Axios |
| **Backend** | Node.js, Express 5, TypeScript, Zod, Helmet, CORS, Express Rate Limit |
| **Database & ORM** | PostgreSQL (Neon Cloud Serverless), Prisma ORM 6 |
| **Deployment & Hosting** | Vercel (Frontend SPA), Render (Backend Web Service), Neon (Cloud PostgreSQL) |
| **Styling** | Vanilla CSS Design System with custom HSL/Aviation variables, Glassmorphism, CSS Grid & Flexbox |

---

## 📁 Project Structure

```
fullstack-chatbot-task/
├── backend/
│   ├── prisma/
│   │   ├── migrations/             # SQL migration files
│   │   │   └── 20260907_init/      # Initial schema migration
│   │   ├── schema.prisma           # Prisma schema & PostgreSQL enums
│   │   ├── seed.ts                 # Database seeder script
│   │   └── dev_data.json           # Automatic fallback data store
│   ├── src/
│   │   ├── config/                 # Environment & Prisma client configuration
│   │   ├── controllers/            # Express controllers (CRUD, stats, health)
│   │   ├── middleware/             # Validation (Zod) & Error handling
│   │   ├── routes/                 # Express route definitions
│   │   ├── services/               # Business logic & database operations
│   │   ├── validators/             # Zod schemas (create, update, query)
│   │   ├── app.ts                  # Express app setup, security headers, routing
│   │   └── index.ts                # Server listener entry point
│   ├── .env.example
│   ├── package.json
│   ├── render.yaml                 # Render infrastructure-as-code deployment config
│   └── tsconfig.json
├── docs/
│   └── screenshots/                # Application screenshots for documentation
├── frontend/
│   ├── src/
│   │   ├── assets/                 # SVGs and static brand icons
│   │   ├── components/
│   │   │   ├── Chatbot/            # AI assistant widget & in-chat lead form
│   │   │   ├── Footer/             # Responsive minimal aviation footer
│   │   │   ├── Navbar/             # Fixed gliding navbar
│   │   │   ├── PageTransition/     # Viewport transition wrapper
│   │   │   └── Radar/              # Interactive radar sweep canvas component
│   │   ├── pages/
│   │   │   ├── home.tsx            # Full landing page (Hero, Services, Courses, Contact)
│   │   │   ├── services.tsx        # Commercial aerial services catalog
│   │   │   ├── courses.tsx         # DGCA pilot training courses catalog
│   │   │   ├── contact.tsx         # Dedicated contact & consultation form
│   │   │   └── admin.tsx           # Admin Enquiry Management Dashboard
│   │   ├── types/                  # Shared TypeScript interfaces & types
│   │   ├── utils/                  # Axios API utility functions
│   │   ├── App.tsx                 # Route definitions & router setup
│   │   ├── main.tsx                # Application root mounting
│   │   └── index.css               # Global typography & design tokens
│   ├── .env.example
│   ├── package.json
│   ├── vercel.json                 # Vercel SPA client-side routing rewrites
│   └── vite.config.ts
├── API.md                          # Standalone REST API documentation
├── DroneTV_Assignment_Blueprint.md
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or yarn
- **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/divyal-11/FullStack_Chatbot_Task_Divyal_Surse.git
cd FullStack_Chatbot_Task_Divyal_Surse
```

---

### 2. Environment Variables Configuration

#### Backend Configuration (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
# Server Port
PORT=5000

# PostgreSQL Connection String (Neon Cloud or Localhost)
DATABASE_URL="postgresql://username:password@hostname:5432/dronetv_db?sslmode=require"

# Admin Access Token (Protecting all admin endpoints)
ADMIN_TOKEN="your-secure-admin-token"

# Allowed CORS Origin for Local Development
CORS_ORIGIN=http://localhost:5173

# Environment Mode
NODE_ENV=development
```

#### Frontend Configuration (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:
```env
# Backend Base URL (Point to localhost for local dev or production URL)
VITE_API_BASE_URL=http://localhost:5000

# Admin Access Token (Supplied with admin requests for evaluation/demo)
VITE_ADMIN_TOKEN="your-secure-admin-token"
```

> **Security Note on Client-Side Tokens**: In client-side single-page applications, variables prefixed with `VITE_` are embedded into the client build. For this demonstration project, `VITE_ADMIN_TOKEN` allows seamless evaluation of the protected admin dashboard and CRUD API. For production architectures, an enterprise admin portal would use httpOnly session cookies or an OAuth 2.0 / JWT identity provider.

---

## 🗄️ Database Setup

The project uses **Prisma ORM** with **PostgreSQL**.

### Schema Definition
The database model includes the `Enquiry` entity with `UserType` and `Status` enums:
```prisma
enum UserType {
  STUDENT
  CUSTOMER
  OTHER
}

enum Status {
  NEW
  CONTACTED
  IN_PROGRESS
  CLOSED
}

model Enquiry {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String
  userType  UserType @default(CUSTOMER)
  interest  String
  message   String
  status    Status   @default(NEW)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Applying Migrations & Seeding
From the `backend/` directory:
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations to your PostgreSQL instance
npx prisma migrate deploy

# (Optional) Seed realistic leads into the database
npx ts-node prisma/seed.ts
```

> **Automatic Fallback Engine**: If PostgreSQL is temporarily unreachable or offline during local evaluation, the backend automatically falls back to an internal JSON data store (`backend/prisma/dev_data.json`), ensuring that the frontend and admin dashboard work seamlessly out of the box with zero runtime errors.

---

## 🏃 Run Instructions

### Running the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```
The backend will launch at **`http://localhost:5000`**.
- Health Check: `http://localhost:5000/api/health`
- Interactive API Dashboard: `http://localhost:5000/`

---

### Running the Frontend

```bash
# In a separate terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will launch at **`http://localhost:5173`**.
- Public Landing Page: `http://localhost:5173`
- Admin Dashboard: `http://localhost:5173/admin`

---

## 📡 API Endpoints Specification

Complete details and cURL examples are available in [API.md](API.md).

| Method | Endpoint | Access | Purpose | Request Body / Query Params |
|---|---|:---:|---|---|
| `GET` | `/` | Public | Interactive API status landing page | — |
| `GET` | `/api` | Public | API discovery catalog | — |
| `GET` | `/api/health` | Public | Service health & liveness probe | — |
| `GET` | `/api/enquiries` | Protected | List all enquiries with search & filters | `?search=&userType=&status=` |
| `GET` | `/api/enquiries/stats` | Protected | KPI metrics summary | — |
| `GET` | `/api/enquiries/:id` | Protected | Retrieve single enquiry by ID | — |
| `POST` | `/api/enquiries` | Public | Create new enquiry (Chatbot / Contact) | `{ name, email, phone, userType, interest, message }` |
| `PUT` | `/api/enquiries/:id` | Protected | Update enquiry status / fields | `{ status }` |
| `PATCH` | `/api/enquiries/:id` | Protected | Update enquiry status / fields | `{ status }` |
| `DELETE` | `/api/enquiries/:id` | Protected | Delete enquiry record | — |

### Sample `POST /api/enquiries` Request
```bash
curl -X POST "https://fullstack-chatbot-task-divyal-surse.onrender.com/api/enquiries" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Verma",
    "email": "rajesh.verma@aerialops.in",
    "phone": "+91 98765 12345",
    "userType": "CUSTOMER",
    "interest": "Aerial Survey & 3D LiDAR Mapping",
    "message": "Need full LiDAR mapping survey for a 200 hectare industrial zone."
  }'
```

### Sample `POST /api/enquiries` Response (`201 Created`)
```json
{
  "data": {
    "id": "cmtrkx12a0001ew20m7zq91p3",
    "name": "Rajesh Verma",
    "email": "rajesh.verma@aerialops.in",
    "phone": "+91 98765 12345",
    "userType": "CUSTOMER",
    "interest": "Aerial Survey & 3D LiDAR Mapping",
    "message": "Need full LiDAR mapping survey for a 200 hectare industrial zone.",
    "status": "NEW",
    "createdAt": "2026-09-07T18:20:15.000Z",
    "updatedAt": "2026-09-07T18:20:15.000Z"
  }
}
```

---

## 🛡️ License & Authorship
Built for the **IPAGE Group Full Stack Developer Technical Assignment**. Designed and engineered by **Divyal Surse**.
