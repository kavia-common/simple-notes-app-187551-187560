import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import notesRouter from './routes/notes.js';

// Load environment variables from .env if present
dotenv.config();

// Configuration with sensible defaults
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
// Normalize BASE_PATH: strip trailing slashes, ensure starts with "/"
const rawBase = (process.env.BASE_PATH || '/api').trim();
const BASE_PATH = ('/' + rawBase.replace(/^\/+/, '')).replace(/\/*$/, '') || '/api';
// CORS origin driven by FRONTEND_URL; default to localhost:3000
const FRONTEND_URL =
  process.env.FRONTEND_URL || process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';
const TRUST_PROXY = (process.env.REACT_APP_TRUST_PROXY || 'false').toLowerCase() === 'true';
const LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL || 'dev';
const HEALTH_PATH = process.env.REACT_APP_HEALTHCHECK_PATH || '/health';

// Create express app
const app = express();

// Security + CORS
if (TRUST_PROXY) {
  app.set('trust proxy', 1);
}
app.use(helmet());

/**
 * Normalize origins list: accept comma-separated env var or single value.
 */
function parseOrigins(input) {
  const arr = String(input || '').split(',').map(s => s.trim()).filter(Boolean);
  return arr.map(o => o.replace(/\/*$/, '')); // strip trailing slashes
}

// Compute backend origin for self-allow (some clients send Origin=backend on same-host calls)
const BACKEND_PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const PROTOCOL = (process.env.PROTOCOL || process.env.REACT_APP_PROTOCOL || 'http').replace(':','');
const HOST = process.env.HOST || process.env.REACT_APP_HOST || 'localhost';
const BACKEND_ORIGIN = `${PROTOCOL}://${HOST}${BACKEND_PORT ? `:${BACKEND_PORT}` : ''}`;

// Allow list includes FRONTEND_URL plus backend origin
const allowedOrigins = new Set([
  ...parseOrigins(FRONTEND_URL || 'http://localhost:3000'),
  BACKEND_ORIGIN.replace(/\/*$/, ''),
]);

// Define strict CORS options per requirements
const corsOptions = {
  origin: function (origin, callback) {
    // In case of same-origin or non-browser requests (no Origin), allow
    if (!origin) return callback(null, true);
    const norm = origin.replace(/\/*$/, '');
    if (allowedOrigins.has(norm)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin not allowed: ${origin}`), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Register JSON parser BEFORE routes
app.use(express.json({ limit: '256kb' }));

// Apply CORS for all requests
app.use(cors(corsOptions));
// Ensure preflight for API routes responds properly
app.options(`${BASE_PATH}/*`, cors(corsOptions));
app.options('*', cors(corsOptions));

// Logging
app.use(morgan(LOG_LEVEL));

/**
 * PUBLIC_INTERFACE
 * GET /health
 * Health check endpoint for uptime monitoring.
 * Returns service status, uptime seconds, and timestamp.
 */
app.get(HEALTH_PATH, (req, res) => {
  /** Health endpoint returns basic service info. */
  res.json({
    status: 'ok',
    service: 'notes_backend',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  });
});

// Mount API routers explicitly at {BASE_PATH}/notes
app.use(`${BASE_PATH}/notes`, notesRouter);

// Root welcome
app.get('/', (req, res) => {
  res
    .type('text/plain')
    .send(`Notes Backend is running.
- Health: ${HEALTH_PATH}
- API Base: ${BASE_PATH}
- Notes: ${BASE_PATH}/notes
- CORS Origin: ${FRONTEND_URL}
`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Centralized error handler: normalize payloads and honor status
  const status = err && Number.isInteger(err.status) ? err.status : 500;
  const message = err?.message || 'Internal Server Error';

  const payload = { error: message };
  if ((process.env.NODE_ENV || '').toLowerCase() !== 'production') {
    if (err && err.code) payload.code = err.code;
    if (err && err.stack) payload.stack = err.stack;
  }

  // Log server-side
  if (status >= 500) {
    console.error('[ERROR]', err);
  } else {
    console.warn('[WARN]', message);
  }

  res.status(status).json(payload);
});

// Start server
app.listen(PORT, () => {
  console.log(`[notes_backend] Listening on http://localhost:${PORT}`);
  console.log(`- Health: http://localhost:${PORT}${HEALTH_PATH}`);
  console.log(`- API Base: http://localhost:${PORT}${BASE_PATH}`);
});
