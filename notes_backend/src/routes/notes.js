import { Router } from 'express';
import { db } from '../storage/db.js';

const router = Router();

/**
 * PUBLIC_INTERFACE
 * GET /api/notes
 * List notes. For scaffold, returns all notes or empty list.
 */
router.get('/', async (req, res, next) => {
  try {
    const notes = await db.list();
    res.json(notes);
  } catch (e) {
    next(e);
  }
});

/**
 * Placeholder routes for future CRUD implementation.
 * These are stubbed and return 501 Not Implemented for now.
 */

router.post('/', (req, res) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Create note coming soon.' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Get note by id coming soon.' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Update note coming soon.' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Delete note coming soon.' });
});

export default router;
