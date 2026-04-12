# Spendly - AI-powered Personal Finance Dashboard

Spendly is a modern, responsive personal finance dashboard that helps you track your expenses, visualize your spending patterns, and get personalized advice from an AI advisor.

## Features
- **Dashboard:** Visualize your spending with Donut, Area, and Bar charts.
- **Expense Tracking:** Add, edit, and categorize your transactions.
- **Advanced Filtering:** Sort by category, date range, and amount.
- **AI Advisor:** Integrated with Google Gemini 2.0 Flash to give specific, actionable financial advice based on your exact spending history.
- **Local Persistence:** Your data is kept locally on your device with zero-setup using `localStorage` and `Zustand`.


## Tech Stack
- React 18 + Vite
- Tailwind CSS v3
- Zustand (State management)
- React Router v6
- Recharts (Data visualization)
- Gemini API (AI context injection)

## Setup Instructions
1. Clone the repository and navigate into the project directory.
2. Run `npm install` to install dependencies.
3. Replace the API key in `.env` if you wish to use your own Gemini key (there is an `.env.example` provided).
4. Run `npm run dev` to start the local development server.

