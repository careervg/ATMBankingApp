# ATM Banking App

I created a full-stack ATM banking demo application based on the provided mockups. The application allows a user to enter a PIN, view their balance, deposit funds, withdraw funds, and see updated account information.

## Tech Stack

### Frontend

- React
- JavaScript
- Vite
- ESLint

### Backend

- Python
- FastAPI
- SQLite

## Features

- PIN-based authentication
- Balance inquiry
- Deposit funds
- Withdraw funds
- Persistent account balance using SQLite
- Transaction records for deposits and withdrawals
- Backend API validation and error handling
- CORS configuration for frontend/backend communication
- Mock-based ATM UI using provided assets

## Prerequisites

Before running the project, make sure these are installed:

- Python 3.10 or higher
- Node.js LTS, which includes npm

Check versions:

```powershell
python --version
node -v
npm -v
```

## Demo User

```text
Customer: Peter Parker
PIN: 1234
Starting Balance: $1,250.00
```

## How To Run

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Backend runs at:

```text
http://127.0.0.1:8000
```

API docs:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://127.0.0.1:5173
```

If Vite uses another port, such as `5174`, update backend CORS settings.

The frontend dependencies are installed from `frontend/package.json`. This includes React, Vite, and ESLint-related packages.

## API Endpoints

```text
GET  /api/v1/health
POST /api/v1/auth/pin
GET  /api/v1/accounts/{account_id}/balance
POST /api/v1/accounts/{account_id}/deposit
POST /api/v1/accounts/{account_id}/withdraw
GET  /api/v1/accounts/{account_id}/transactions
```

## Notes

I used SQLite to make the project easy to run locally while still supporting persistence across browser refreshes. The PIN is stored as a hash rather than plain text. In a production banking system, I would use stronger security controls such as salted password hashing, account lockout rules, audit logs, and token-based sessions.
