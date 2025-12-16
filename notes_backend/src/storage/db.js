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

/**
 * PUBLIC_INTERFACE
 * Simple storage API for notes.
 * Only list() is implemented in scaffold.
 */
export const db = {
  /** Return all notes. */
  async list() {
    const data = await load();
    return data.notes;
  },

  /** Create a new note (TODO in future step). */
  async create(/* note */) {
    throw Object.assign(new Error('Not Implemented'), { status: 501 });
  },

  /** Get note by id (TODO). */
  async get(/* id */) {
    throw Object.assign(new Error('Not Implemented'), { status: 501 });
  },

  /** Update note by id (TODO). */
  async update(/* id, patch */) {
    throw Object.assign(new Error('Not Implemented'), { status: 501 });
  },

  /** Delete note by id (TODO). */
  async remove(/* id */) {
    throw Object.assign(new Error('Not Implemented'), { status: 501 });
  },

  // Expose save for future transactional operations
  _save: save,
  _load: load
};

export default db;
