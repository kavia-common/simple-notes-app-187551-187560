# Notes Frontend

A lightweight React app for a simple notes application. Users can create, edit, and delete notes with a clean light theme UI.

## Features
- Notes list with preview
- Create and edit note pages
- Delete with confirmation
- Loading and error states
- Environment-based API endpoint

## Environment
The API base URL is resolved in the following order:
1. `REACT_APP_API_BASE` (preferred)
2. `REACT_APP_BACKEND_URL` (fallback)
3. If both are undefined (e.g., production build), it derives from the browser origin as `${window.location.origin}/api`
4. Final fallback to `http://localhost:4000/api`

Healthcheck:
- Backend exposes a health endpoint at `/health`. With defaults, it's available at `http://localhost:4000/health`.
- This frontend does not call the healthcheck automatically; use it to verify backend availability manually.

Environment setup:
1. Copy the example env file:
   cp .env.example .env
2. Adjust `REACT_APP_API_BASE` if your backend is not on `http://localhost:4000/api`.
3. Alternatively, serve your frontend and backend under the same origin and reverse-proxy backend at `/api`, in which case no env override is needed.

Supported variables (see `.env.example` for full list):
- REACT_APP_API_BASE, REACT_APP_BACKEND_URL
- REACT_APP_FRONTEND_URL, REACT_APP_WS_URL
- REACT_APP_NODE_ENV, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_NEXT_TELEMETRY_DISABLED
- REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL, REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS, REACT_APP_EXPERIMENTS_ENABLED

## Scripts
- `npm start` - start the local dev server
- `npm test` - run tests
- `npm run build` - production build

## Development
- Routes:
  - `/` - All notes
  - `/new` - Create new note
  - `/notes/:id` - Edit note
- Ensure your backend exposes REST endpoints:
  - `GET /api/notes`
  - `POST /api/notes`
  - `GET /api/notes/:id`
  - `PUT /api/notes/:id`
  - `DELETE /api/notes/:id`
- Backend CORS: The backend reads `FRONTEND_URL` (default `http://localhost:3000`) to allow this frontend. Update it if you change ports/origin.

## Styling
Theme values are defined in `src/App.css` and follow:
- primary: `#3b82f6`
- secondary: `#64748b`
- success: `#06b6d4`
- error: `#EF4444`
- surfaces: white with subtle borders

