# AgriMit Full Setup & Run - Newly Pulled Repo

## Plan Steps (Using ./backend + AgriMit/frontend):

### 1. Backend Setup & Run [ ]

```
cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Loads agrimit_v2_production.h5, /v1/analyze ready.

### 2. Frontend Setup & Run [ ]

```
cd AgriMit/frontend && npm install && npm run dev
```

- Port 5173, connects to backend:8000.

### 3. Verify [ ]

- Backend: curl http://localhost:8000 (or browser).
- Frontend: localhost:5173 → Login → FarmerView → ChatBot buttons.

### 4. Update TODOs [ ]

- Mark AgriMit/frontend/TODO.md step 5-7 done.

## Progress Tracking
