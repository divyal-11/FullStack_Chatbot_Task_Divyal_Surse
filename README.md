# DroneTV — AI Support & Lead Management System

A full-stack enterprise web application and AI assistant built for **DroneTV**, an Indian commercial aerial drone solutions and DGCA-certified pilot training academy.

This project strictly fulfills all requirements of the **IPAGE Group Full Stack Developer Technical Assignment**, featuring a React + TypeScript frontend, an intelligent rule-based chatbot with in-chat lead submission, a cloud PostgreSQL database, and a real-time admin management dashboard.

---

## 🌐 Live Deployments

| Component | Platform | URL |
|---|---|---|
| **Frontend** | Vercel | [https://full-stack-chatbot-task-divyal-surs.vercel.app](https://full-stack-chatbot-task-divyal-surs.vercel.app) |
| **Backend API** | Render | [https://fullstack-chatbot-task-divyal-surse.onrender.com](https://fullstack-chatbot-task-divyal-surse.onrender.com) |
| **Database** | Neon Cloud PostgreSQL | Hosted on AWS (`ap-southeast-1`) |
| **Admin Dashboard** | Direct URL | [https://full-stack-chatbot-task-divyal-surs.vercel.app/admin](https://full-stack-chatbot-task-divyal-surs.vercel.app/admin) |

> **Admin Demo Token**: `dronetv_admin_secret_2026` *(Quick Demo Access button available on login page)*

---

## 📋 Evaluation Checklist & Feature Compliance

| Requirement | Must Have | Status | Implementation Details |
|---|:---:|:---:|---|
| **React + TypeScript** | ✅ | Done | Built with React 19, TypeScript, and Vite with strict typing |
| **Responsive desktop / tablet / mobile** | ✅ | Done | Fluid CSS Grid & Flexbox, responsive breakpoints at 1024px, 768px, 480px |
| **Landing / Home Page** | ✅ | Done | High-impact hero, radar animation, stats, testimonials, CTA |
| **Services Section** | ✅ | Done | 4 enterprise aerial solutions (LiDAR, Training, Thermal, Agriculture) |
| **Courses / Training Section** | ✅ | Done | 3 DGCA-certified pilot courses with curriculum, duration, and pricing |
| **Chatbot UI** | ✅ | Done | Floating launcher widget, spring physics transitions (`motion/react`) |
| **Rule-based Chatbot** | ✅ | Done | Predefined query chips, keyword engine, and contextual responses |
| **User + Bot Conversation History** | ✅ | Done | Persistent session storage across page reloads via `sessionStorage` |
| **Unknown-question Fallback** | ✅ | Done | Graceful fallback response with follow-up chips and direct enquiry prompt |
| **Reset Conversation** | ✅ | Done | One-click `↺` reset button in chat header clearing state and storage |
| **Enquiry from Chatbot** | ✅ | Done | Embedded interactive lead form inside chat messages |
| **Enquiry Fields** | ✅ | Done | Name, Email, Phone, User Type, Interest, Message |
| **Frontend Validation** | ✅ | Done | Client-side regex, email format, phone digits, min-lengths |
| **Backend Validation** | ✅ | Done | Server-side Zod schemas (`createEnquirySchema`, `updateEnquirySchema`) |
| **POST Enquiry** | ✅ | Done | `POST /api/enquiries` creates record in PostgreSQL |
| **GET All Enquiries** | ✅ | Done | `GET /api/enquiries` with search, `userType`, and `status` query filters |
| **GET Enquiry by ID** | ✅ | Done | `GET /api/enquiries/:id` returns single enquiry record or 404 |
| **PUT / PATCH Enquiry** | ✅ | Done | Both `PUT` and `PATCH /api/enquiries/:id` supported for status updates |
| **DELETE Enquiry** | ✅ | Done | `DELETE /api/enquiries/:id` removes enquiry with confirmation |
| **PostgreSQL Database** | ✅ | Done | Live Neon PostgreSQL managed via Prisma ORM with automated migrations |
| **Admin Dashboard** | ✅ | Done | `/admin` portal (direct URL only) with KPI overview |
| **Search Enquiries** | ✅ | Done | Live search by name, email, interest, or message content |
| **Student / Customer Filter** | ✅ | Done | Filter tabs: `All Types`, `Student`, `Customer`, `Other` |
| **View Details** | ✅ | Done | "View" modal showing full enquiry payload, timestamps, and metadata |
| **Change Status** | ✅ | Done | Real-time dropdown changing status with optimistic UI & KPI card update |
| **Delete Enquiry** | ✅ | Done | Protected delete action with double-confirmation dialog |
| **Statuses** | ✅ | Done | Exactly matches spec: `New`, `Contacted`, `In Progress`, `Closed` |
| **Error Handling** | ✅ | Done | Masked 500 errors, clean 400 validation JSON, 404 for missing IDs |
| **Security Requirements** | ✅ | Done | Helmet security headers, rate limiting (100 req/15 min), sanitized CORS |
| **Environment Variables** | ✅ | Done | Separated `.env` configs, credentials strictly gitignored |
| **GitHub + README** | ✅ | Done | Complete documentation, schema explanations, and local run steps |
| **API Documentation** | ✅ | Done | Detailed request/response schemas with sample cURLs |
| **Walkthrough Guide** | ✅ | Done | Step-by-step 5–10 min presentation script included below |

---

## 🎯 Deep Dive: Critical Assignment Highlights

### 1. Chatbot → Enquiry Submission Flow
The chatbot is an interactive lead acquisition channel:
1. **Triggering Enquiry Flow**: The user can click the `"Submit an Enquiry"` chip or type natural variations like *"I want to submit an enquiry"*, *"contact"*, *"register"*, or *"quote"*.
2. **In-Chat Lead Form**: An embedded interactive form renders directly within the chat message stream:
   - **Full Name** (text, min 2 characters)
   - **Email Address** (email, regex validated)
   - **Phone Number** (tel, min 7 digits, formatted)
   - **User Type** (dropdown: `Student`, `Customer`, `Other`)
   - **Service / Course Interest** (dropdown of DroneTV offerings)
   - **Message / Requirements** (textarea, min 5 characters)
3. **Validation & State**: Immediate inline validation errors if fields are invalid or missing.
4. **Submission**: Dispatches `POST /api/enquiries`. Upon response, the bot confirms receipt with the unique enquiry reference ID (e.g., `#5PTOI7`) and locks the form with a success badge.
5. **Session Persistence**: Messages and submission status remain intact even if the user refreshes the page, with a 1-click `↺` reset button to start fresh.

---

### 2. Multi-Tier Security & Error Handling

```
[ User Input ]
      │
      ▼
[ Layer 1: Frontend Validation ]
  • Immediate client feedback
  • Regex checks: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ for email
  • Phone validation: /^\+?[0-9\s\-()]{7,20}$/
  • Field length constraints
      │
      ▼
[ Layer 2: Network & Gateway Security ]
  • Helmet: CSP, HSTS, X-Content-Type-Options, Frameguard
  • Rate Limiting: 100 requests per 15-minute window via express-rate-limit
  • Strict CORS: Origin validated and sanitized
      │
      ▼
[ Layer 3: Backend Schema Validation (Zod) ]
  • Strict typing and schema parsing (createEnquirySchema)
  • Returns HTTP 400 with structured field-level error messages
      │
      ▼
[ Layer 4: Database & Error Masking ]
  • Prisma ORM with parameterized PostgreSQL queries (SQL injection immune)
  • Non-existing IDs return clean HTTP 404: {"error": "Enquiry not found"}
  • Malformed JSON payloads return HTTP 400: {"error": "Invalid JSON payload in request body"}
  • Internal DB/Server errors return generic HTTP 500 without leaking stack traces or credentials
```

---

## 📡 API Reference & Documentation

### Base URLs
- **Production**: `https://fullstack-chatbot-task-divyal-surse.onrender.com`
- **Local**: `http://localhost:5000`

---

### 1. Health Check
```http
GET /api/health
```
**Response (200 OK):**
```json
{
  "status": "ok"
}
```

---

### 2. List Enquiries (with Filters & Search)
```http
GET /api/enquiries?search={term}&userType={type}&status={status}
Headers:
  x-admin-token: dronetv_admin_secret_2026
```
**Query Parameters (Optional):**
- `search`: Filter by name, email, interest, or message substring.
- `userType`: `ALL` | `STUDENT` | `CUSTOMER` | `OTHER`
- `status`: `ALL` | `NEW` | `CONTACTED` | `IN_PROGRESS` | `CLOSED`

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "cmtrjs45g0000ew20m3kp41x8",
      "name": "Rajesh Verma",
      "email": "rajesh.verma@aerialops.in",
      "phone": "+91 98765 12345",
      "userType": "CUSTOMER",
      "interest": "Aerial Survey & 3D LiDAR Mapping",
      "message": "Need full LiDAR mapping survey for a 200 hectare industrial zone.",
      "status": "IN_PROGRESS",
      "createdAt": "2026-09-07T18:01:49.060Z",
      "updatedAt": "2026-09-07T18:14:20.120Z"
    }
  ]
}
```

---

### 3. Get Enquiry by ID
```http
GET /api/enquiries/:id
Headers:
  x-admin-token: dronetv_admin_secret_2026
```
**Response (200 OK):**
```json
{
  "data": {
    "id": "cmtrjs45g0000ew20m3kp41x8",
    "name": "Rajesh Verma",
    "email": "rajesh.verma@aerialops.in",
    "phone": "+91 98765 12345",
    "userType": "CUSTOMER",
    "interest": "Aerial Survey & 3D LiDAR Mapping",
    "message": "Need full LiDAR mapping survey for a 200 hectare industrial zone.",
    "status": "IN_PROGRESS",
    "createdAt": "2026-09-07T18:01:49.060Z",
    "updatedAt": "2026-09-07T18:14:20.120Z"
  }
}
```
**Error Response (404 Not Found):**
```json
{
  "error": "Enquiry not found"
}
```

---

### 4. Create New Enquiry (Public / Chatbot)
```http
POST /api/enquiries
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Priya Patel",
  "email": "priya.patel@agrotech.in",
  "phone": "+91 91234 56789",
  "userType": "CUSTOMER",
  "interest": "Precision Agriculture & Crop Health",
  "message": "Requesting multispectral crop inspection for 500-acre farm in Gujarat."
}
```
**Response (201 Created):**
```json
{
  "data": {
    "id": "cmtrkx12a0001ew20m7zq91p3",
    "name": "Priya Patel",
    "email": "priya.patel@agrotech.in",
    "phone": "+91 91234 56789",
    "userType": "CUSTOMER",
    "interest": "Precision Agriculture & Crop Health",
    "message": "Requesting multispectral crop inspection for 500-acre farm in Gujarat.",
    "status": "NEW",
    "createdAt": "2026-09-07T18:20:15.000Z",
    "updatedAt": "2026-09-07T18:20:15.000Z"
  }
}
```
**Error Response (400 Bad Request — Validation Failure):**
```json
{
  "error": "Validation failed",
  "details": {
    "email": ["Please provide a valid email address"],
    "phone": ["Please enter a valid phone number"]
  }
}
```

---

### 5. Update Enquiry Status (PUT / PATCH)
```http
PATCH /api/enquiries/:id
PUT /api/enquiries/:id
Content-Type: application/json
Headers:
  x-admin-token: dronetv_admin_secret_2026
```
**Request Body:**
```json
{
  "status": "CONTACTED"
}
```
**Response (200 OK):**
```json
{
  "data": {
    "id": "cmtrjs45g0000ew20m3kp41x8",
    "status": "CONTACTED",
    "updatedAt": "2026-09-07T18:22:30.000Z"
  }
}
```

---

### 6. Delete Enquiry
```http
DELETE /api/enquiries/:id
Headers:
  x-admin-token: dronetv_admin_secret_2026
```
**Response (204 No Content)**

---

### 7. KPI Metrics Summary
```http
GET /api/enquiries/stats
Headers:
  x-admin-token: dronetv_admin_secret_2026
```
**Response (200 OK):**
```json
{
  "data": {
    "total": 6,
    "new": 2,
    "contacted": 2,
    "inProgress": 1,
    "closed": 1
  }
}
```

---

## 💻 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/divyal-11/FullStack_Chatbot_Task_Divyal_Surse.git
cd FullStack_Chatbot_Task_Divyal_Surse

# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create `.env` in `backend/`:
```env
PORT=5000
DATABASE_URL="postgresql://neondb_owner:npg_GbEsdmN0Th1P@ep-blue-sun-b3dxnfr5-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
ADMIN_TOKEN=dronetv_admin_secret_2026
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Create `.env` in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ADMIN_TOKEN=dronetv_admin_secret_2026
```

### 3. Run Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit:
- Frontend: `http://localhost:5173`
- Admin Dashboard: `http://localhost:5173/admin`
- Backend Health: `http://localhost:5000/api/health`

---

## 📹 5–10 Minute Walkthrough Script (Evaluation Guide)

When presenting or recording the walkthrough video:

1. **Introduction (1 min)**:
   - Introduce DroneTV: enterprise aerial survey and DGCA pilot academy.
   - Mention tech stack: React 19 + TypeScript, Node.js + Express, Prisma + PostgreSQL (Neon), hosted on Vercel + Render.
2. **Landing Experience & Navigation (1.5 min)**:
   - Show responsive desktop, tablet, and mobile layouts.
   - Highlight the aviation dark theme, telemetry aesthetic, radar sweep animation, and smooth section glide.
3. **Rule-Based Chatbot & Q&A (1.5 min)**:
   - Click floating *"Ask DroneTV AI"* launcher.
   - Click predefined query chips (*"What services does DroneTV provide?"*, *"What courses are available?"*).
   - Type an unrecognized question to demonstrate the fallback response.
   - Click `↺` to demonstrate conversation reset and session clearing.
4. **Chatbot → Enquiry Submission Flow (2 min)**:
   - Click *"Submit an Enquiry"*.
   - Trigger validation errors by submitting empty/invalid values.
   - Fill in valid lead details (Name, Email, Phone, User Type: Customer, Interest: Aerial Survey, Message).
   - Submit and show the confirmation message with the generated reference ID.
5. **Security & Validation Architecture (1.5 min)**:
   - Explain the 4-layer validation flow (Frontend regex → Gateway Rate Limiting/Helmet → Backend Zod validation → PostgreSQL).
   - Show how backend returns clean 400/404 messages while masking internal server errors (500).
6. **Admin Dashboard at `/admin` (2 min)**:
   - Open `/admin` via direct URL.
   - Authenticate with the admin token (or click *"Quick Demo Access"*).
   - Point out the real-time KPI cards (Total, New, Contacted, In Progress, Closed).
   - Show the newly submitted enquiry at the top of the table.
   - Click *"View"* to inspect the modal details.
   - Change status to *"In Progress"* and demonstrate real-time KPI card synchronization.
   - Test search and filtering by *"Customer"*.
   - Demonstrate the CSV export and delete confirmation dialog.

---

## 🛡️ License & Credits
Built for the IPAGE Group Full Stack Developer Technical Assignment. Designed and engineered by **Divyal Surse**.
