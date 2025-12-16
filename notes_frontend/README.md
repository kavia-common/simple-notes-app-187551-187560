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
3. Defaults to `http://localhost:4000/api`

Healthcheck:
- Backend exposes a health endpoint at `/health`. With defaults, it's available at `http://localhost:4000/health`.
- This frontend does not call the healthcheck automatically; use it to verify backend availability manually.

See `.env.example` for variables supported by this project.

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

## Styling
Theme values are defined in `src/App.css` and follow:
- primary: `#3b82f6`
- secondary: `#64748b`
- success: `#06b6d4`
- error: `#EF4444`
- surfaces: white with subtle borders

