# DroneTV — AI Support & Lead Assistant

A full-stack enterprise web application and AI assistant built for **DroneTV**, an Indian commercial aerial drone solutions and DGCA-certified pilot training academy.

This project fulfills the IPAGE Group Full Stack Developer Technical Assignment requirements, delivering an interactive frontend, intelligent flight & training chatbot, lead capture workflows, and a real-time admin management dashboard.

---

## 🚀 Key Features

### 1. Modern Aviation Frontend
- **Single-Page Smooth Glide Experience**: Built with React, TypeScript, Vite, and GSAP/Motion smooth scrolling between sections (`Home`, `Services`, `Courses`, `Contact`).
- **Dedicated Route Views**: Deep-linked dedicated routes (`/services`, `/courses`, `/contact`, `/admin`).
- **Aviation & Industrial Theme**: High-contrast dark palette (`#0D1117`, `#161B22`), amber accent (`#F2A63C`), and sage flight telemetry highlights (`#68D391`).
- **Fully Responsive**: Optimized for mobile, tablet, and high-resolution desktop displays.

### 2. Intelligent Chatbot Assistant
- **Predefined Q&A Support**: Instant 1-click quick-reply chips for all required predefined inquiries:
  1. *"What services does DroneTV provide?"*
  2. *"What courses / training are available?"*
  3. *"How can I contact DroneTV?"*
  4. *"How can I register?"*
  5. *"I am interested in a service."*
  6. *"I am a student."*
  7. *"I want to speak with someone."*
- **Interactive In-Chat Lead Form**: Direct inquiry routing right inside the chat window collecting Name, Email, Phone, User Type, Interest, and Message.
- **Client & Server Validation**: Strict regex and format checks on email, phone, and required lengths.
- **Session Continuity**: Message history persisted across page refreshes via `sessionStorage`.
- **Reset Chat**: 1-click conversation clear and restart option (`↺`).
- **Graceful Fallback**: Natural fallback response for unmatched inputs with quick-reply suggestions.

### 3. Administrative Enquiry Dashboard (`/admin`)
- **Direct Access**: Accessible via `/admin`, direct top navbar button, and footer link.
- **KPI Summary Cards**: Real-time counters for **Total Leads**, **New**, **Contacted**, **In Progress**, and **Closed**.
- **Instant Search**: Search through enquiries by Name, Email, or Interest.
- **Filter Tabs**: Filter leads by user type (`All Types`, `Student`, `Customer`, `Other`) and status (`All Status`, `New`, `Contacted`, `In Progress`, `Closed`).
- **Full Detail Inspection**: Click "View" to open modal with full message and timestamp metadata.
- **Dynamic Status Lifecycle**: Dropdown updates status (`NEW`, `CONTACTED`, `IN_PROGRESS`, `CLOSED`) with instant optimistic KPI card updates.
- **Delete Confirmation**: Protected deletion with confirmation modal.
- **Export to CSV**: 1-click download of all filtered inquiries to CSV format.
- **Access Gate**: Admin token validation with a one-click Quick Demo Access option for evaluators.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Motion (`motion/react`), GSAP (ScrollToPlugin), Axios |
| **Backend** | Node.js, Express 5, TypeScript, Zod, Helmet, CORS, Express Rate Limit |
| **Database & ORM** | Prisma 6, PostgreSQL, Resilient Local JSON/In-Memory Dev Store |
| **Styling** | Vanilla CSS with curated aviation design tokens, glassmorphism, responsive CSS Grid/Flexbox |

---

## 📁 Project Structure

```
fullstack-chatbot-task/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma DB model & enums
│   │   ├── seed.ts             # Realistic sample leads seeder
│   │   └── dev_data.json       # Auto-synced local fallback store
│   ├── src/
│   │   ├── config/             # Environment & Prisma client setup
│   │   ├── controllers/        # Express route handlers (CRUD & Stats)
│   │   ├── middleware/         # Zod validator & error handling
│   │   ├── routes/             # Enquiries & health router
│   │   ├── services/           # Business logic & dual DB/fallback engine
│   │   ├── validators/         # Zod schemas (create, update, query)
│   │   ├── app.ts              # Express application configuration
│   │   └── index.ts            # Server entry point (port 5000)
│   ├── .env.example
│   ├── docker-compose.yml      # Optional local PostgreSQL container
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chatbot/        # Chatbot widget & in-chat lead form
│   │   │   ├── Footer/         # Responsive footer with company links
│   │   │   └── Navbar/         # Gliding navigation with Admin link
│   │   ├── pages/
│   │   │   ├── home.tsx        # Landing page (Hero, Services, Courses, Contact)
│   │   │   ├── services.tsx    # Services catalog view
│   │   │   ├── courses.tsx     # Training & DGCA curriculum view
│   │   │   ├── contact.tsx     # Full contact & mission enquiry form
│   │   │   └── admin.tsx       # Admin Enquiry Dashboard
│   │   ├── types/              # Shared TypeScript definitions
│   │   ├── utils/              # Axios API client functions
│   │   ├── App.tsx             # Route declarations & page transitions
│   │   └── main.tsx            # React application root
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── DroneTV_Assignment_Blueprint.md
└── README.md
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Request Body / Query |
|---|---|---|---|
| `GET` | `/api/health` | Service health status | — |
| `GET` | `/api/enquiries` | List enquiries with optional filters | `?search=&userType=&status=` |
| `GET` | `/api/enquiries/stats` | KPI summary metrics (total, new, contacted, inProgress, closed) | — |
| `GET` | `/api/enquiries/:id` | Retrieve single enquiry details | — |
| `POST` | `/api/enquiries` | Create new enquiry (Chatbot & Contact form) | `{ name, email, phone, userType, interest, message }` |
| `PATCH` | `/api/enquiries/:id` | Update enquiry status or fields | `{ status }` |
| `DELETE` | `/api/enquiries/:id` | Delete enquiry | — |

---

## ⚙️ Setup & Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- *(Optional)* Docker Desktop if running PostgreSQL locally

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run the development server
npm run dev
```

The backend server will launch on **`http://localhost:5000`**.

> **Note on Database**: If PostgreSQL is running on `localhost:5432`, Prisma will automatically connect to it. If PostgreSQL is not active, the backend automatically falls back to the built-in local store ([`dev_data.json`](file:///c:/Users/divya/Projects/fullstack-chatbot-task/backend/prisma/dev_data.json)), allowing the application and Admin Dashboard to work completely out of the box with zero external configuration!

---

### 2. Frontend Setup

```bash
# In a separate terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start the Vite development server
npm run dev
```

The frontend application will be live at **`http://localhost:5173`**.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
- `PORT`: Server port (default: `5000`)
- `DATABASE_URL`: PostgreSQL connection string
- `ADMIN_TOKEN`: Secret key for admin dashboard access (default: `dronetv_admin_secret_2026`)
- `CORS_ORIGIN`: Allowed client origin (default: `http://localhost:5173`)

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL`: Backend API base URL (default: `http://localhost:5000`)
- `VITE_ADMIN_TOKEN`: Admin unlock token (default: `dronetv_admin_secret_2026`)

---

## 🧪 Testing Checklist & Verification

- [x] **Home Navigation**: Smooth glide scrolling to `#home`, `#services`, `#courses`, `#contact` with fixed navbar and shared layout active indicator.
- [x] **Predefined Questions**: All 7 predefined questions supported via chips and text matching.
- [x] **Lead Collection**: All 6 fields (Name, Email, Phone, User type, Interest, Message) validated before transmission.
- [x] **Session Persistence**: Chatbot maintains conversation in `sessionStorage` and offers 1-click reset.
- [x] **Admin Dashboard**: Real-time KPI summary, live search, student/customer filtering, status change with dynamic KPI updates, full detail modal, and delete confirmation.
- [x] **Responsive Layout**: Tested across desktop, tablet, and mobile viewports.
- [x] **Build Validation**: Clean TypeScript compilation and production builds across both `backend` and `frontend`.
