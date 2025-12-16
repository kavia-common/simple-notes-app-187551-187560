# Notes Backend (Node + Express)

A minimal Express backend for the Simple Notes App. Uses a small JSON file for storage. Provides full CRUD with validation, timestamps, search and sorting.

## Features
- Express server with Helmet, CORS, and logging (morgan)
- Configurable BASE_PATH (defaults to `/api`)
- Health endpoint at `/health` (configurable via REACT_APP_HEALTHCHECK_PATH)
- Notes CRUD mounted at `{BASE_PATH}/notes`
- File-based storage with search (q) and sorting, timestamps (createdAt/updatedAt)
- Centralized error handling with proper status codes

## Quickstart

1. Install dependencies:
   npm install

2. Copy environment file and adjust if needed:
   cp .env.example .env

3. Start in development (auto-reload with nodemon):
   npm run dev

4. Or start normally:
   npm start

The server listens on PORT (default 4000).

## Environment

- PORT=4000
- BASE_PATH=/api
- FRONTEND_URL=http://localhost:3000  (CORS origin; this is read by the server)
- REACT_APP_HEALTHCHECK_PATH=/health   (path for health endpoint)

Extended variables are included for compatibility with shared tooling:
- REACT_APP_API_BASE, REACT_APP_BACKEND_URL, REACT_APP_FRONTEND_URL, etc.

See `.env.example` for a comprehensive list.

## Endpoints

- GET /health — service health
- GET {BASE_PATH}/notes — list notes, supports:
  - q: substring search across title/content
  - sort: sort field (default: updatedAt)
  - order: asc|desc (default: desc)
- POST {BASE_PATH}/notes — create note
  - body: { title: string (required), content?: string }
- GET {BASE_PATH}/notes/:id — get single note
- PUT {BASE_PATH}/notes/:id — update note
  - body: { title?: string (if provided must be non-empty), content?: string }
- DELETE {BASE_PATH}/notes/:id — delete note

## Storage

The storage uses a JSON file at `data/notes.json` inside this container.
Exposed methods: `db.list({q,sort,order})`, `db.get(id)`, `db.create({title,content})`, `db.update(id, {title,content})`, `db.remove(id)`.

## Scripts

- npm start — start the server
- npm run dev — start with nodemon for local development

## Integration Notes

The frontend defaults to `http://localhost:4000/api` as its API base. Ensure this backend is running with:
- PORT=4000
- BASE_PATH=/api
- FRONTEND_URL=http://localhost:3000  (or your frontend origin)

so that the frontend can reach:
- GET http://localhost:4000/api/notes

CORS:
- This server enables CORS for `FRONTEND_URL` and responds to preflight OPTIONS requests.
- If you use a different frontend origin, set `FRONTEND_URL` accordingly.

Test locally:
- Health: `curl -s http://localhost:4000/health`
- List notes: `curl -s http://localhost:4000/api/notes`
- Create: `curl -s -X POST http://localhost:4000/api/notes -H "Content-Type: application/json" -d '{"title":"Test","content":"Hello"}'`
