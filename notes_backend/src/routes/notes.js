import { Router } from 'express';
import { db } from '../storage/db.js';

const router = Router();

/**
 * PUBLIC_INTERFACE
 * GET /api/notes
 * List notes with optional search and sort.
 * Query params:
 * - q: substring to search in title/content
 * - sort: field to sort by (default: updatedAt)
 * - order: asc|desc (default: desc)
 * Default behavior: if not specified, notes are returned sorted by updatedAt desc.
 */
router.get('/', async (req, res, next) => {
  try {
    const { q, sort, order } = req.query || {};
    const notes = await db.list({ q, sort, order });
    res.json(notes);
  } catch (e) {
    next(e);
  }
});

/**
 * PUBLIC_INTERFACE
 * POST /api/notes
 * Create a new note.
 * Body:
 * - title: required
 * - content: optional
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body || {};
    const created = await db.create({ title, content });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

/**
 * PUBLIC_INTERFACE
 * GET /api/notes/:id
 * Get a note by id.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const note = await db.get(req.params.id);
    res.json(note);
  } catch (e) {
    next(e);
  }
});

/**
 * PUBLIC_INTERFACE
 * PUT /api/notes/:id
 * Update a note by id.
 * Body may include:
 * - title: required if provided (cannot be empty)
 * - content: optional
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { title, content } = req.body || {};
    const updated = await db.update(req.params.id, { title, content });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

/**
 * PUBLIC_INTERFACE
 * DELETE /api/notes/:id
 * Remove a note by id.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const removed = await db.remove(req.params.id);
    res.json({ success: true, id: removed.id });
  } catch (e) {
    next(e);
  }
});

export default router;
