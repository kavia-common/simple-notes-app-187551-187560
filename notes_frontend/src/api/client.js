import { getApiBaseUrl } from '../utils/env';

/**
 * Lightweight API client for notes backend.
 * Reads base URL from environment with fallback.
 */
const BASE_URL = getApiBaseUrl();

/**
 * Attempt to extract a meaningful error message from a Response.
 */
async function extractErrorMessage(res, fallbackPrefix) {
  try {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      if (json && (json.error || json.message)) {
        return `${fallbackPrefix}: ${res.status} ${json.error || json.message}`;
      }
    } catch {
      // not json
    }
    const trimmed = (text || '').trim();
    return `${fallbackPrefix}: ${res.status}${trimmed ? ` ${trimmed}` : ''}`;
  } catch {
    return `${fallbackPrefix}: ${res.status}`;
  }
}

/**
 * Map network errors into a concise, user-friendly message that avoids exposing raw internals.
 */
function friendlyNetworkError(prefix) {
  return `${prefix}: could not reach the server. Check that the backend is running at ${BASE_URL} and that your browser is allowed by CORS.`;
}

/**
 * Safely join base URL and path, avoiding double slashes (but keep protocol double-slash).
 */
function joinUrl(path) {
  const url = `${BASE_URL}${path}`;
  // Replace multiple slashes with single slash, but ignore the "http(s)://" part
  return url.replace(/(?<!:)\/{2,}/g, '/');
}

/**
 * Wrap fetch to provide consistent error handling including network errors (TypeError)
 */
async function doFetch(url, options, failurePrefix) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const msg = await extractErrorMessage(res, failurePrefix);
      throw new Error(msg);
    }
    return res;
  } catch (err) {
    // Network error or CORS failure often appears as TypeError: Failed to fetch
    if (err && err.name === 'TypeError') {
      throw new Error(friendlyNetworkError(failurePrefix));
    }
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function apiGet(path) {
  /** PUBLIC_INTERFACE: Perform GET request to backend. Returns parsed JSON or throws. */
  const url = joinUrl(path);
  const res = await doFetch(url, { headers: { 'Content-Type': 'application/json' } }, `GET ${path} failed`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPost(path, body) {
  /** PUBLIC_INTERFACE: Perform POST request with JSON body. */
  const url = joinUrl(path);
  const res = await doFetch(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    },
    `POST ${path} failed`
  );
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPut(path, body) {
  /** PUBLIC_INTERFACE: Perform PUT request with JSON body. */
  const url = joinUrl(path);
  const res = await doFetch(
    url,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    },
    `PUT ${path} failed`
  );
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiDelete(path) {
  /** PUBLIC_INTERFACE: Perform DELETE request. Returns parsed JSON if any or empty object. */
  const url = joinUrl(path);
  const res = await doFetch(url, { method: 'DELETE' }, `DELETE ${path} failed`);
  try {
    return await res.json();
  } catch {
    return {};
  }
}

/**
 * Build query string from parameters, omitting empty values.
 */
function buildQuery(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const val = String(v).trim();
    if (val !== '') usp.set(k, val);
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

// PUBLIC_INTERFACE
export const NotesApi = {
  /** Notes CRUD api helpers */
  list: ({ q, sort = 'updatedAt', order = 'desc' } = {}) =>
    apiGet(`/notes${buildQuery({ q, sort, order })}`),
  get: (id) => apiGet(`/notes/${id}`),
  create: (payload) => apiPost('/notes', payload),
  update: (id, payload) => apiPut(`/notes/${id}`, payload),
  remove: (id) => apiDelete(`/notes/${id}`),
};

export default NotesApi;
