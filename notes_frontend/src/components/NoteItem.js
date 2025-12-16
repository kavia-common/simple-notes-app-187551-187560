import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function NoteItem({ note, onDelete }) {
  /**
   * Renders a single note list item, with edit and delete actions.
   */
  const { id, title, content } = note;
  const preview = (content || '').length > 120 ? `${content.slice(0, 120)}…` : (content || '');

  return (
    <li className="note-item" aria-label={`Note ${title || 'Untitled'}`}>
      <div>
        <h3 className="note-item-title">{title || 'Untitled'}</h3>
        <p className="note-item-content">{preview || 'No content'}</p>
      </div>
      <div className="note-item-actions">
        <Link className="btn btn-secondary" to={`/notes/${id}`}>Edit</Link>
        <button className="btn btn-danger" onClick={() => onDelete?.(note)} aria-label="Delete note">
          Delete
        </button>
      </div>
    </li>
  );
}
