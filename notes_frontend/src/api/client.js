import { getApiBaseUrl } from '../utils/env';

/**
 * Lightweight API client for notes backend.
 * Reads base URL from environment with fallback.
 */
const BASE_URL = getApiBaseUrl();

// PUBLIC_INTERFACE
export async function apiGet(path) {
  /** Perform GET request to backend. Returns parsed JSON or throws. */
  const res = await fetch(`${BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPost(path, body) {
  /** Perform POST request with JSON body. */
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`POST ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPut(path, body) {
  /** Perform PUT request with JSON body. */
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`PUT ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiDelete(path) {
  /** Perform DELETE request. Returns parsed JSON if any or empty object. */
  const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`DELETE ${path} failed: ${res.status} ${text}`);
  }
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
