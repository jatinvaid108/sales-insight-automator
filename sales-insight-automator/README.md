# Sales Insight Automator

> **Rabbitt AI** — Upload quarterly sales data (CSV/XLSX), receive an AI-generated executive summary via email in seconds.

---

## Project Overview

Sales Insight Automator is a full-stack Quick-Response Tool built for Rabbitt AI's sales team. It eliminates the manual effort of extracting insights from large spreadsheets by automating the entire pipeline:

1. User uploads a CSV or XLSX file
2. Backend parses the data into structured JSON
3. Groq's Llama 3 LLM generates a concise executive summary
4. The summary is emailed directly to the user

---

## Architecture

```
Frontend (React + Vite)
    │
    │  POST /api/upload (multipart/form-data)
    ▼
Backend (Express.js)
    │
    ├── Middleware Layer
    │     ├── helmet           — HTTP security headers
    │     ├── cors             — Origin allowlist
    │     ├── rateLimiter      — 100 req / 15 min per IP
    │     └── validateFile     — multer + type/size checks
    │
    ├── Routes → Controllers → Services
    │     ├── fileParser       — CSV (csv-parser) / XLSX (xlsx)
    │     ├── aiService        — Groq API (Llama 3)
    │     └── emailService     — Nodemailer (Gmail)
    │
    └── Centralized Error Handler
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- A [Groq API key](https://console.groq.com)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-org/sales-insight-automator.git
cd sales-insight-automator
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

Backend runs at: `http://localhost:5000`
API Docs at: `http://localhost:5000/api-docs`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Leave VITE_API_URL empty for local dev (proxy is configured)
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                                  | Example                        |
|----------------|----------------------------------------------|--------------------------------|
| `PORT`         | Server port                                  | `5000`                         |
| `NODE_ENV`     | Environment mode                             | `development` / `production`   |
| `GROQ_API_KEY` | Groq API key for Llama 3                     | `gsk_...`                      |
| `EMAIL_USER`   | Gmail address for sending emails             | `you@gmail.com`                |
| `EMAIL_PASS`   | Gmail App Password (not your main password)  | `xxxx xxxx xxxx xxxx`          |
| `FRONTEND_URL` | Allowed CORS origin                          | `https://your-app.vercel.app`  |
| `BACKEND_URL`  | Backend URL shown in Swagger                 | `https://your-api.onrender.com`|

### Frontend (`frontend/.env`)

| Variable        | Description                        | Example                                     |
|-----------------|------------------------------------|---------------------------------------------|
| `VITE_API_URL`  | Backend API base URL (production)  | `https://your-api.onrender.com/api`         |

---

## API Documentation

Swagger UI is available at:

```
http://localhost:5000/api-docs
```

### `POST /api/upload`

**Content-Type:** `multipart/form-data`

| Field   | Type   | Required | Description                    |
|---------|--------|----------|--------------------------------|
| `file`  | File   | ✅       | CSV or XLSX file (max 5MB)     |
| `email` | string | ✅       | Recipient email for the summary|

**Success Response (200)**
```json
{
  "success": true,
  "message": "Summary sent successfully"
}
```

**Error Response (400)**
```json
{
  "success": false,
  "message": "File size exceeds the 5MB limit."
}
```

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add all environment variables from `backend/.env.example`
5. Set `FRONTEND_URL` to your Vercel deployment URL

### Frontend → Vercel

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy

---

## Security Measures

| Measure              | Implementation                                       |
|----------------------|------------------------------------------------------|
| HTTP Security Headers| `helmet` middleware on all routes                    |
| Rate Limiting        | 100 requests per 15 minutes per IP (`express-rate-limit`) |
| CORS Protection      | Explicit origin allowlist via `cors`                 |
| File Type Validation | Extension + multer filter (CSV and XLSX only)        |
| File Size Limit      | 5MB maximum enforced by multer                       |
| Memory-only Storage  | Files never written to disk (multer `memoryStorage`) |
| Error Sanitization   | Stack traces hidden in production                    |
| Environment Secrets  | All secrets via `.env` (never hardcoded)             |

---

## Project Structure

```
sales-insight-automator/
├── backend/
│   ├── src/
│   │   ├── server.js               # Entry point
│   │   ├── app.js                  # Express app setup
│   │   ├── routes/
│   │   │   └── uploadRoutes.js
│   │   ├── controllers/
│   │   │   └── uploadController.js
│   │   ├── services/
│   │   │   ├── fileParser.js       # CSV + XLSX parsing
│   │   │   ├── aiService.js        # Groq API integration
│   │   │   └── emailService.js     # Nodemailer email delivery
│   │   ├── middleware/
│   │   │   ├── validateFile.js     # Multer + file validation
│   │   │   ├── rateLimiter.js      # express-rate-limit config
│   │   │   └── errorHandler.js     # Centralized error handler
│   │   └── config/
│   │       └── swagger.js          # OpenAPI 3.0 spec
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── UploadForm.jsx
    │   │   ├── Loader.jsx
    │   │   └── StatusMessage.jsx
    │   └── services/
    │       └── api.js
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── package.json
```

---

## Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | React 18, Vite 5, Axios                   |
| Backend    | Node.js, Express.js                       |
| AI         | Groq API (Llama 3 — `llama3-8b-8192`)    |
| Email      | Nodemailer (Gmail SMTP)                   |
| Security   | Helmet, express-rate-limit, CORS          |
| File Parse | csv-parser, xlsx, multer                  |
| API Docs   | Swagger UI (OpenAPI 3.0)                  |
| Frontend Deploy | Vercel                               |
| Backend Deploy  | Render                               |

---

## License

MIT — Built with ❤️ for Rabbitt AI
