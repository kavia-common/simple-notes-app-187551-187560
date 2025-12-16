const DEFAULT_API_BASE = 'http://localhost:4000/api';

/**
 * Normalize a base URL by removing trailing slashes.
 */
function normalizeBase(base) {
  return (base || '').replace(/\/*$/, '');
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /**
   * Returns API base URL from env vars in priority order:
   * 1) REACT_APP_API_BASE
   * 2) REACT_APP_BACKEND_URL
   * Fallbacks:
   *   a) If running in browser and envs are undefined, derive from window.location:
   *      - same origin + '/api' (assumes backend is reverse-proxied at /api)
   *   b) Default to http://localhost:4000/api (dev)
   *
   * This prevents generic "failed to fetch" when env is missing in production builds.
   */
  const envBase =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL;

  if (envBase) {
    return normalizeBase(envBase);
  }

  // Derive from browser location if available (prod build without envs)
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return normalizeBase(`${window.location.origin}/api`);
  }

  // Final fallback for tests/dev node-like environments
  return normalizeBase(DEFAULT_API_BASE);
}
