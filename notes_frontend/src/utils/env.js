const DEFAULT_API_BASE = 'http://localhost:4000/api';

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /**
   * Returns API base URL from env vars in priority order:
   * 1) REACT_APP_API_BASE
   * 2) REACT_APP_BACKEND_URL
   * Fallback: http://localhost:4000/api
   *
   * Note: Backend healthcheck is at /health (e.g., http://localhost:4000/health) and
   * is not part of API base. API requests are made relative to the API base (e.g., /notes).
   */
  const base =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    DEFAULT_API_BASE;
  // Strip trailing slashes
  return (base || '').replace(/\/+$/, '');
}
