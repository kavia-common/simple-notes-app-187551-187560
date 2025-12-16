const DEFAULT_API_BASE = 'http://localhost:4000/api';

/**
 * Normalize a base URL by removing trailing slashes.
 * Ensures no duplicate slashes when appending paths.
 */
function normalizeBase(base) {
  return (base || '').replace(/\/*$/, '');
}

/**
 * Ensure we're using http(s) consistently and avoid protocol-relative confusion.
 * For local dev we default to http.
 */
function ensureHttp(url) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://${url}`;
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /**
   * PUBLIC_INTERFACE
   * Resolve API base URL with the following priority:
   * 1) REACT_APP_API_BASE (preferred)
   * 2) REACT_APP_BACKEND_URL (fallback)
   * 3) If running in browser and no env set, derive from window.location.origin + '/api'
   * 4) Default to 'http://localhost:4000/api'
   *
   * Returns normalized base URL without trailing slash.
   */
  const envBaseRaw =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL;

  if (envBaseRaw) {
    return normalizeBase(ensureHttp(envBaseRaw));
  }

  // Derive from browser location if available (prod build without envs)
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    // Use same protocol and host as frontend to avoid mixed protocols
    return normalizeBase(`${window.location.origin}/api`);
  }

  // Final fallback for tests/dev node-like environments
  return normalizeBase(DEFAULT_API_BASE);
}
