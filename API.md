# DroneTV API Documentation

This document outlines the REST API specification for the DroneTV AI Support & Lead Management platform.

- **Production Base URL**: `https://fullstack-chatbot-task-divyal-surse.onrender.com`
- **Local Base URL**: `http://localhost:5000`
- **Default Content Type**: `application/json`

---

## Authentication & Headers

Protected administrative endpoints require an admin authorization header:
```http
x-admin-token: dronetv_admin_secret_2026
```

---

## Summary of Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | Public | Service health and liveness probe |
| `GET` | `/api/enquiries` | Protected | List all enquiries with search, type, and status filtering |
| `GET` | `/api/enquiries/stats` | Protected | Retrieve KPI summary counts by status |
| `GET` | `/api/enquiries/:id` | Protected | Fetch a single enquiry by its unique ID |
| `POST` | `/api/enquiries` | Public | Submit an enquiry from the website or chatbot |
| `PUT` | `/api/enquiries/:id` | Protected | Update enquiry details or status |
| `PATCH` | `/api/enquiries/:id` | Protected | Partially update enquiry fields or status |
| `DELETE` | `/api/enquiries/:id` | Protected | Delete an enquiry record |

---

## Detailed Endpoint Specifications

### 1. Health Check
Checks if the API server is operational.

- **Method**: `GET`
- **Path**: `/api/health`
- **Auth**: None

#### cURL Example
```bash
curl -X GET "https://fullstack-chatbot-task-divyal-surse.onrender.com/api/health"
```

#### Success Response (`200 OK`)
```json
{
  "status": "ok"
}
```

---

### 2. List Enquiries
Retrieves an array of enquiries. Supports filtering by keyword search, user type, and status.

- **Method**: `GET`
- **Path**: `/api/enquiries`
- **Auth**: `x-admin-token`

#### Query Parameters
- `search` *(string, optional)*: Case-insensitive search on name, email, or message.
- `userType` *(string, optional)*: `ALL` | `STUDENT` | `CUSTOMER` | `OTHER`
- `status` *(string, optional)*: `ALL` | `NEW` | `CONTACTED` | `IN_PROGRESS` | `CLOSED`

#### cURL Example
```bash
curl -X GET "https://fullstack-chatbot-task-divyal-surse.onrender.com/api/enquiries?userType=STUDENT&status=NEW" \
  -H "x-admin-token: dronetv_admin_secret_2026"
```

#### Success Response (`200 OK`)
```json
{
  "data": [
    {
      "id": "cmtrjs45g0000ew20m3kp41x8",
      "name": "Aarav Sharma",
      "email": "aarav.pilot@gmail.com",
      "phone": "+91 98765 43210",
      "userType": "STUDENT",
      "interest": "DGCA Remote Pilot Certificate (RPC)",
      "message": "Interested in enrolling in the upcoming weekend training batch.",
      "status": "NEW",
      "createdAt": "2026-09-07T18:01:49.060Z",
      "updatedAt": "2026-09-07T18:01:49.060Z"
    }
  ]
}
```

---

### 3. Get Enquiry by ID
Retrieves the full record of an enquiry by its primary identifier.

- **Method**: `GET`
- **Path**: `/api/enquiries/:id`
- **Auth**: `x-admin-token`

#### cURL Example
```bash
curl -X GET "https://fullstack-chatbot-task-divyal-surse.onrender.com/api/enquiries/cmtrjs45g0000ew20m3kp41x8" \
  -H "x-admin-token: dronetv_admin_secret_2026"
```

#### Success Response (`200 OK`)
```json
{
  "data": {
    "id": "cmtrjs45g0000ew20m3kp41x8",
    "name": "Aarav Sharma",
    "email": "aarav.pilot@gmail.com",
    "phone": "+91 98765 43210",
    "userType": "STUDENT",
    "interest": "DGCA Remote Pilot Certificate (RPC)",
    "message": "Interested in enrolling in the upcoming weekend training batch.",
    "status": "NEW",
    "createdAt": "2026-09-07T18:01:49.060Z",
    "updatedAt": "2026-09-07T18:01:49.060Z"
  }
}
```

#### Error Response (`404 Not Found`)
```json
{
  "error": "Enquiry not found"
}
```

---

### 4. Create Enquiry
Creates a new enquiry record. Used by both the main contact form and the interactive chatbot lead form.

- **Method**: `POST`
- **Path**: `/api/enquiries`
- **Auth**: None (Public)

#### Request Payload
| Field | Type | Required | Constraints |
|---|---|:---:|---|
| `name` | string | Yes | Min 2, max 100 characters |
| `email` | string | Yes | Valid email format |
| `phone` | string | Yes | Valid phone format (`+?[0-9\s\-()]{7,20}`) |
| `userType` | string | Yes | `STUDENT` \| `CUSTOMER` \| `OTHER` |
| `interest` | string | Yes | Min 2, max 150 characters |
| `message` | string | Yes | Min 5, max 2000 characters |

#### cURL Example
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

#### Success Response (`201 Created`)
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

#### Validation Error Response (`400 Bad Request`)
```json
{
  "error": "Validation failed",
  "details": {
    "name": ["Name must be at least 2 characters"],
    "email": ["Please provide a valid email address"],
    "phone": ["Please enter a valid phone number"],
    "message": ["Message must be at least 5 characters"]
  }
}
```

---

### 5. Update Enquiry (PUT / PATCH)
Updates status or other fields of an existing enquiry.

- **Method**: `PUT` or `PATCH`
- **Path**: `/api/enquiries/:id`
- **Auth**: `x-admin-token`

#### Request Payload
```json
{
  "status": "IN_PROGRESS"
}
```
*Valid Status Values*: `NEW`, `CONTACTED`, `IN_PROGRESS`, `CLOSED`

#### cURL Example
```bash
curl -X PUT "https://fullstack-chatbot-task-divyal-surse.onrender.com/api/enquiries/cmtrjs45g0000ew20m3kp41x8" \
  -H "Content-Type: application/json" \
  -H "x-admin-token: dronetv_admin_secret_2026" \
  -d '{"status": "IN_PROGRESS"}'
```

#### Success Response (`200 OK`)
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
    "updatedAt": "2026-09-07T18:22:30.000Z"
  }
}
```

---

### 6. Delete Enquiry
Permanently deletes an enquiry record from the database.

- **Method**: `DELETE`
- **Path**: `/api/enquiries/:id`
- **Auth**: `x-admin-token`

#### cURL Example
```bash
curl -X DELETE "https://fullstack-chatbot-task-divyal-surse.onrender.com/api/enquiries/cmtrjs45g0000ew20m3kp41x8" \
  -H "x-admin-token: dronetv_admin_secret_2026"
```

#### Success Response (`204 No Content`)

---

### 7. KPI Metrics Summary
Returns counts of enquiries aggregated across each status lifecycle stage.

- **Method**: `GET`
- **Path**: `/api/enquiries/stats`
- **Auth**: `x-admin-token`

#### cURL Example
```bash
curl -X GET "https://fullstack-chatbot-task-divyal-surse.onrender.com/api/enquiries/stats" \
  -H "x-admin-token: dronetv_admin_secret_2026"
```

#### Success Response (`200 OK`)
```json
{
  "data": {
    "total": 5,
    "new": 1,
    "contacted": 2,
    "inProgress": 1,
    "closed": 1
  }
}
```

---

## Error Handling Standards

All errors conform to predictable JSON structures:

| HTTP Code | Condition | Response Payload |
|---|---|---|
| `400 Bad Request` | Validation failure on input fields | `{"error": "Validation failed", "details": { ... }}` |
| `400 Bad Request` | Malformed JSON in request body | `{"error": "Invalid JSON payload in request body"}` |
| `404 Not Found` | Requested enquiry ID does not exist | `{"error": "Enquiry not found"}` |
| `429 Too Many Requests` | Rate limit exceeded (> 100 requests in 15 min) | `{"message": "Too many requests, please try again later."}` |
| `500 Internal Error` | Database connection or unhandled runtime failure | `{"error": "An unexpected error occurred. Please try again later."}` |
