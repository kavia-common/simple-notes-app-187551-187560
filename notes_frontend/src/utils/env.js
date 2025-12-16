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

/**
 * Try to detect cloud preview origin and map FE -> BE.
 * For example:
 *   https://host.example.ai:3000  -> https://host.example.ai:8000/api
 */
function deriveFromWindowOrigin() {
  if (typeof window === 'undefined' || !window.location || !window.location.origin) return '';
  const origin = window.location.origin; // includes protocol and port
  try {
    const u = new URL(origin);
    const port = u.port || (u.protocol === 'https:' ? '443' : '80');

    // In our preview environment FE runs on 3000 and BE on 8000 under same host.
    // Swap :3000 to :8000; otherwise, keep same host and add /api (reverse proxy case).
    let bePort = port;
    if (port === '3000') bePort = '8000';

    // Rebuild backend origin
    const backendOrigin = `${u.protocol}//${u.hostname}${bePort ? `:${bePort}` : ''}`;
    // If FE already on backend port (e.g., reverse-proxied), just append /api
    return normalizeBase(`${backendOrigin}/api`);
  } catch {
    return normalizeBase(`${origin}/api`);
  }
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /**
   * PUBLIC_INTERFACE
   * Resolve API base URL with the following priority:
   * 1) REACT_APP_API_BASE (preferred)
   * 2) REACT_APP_BACKEND_URL (fallback)
   * 3) Derive from window.location.origin, mapping :3000 -> :8000 and appending /api for cloud preview
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

  const derived = deriveFromWindowOrigin();
  if (derived) return derived;

  // Final fallback for tests/dev node-like environments
  return normalizeBase(DEFAULT_API_BASE);
}

// PUBLIC_INTERFACE
export function getDetectedApiBaseForDebug() {
  /**
   * PUBLIC_INTERFACE
   * Expose the detected API base for debugging and UI hints.
   */
  return getApiBaseUrl();
}
