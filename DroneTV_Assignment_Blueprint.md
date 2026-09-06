# DroneTV AI Support & Lead Assistant — Full Build Blueprint

Take-home assignment for IPAGE Group (Full Stack Developer Intern). Deadline: 3 days from receipt.

## 1. Tech Stack

- **Frontend:** Vite + React + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Validation:** Zod (both frontend and backend)

Rationale: separate frontend/backend (not a Next.js monolith) to clearly satisfy the spec's explicit "React.js and TypeScript" + "Node.js + Express.js" wording, and to make each grading criterion (API design, DB design, frontend structure) land in its own visibly separate part of the repo.

## 2. Architecture

```
Browser (React app)
   │
   ├── Chatbot (client-side rule matcher + in-chat interactive lead capture card)
   │     │
   │     └── In-chat Enquiry Submission ──┐
   │                                      │
   └── Dedicated Enquiry Form (Contact) ──┴──▶ Express API ──▶ Prisma ──▶ PostgreSQL (Docker)
```

The chatbot provides fast rule-based answers with quick-reply chips, while also supporting an interactive in-chat lead capture card whenever users express interest in services, courses, or speaking with an agent. Both the in-chat form and the dedicated Contact page connect to the same Express API.

## 3. Backend Folder Structure

```
backend/
  src/
    index.ts                    # starts the server
    app.ts                      # Express app: middleware, mounts routes
    routes/
      enquiries.routes.ts       # maps HTTP verb + path -> controller
    controllers/
      enquiries.controller.ts   # reads req, calls service, shapes res
    services/
      enquiries.service.ts      # business logic, talks to Prisma
    validators/
      enquiry.schema.ts         # zod schemas (create/update)
    middleware/
      validate.ts               # runs a zod schema, 400s on failure
      errorHandler.ts           # catches everything, never leaks raw DB errors
    config/
      env.ts                    # loads + validates env vars at boot
  prisma/
    schema.prisma
  .env
  .gitignore
  package.json
  tsconfig.json
```

## 4. Frontend Folder Structure

```
frontend/
  src/
    pages/
      Home.tsx
      Services.tsx
      Courses.tsx
      Contact.tsx
      Admin.tsx
    components/
      Chatbot/
        Chatbot.tsx            # UI: message list, input, send/reset
        chatbotLogic.ts        # pure function: userText -> botResponse
      EnquiryForm/
        EnquiryForm.tsx
      Admin/
        EnquiryTable.tsx
        EnquiryDetailModal.tsx
      Layout/
        Navbar.tsx
        Footer.tsx
    api/
      enquiries.ts             # all fetch calls to backend, one file
    types/
      enquiry.ts               # shared TS interface, mirrors Prisma model
    App.tsx
    main.tsx
  .env
  package.json
  tsconfig.json
```

## 5. Database Schema (Prisma)

```prisma
model Enquiry {
  id          String   @id @default(uuid())
  name        String
  email       String
  phone       String
  userType    UserType
  interest    String
  message     String
  status      Status   @default(NEW)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

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
```

## 6. API Endpoints

| Method | Endpoint | Purpose | Body |
|---|---|---|---|
| GET | /api/enquiries | List all, supports `?search=&userType=&status=` query params | — |
| GET | /api/enquiries/:id | Get one | — |
| POST | /api/enquiries | Create | `{ name, email, phone, userType, interest, message }` |
| PATCH | /api/enquiries/:id | Update (mainly status) | `{ status }` or any updatable field |
| DELETE | /api/enquiries/:id | Delete | — |

Every response uses a consistent shape: `{ data }` on success, `{ error: "message" }` on failure. Never return raw Prisma/Postgres error objects.

## 7. Chatbot — Predefined Q&A

Match user input against keywords (case-insensitive, simple `includes()` checks are enough — no NLP needed):

| Trigger keywords | Response | Action / Feature |
|---|---|---|
| "services" | Describe DroneTV's service offerings | Shows quick-reply chips for specific services |
| "course", "training" | Describe available courses/training | Shows quick-reply chips for courses |
| "contact" | Give contact info / point to Contact page | Link to Contact page |
| "register", "registration" | Explain registration process | Opens in-chat lead capture form |
| "interested in a service" | Prompt to submit details | Triggers in-chat lead capture card (prefill userType=Customer) |
| "student" | Prompt to submit details | Triggers in-chat lead capture card (prefill userType=Student) |
| "speak with someone", "human", "agent" | Team callback prompt | Triggers in-chat lead capture card (priority callback note) |
| *(no match)* | Fallback: "I'm not sure about that — would you like to leave your details so our team can help?" | Shows "Submit Enquiry" button |

**Key Chatbot Features:**
- **Quick-Reply Suggestion Chips**: Rendered right above/below input for 1-click testing of all 7 prompts.
- **Typing Indicator**: 300ms natural delay before bot replies to feel responsive and alive.
- **In-Chat Interactive Lead Capture**: User can fill their Name, Email, Phone, Interest, and Message directly inside the chat window, sending a `POST /api/enquiries` request without having to leave the page.
- **Conversation History**: Maintained in component state (`sessionStorage` persistence).
- **Clear Conversation Button**: One-click reset of messages and chat state.

## 8. Enquiry Form — Fields & Validation

| Field | Type | Validation |
|---|---|---|
| Name | text | required, non-empty |
| Email | text | required, valid email format |
| Phone | text | required, permissive numeric/format check |
| User type | select | Student / Customer / Other |
| Service or course of interest | text | required |
| Message | textarea | required |

Validate identically on frontend (immediate UX feedback) and backend (source of truth — never trust the client alone).

## 9. Admin Dashboard Features

- **KPI Metric Summary Cards**: Total Enquiries, New, Contacted, In Progress, Closed.
- **Live Search**: Instant debounced search matching Name, Email, or Message.
- **Filter Tabs / Dropdowns**: Quick filter by User Type (Student / Customer / Other / All) and Status.
- **Full Detail Modal / Drawer**: Click any row to view complete submission details with timestamp.
- **Status Updater**: Quick status selector per row (`NEW`, `CONTACTED`, `IN_PROGRESS`, `CLOSED`) triggering `PATCH`.
- **Delete with Confirmation**: Delete modal triggering `DELETE`.
- **CSV Export**: Export filtered enquiries list to CSV.
- **Auth Gate**: Simple passcode / token protection for administrative access.

## 10. Error Handling Checklist

- [ ] Empty required fields → 400 with field-level messages
- [ ] Invalid email format → 400
- [ ] Invalid phone format → 400
- [ ] Failed API request (network) → frontend shows a visible error state, never a blank screen
- [ ] Server/DB error → generic `{ error: "Something went wrong" }`, log the real error server-side only
- [ ] Unknown chatbot question → fallback response, never a crash
- [ ] Non-existing enquiry ID → 404 with a clean message

## 11. Security Checklist

- [ ] Validation on both frontend and backend (never trust client alone)
- [ ] Helmet middleware for secure HTTP response headers
- [ ] Rate limiting (`express-rate-limit`) against brute-force / API abuse
- [ ] No `dangerouslySetInnerHTML` or raw HTML rendering of user content
- [ ] `.env` for all secrets, `.env` in `.gitignore`, never hardcoded credentials
- [ ] Admin routes protected (basic auth gate)
- [ ] Proper HTTP status codes for unauthorized/invalid requests (401/400/404), no stack traces sent to client

## 12. Environment Variables & Database Launch

**Docker PostgreSQL (One-command launch):**
```bash
docker compose up -d
```

**backend/.env**
```
DATABASE_URL=postgresql://dronetv_user:dronetv_secure_pass_2026@localhost:5432/dronetv_db?schema=public
PORT=5000
ADMIN_TOKEN=some-secret-value
CORS_ORIGIN=http://localhost:5173
```

**frontend/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 13. README Checklist (required sections per spec)

- [ ] Project description
- [ ] Features
- [ ] Technologies used
- [ ] Project structure
- [ ] Setup instructions
- [ ] Environment variables (names only, not values)
- [ ] Database setup
- [ ] API endpoints (table from section 6)
- [ ] Screenshots
- [ ] Run instructions for frontend AND backend separately
- [ ] Live demo link (if deployed)

## 14. Submission Package Checklist

GitHub repo name: `FullStack_Chatbot_Task_FirstName_LastName`

Google Drive folder: `FullStack_Chatbot_Task_FirstName_LastName/`
- [ ] 01_Source_Code
- [ ] 02_Screenshots (capture as each page is finished, not at the end)
- [ ] 03_API_Documentation (endpoint table + example request/response bodies)
- [ ] 04_Database (schema.prisma + migration/setup notes)
- [ ] 05_Video_Walkthrough (5–10 min: frontend, chatbot, enquiry submission, live API requests via devtools Network tab, live DB records via Prisma Studio, admin dashboard, search/filter, status updates, error handling, then explain the Frontend → API → Backend → Database architecture)
- [ ] 06_GitHub (text file with repo URL)
- [ ] 07_Resume (PDF)

## 15. Build Order

1. Backend scaffold + Prisma schema + migration
2. Backend CRUD endpoints + validation + error handling
3. Frontend shell + static pages (Home, Services, Courses, Contact)
4. Chatbot component + logic, Enquiry form wired to POST endpoint
5. Admin dashboard (table, search, filter, status change, delete, auth gate)
6. Security/error-handling pass against checklists above
7. README, screenshots, video walkthrough, Drive folder packaging, GitHub push
