# Spendly - AI-powered Personal Finance Dashboard

Spendly is a modern, responsive personal finance dashboard that helps you track your expenses, visualize your spending patterns, and get personalized advice from an AI advisor.

## Project Structure

```text
spendly/
├── backend/                  # Express & MongoDB backend API
│   ├── middleware/           # Authentication & request middlewares
│   ├── models/               # Mongoose data models (User, Expense)
│   ├── routes/               # Express API routes (/auth, /expenses)
│   ├── .env.example          # Sample backend environment configuration
│   ├── package.json          # Backend dependencies & scripts
│   └── server.js             # API entry point (port 5000)
│
├── frontend/                 # React + Vite frontend application
│   ├── src/                  # React components, pages, stores & hooks
│   ├── index.html            # Vite HTML template
│   ├── tailwind.config.js    # Tailwind CSS styling configuration
│   ├── vite.config.js        # Vite bundler configuration
│   ├── .env.example          # Sample frontend environment configuration
│   └── package.json          # Frontend dependencies & scripts
│
├── package.json              # Monorepo root scripts
└── README.md
```

## Features
- **Dashboard:** Visualize your spending with Donut, Area, and Bar charts.
- **Expense Tracking:** Add, edit, and categorize your transactions.
- **Advanced Filtering:** Sort by category, date range, and amount.
- **AI Advisor:** Integrated with Google Gemini Flash to give specific, actionable financial advice based on your exact spending history.
- **Authentication & Backend Sync:** Full user authentication (JWT) with MongoDB storage and local fallback.
- **Local Persistence:** Data cached locally with `Zustand` and `localStorage`.

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS v3, Zustand, React Router v6, Recharts, Lucide Icons
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, BcryptJS
- **AI Integration:** Google Gemini API

---

## Setup & Running Instructions

### 1. Install Dependencies

You can install dependencies for both frontend and backend from the root:
```bash
npm run install:all
```
Or individually:
```bash
# Frontend
npm run install:frontend
# or: cd frontend && npm install

# Backend
npm run install:backend
# or: cd backend && npm install
```

### 2. Configure Environment Variables

**Frontend (`frontend/.env`):**
Create `frontend/.env` based on `frontend/.env.example`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Backend (`backend/.env`):**
Create `backend/.env` based on `backend/.env.example`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/spendly
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

### 3. Run Applications

**From project root:**
```bash
# Run Frontend (Vite dev server)
npm run dev:frontend

# Run Backend (Express API server)
npm run dev:backend
```

**Or directly inside respective folders:**
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```
