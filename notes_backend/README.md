# Notes Backend (Node + Express)

A minimal Express backend for the Simple Notes App. Uses a small JSON file for storage (scaffold). This step sets up the server, middleware, health endpoint, and a notes route scaffold (CRUD to be implemented in the next step).

## Features (Current)
- Express server with Helmet, CORS, and logging (morgan)
- Configurable BASE_PATH (defaults to `/api`)
- Health endpoint at `/health`
- Notes route scaffold mounted at `{BASE_PATH}/notes`
- Simple file-based storage module scaffold

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
- FRONTEND_URL=http://localhost:3000

Extended variables are included for compatibility with shared tooling:
- REACT_APP_API_BASE, REACT_APP_BACKEND_URL, REACT_APP_FRONTEND_URL, etc.

See .env.example for a comprehensive list.

## Endpoints

- GET /health — service health
- GET {BASE_PATH}/notes — list notes (currently returns an array, empty on first run)
- Other CRUD routes are scaffolded and return 501 Not Implemented for now:
  - POST {BASE_PATH}/notes
  - GET {BASE_PATH}/notes/:id
  - PUT {BASE_PATH}/notes/:id
  - DELETE {BASE_PATH}/notes/:id

## Storage

The storage uses a JSON file at `data/notes.json` inside this container. The storage module exposes `db.list()` currently; additional methods will be implemented in the next step.

## Scripts

- npm start — start the server
- npm run dev — start with nodemon for local development

## Integration Notes

The frontend defaults to `http://localhost:4000/api` as its API base. Ensure this backend is running with:
- PORT=4000
- BASE_PATH=/api

so that the frontend can reach:
- GET http://localhost:4000/api/notes
