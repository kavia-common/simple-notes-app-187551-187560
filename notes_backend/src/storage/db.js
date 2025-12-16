import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage file path under project data directory
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'notes.json');

// Internal cache
let cache = null;

// Generate a simple unique id (timestamp + random)
function genId() {
  return (
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 10)
  );
}

/**
 * Ensure data directory and file exist.
 */
async function ensureStorage() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ notes: [] }, null, 2), 'utf-8');
  }
}

/**
 * Load data from disk into cache.
 */
async function load() {
  await ensureStorage();
  if (cache) return cache;
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    cache = Array.isArray(parsed?.notes) ? parsed : { notes: [] };
  } catch {
    cache = { notes: [] };
  }
  return cache;
}

/**
 * Save cache to disk.
 */
async function save() {
  if (!cache) return;
  await fs.writeFile(DATA_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

// Helper to normalize sort/order
function normalizeSort(sort, order) {
  const s = (sort || 'updatedAt').toString();
  const o = (order || 'desc').toString().toLowerCase() === 'asc' ? 'asc' : 'desc';
  return { sort: s, order: o };
}

/**
 * PUBLIC_INTERFACE
 * Simple storage API for notes with CRUD, search, sort and timestamps.
 */
export const db = {
  /**
   * List notes with optional query params.
   * Supports simple substring search on title/content with q,
   * and sorting by a field (default updatedAt) with order asc|desc.
   */
  // PUBLIC_INTERFACE
  async list({ q = '', sort = 'updatedAt', order = 'desc' } = {}) {
    const data = await load();
    const { sort: sortField, order: sortOrder } = normalizeSort(sort, order);
    const query = (q || '').toString().toLowerCase().trim();

    let items = Array.from(data.notes);

    if (query) {
      items = items.filter((n) => {
        const t = (n.title || '').toLowerCase();
        const c = (n.content || '').toLowerCase();
        return t.includes(query) || c.includes(query);
      });
    }

    items.sort((a, b) => {
      const av = a?.[sortField];
      const bv = b?.[sortField];
      if (av == null && bv == null) return 0;
      if (av == null) return sortOrder === 'asc' ? -1 : 1;
      if (bv == null) return sortOrder === 'asc' ? 1 : -1;

      if (av < bv) return sortOrder === 'asc' ? -1 : 1;
      if (av > bv) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return items;
  },

  /**
   * Get a single note by id.
   */
  // PUBLIC_INTERFACE
  async get(id) {
    const data = await load();
    const note = data.notes.find((n) => n.id === id);
    if (!note) {
      const err = new Error('Note not found');
      err.status = 404;
      throw err;
    }
    return note;
  },

  /**
   * Create a new note with required title and optional content.
   * Adds id, createdAt, updatedAt.
   */
  // PUBLIC_INTERFACE
  async create({ title, content = '' } = {}) {
    const data = await load();
    const now = new Date().toISOString();

    if (!title || !title.toString().trim()) {
      const err = new Error('Validation failed: "title" is required');
      err.status = 400;
      throw err;
    }

    const note = {
      id: genId(),
      title: title.toString().trim(),
      content: (content ?? '').toString(),
      createdAt: now,
      updatedAt: now,
    };

    data.notes.push(note);
    // Keep notes sorted by updatedAt desc to match default listing expectation
    data.notes.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
    await save();
    return note;
  },

  /**
   * Update an existing note. Allows updating title and/or content.
   * Updates updatedAt timestamp.
   */
  // PUBLIC_INTERFACE
  async update(id, { title, content } = {}) {
    const data = await load();
    const idx = data.notes.findIndex((n) => n.id === id);
    if (idx === -1) {
      const err = new Error('Note not found');
      err.status = 404;
      throw err;
    }

    const existing = data.notes[idx];
    const patch = {};

    if (title !== undefined) {
      if (!title || !title.toString().trim()) {
        const err = new Error('Validation failed: "title" is required');
        err.status = 400;
        throw err;
      }
      patch.title = title.toString().trim();
    }
    if (content !== undefined) {
      patch.content = (content ?? '').toString();
    }

    const updated = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    data.notes[idx] = updated;
    data.notes.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
    await save();
    return updated;
  },

  /**
   * Remove a note by id.
   */
  // PUBLIC_INTERFACE
  async remove(id) {
    const data = await load();
    const idx = data.notes.findIndex((n) => n.id === id);
    if (idx === -1) {
      const err = new Error('Note not found');
      err.status = 404;
      throw err;
    }
    const [deleted] = data.notes.splice(idx, 1);
    await save();
    return deleted;
  },

  // Expose save/load for testing/internal usage
  _save: save,
  _load: load
};

export default db;
