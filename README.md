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

Create a frontend environment file:

```powershell
cd frontend
New-Item .env
```

Add this value to `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Then install and run the frontend:

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

The frontend reads the backend API URL from `VITE_API_BASE_URL`. If the backend port changes, update `frontend/.env` and restart the frontend dev server.

Backend CORS origins are configured in the backend configuration file. If Vite starts on a different frontend port, such as `5174`, add that origin to the backend CORS configuration and restart the backend.

## API Endpoints

```text
GET  /api/v1/health
POST /api/v1/auth/pin
GET  /api/v1/accounts/{account_id}/balance
POST /api/v1/accounts/{account_id}/deposit
POST /api/v1/accounts/{account_id}/withdraw
GET  /api/v1/accounts/{account_id}/transactions
```

## Assumptions

- I kept the scribble graffiti/sticker assets because they were part of the provided mock and visual specification. I treated them as intentional design assets, not defects. In a real production banking app I would confirm with design/product whether that visual treatment is intentional, but for this assignment I prioritized matching the provided mock.
- I assumed a single demo customer/account was acceptable for the homework scope.
- I used PIN-based authentication because the assignment specifically asks for PIN entry.
- I exposed only the account data needed by the frontend. In a real banking app, sensitive account details would be masked or not sent to the browser.
- I stored the PIN as a hash instead of plain text. For production, I would use a stronger salted hashing approach.
- I kept CORS configuration in the backend config layer because allowed frontend origins are environment-specific infrastructure settings.
- I kept the frontend backend URL in `VITE_API_BASE_URL` so the API host/port can be changed without editing React components.
- I focused on a clean full-stack structure, functional correctness, and close visual alignment rather than building a complete production banking platform.

## Notes

I used SQLite to make the project easy to run locally while still supporting persistence across browser refreshes. The PIN is stored as a hash rather than plain text. In a production banking system, I would use stronger security controls such as salted password hashing, account lockout rules, audit logs, and token-based sessions.
