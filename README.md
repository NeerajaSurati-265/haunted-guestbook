# Haunted Guestbook

A tiny full-stack app: ghosts sign a guestbook, the living read it.

- `frontend/` — Vite + React. Reads the API address from `VITE_API_URL`.
- `backend/` — FastAPI. `GET /api/entries`, `POST /api/entries`, `DELETE /api/entries/{id}`.

Entries live in memory, so they reset when the server restarts.

## Run locally

```bash
# backend
cd backend
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000

# frontend (another terminal)
cd frontend
cp .env.example .env
npm install
npm run build && npx vite preview --port 5173
```
