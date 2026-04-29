# CS 348 Project

Full-stack inventory app with a Flask + SQLAlchemy backend and a React + Vite frontend.

## Repository Structure

- `backend/` - Flask API and data models
- `frontend/project/` - React client

## Prerequisites

- Python 3.11+ (or compatible local Python)
- Node.js 18+
- npm

## Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app/app.py
```

Backend runs at `http://127.0.0.1:5000`.

## Frontend Setup

```bash
cd frontend/project
npm install
npm run dev
```

Frontend runs at `http://127.0.0.1:5173`.

## Notes

- The frontend proxies `/api/*` requests to the Flask backend via `vite.config.ts`.
- Local/generated artifacts such as `venv`, `node_modules`, and build output are ignored by git.
