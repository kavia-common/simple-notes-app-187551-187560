const DEFAULT_API_BASE = 'http://localhost:4000/api';

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /**
   * Returns API base URL from env vars:
   * - REACT_APP_API_BASE
   * - REACT_APP_BACKEND_URL
   * Fallback: http://localhost:4000/api
   */
  const base = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || DEFAULT_API_BASE;
  // Strip trailing slashes
  return (base || '').replace(/\/+$/, '');
}
