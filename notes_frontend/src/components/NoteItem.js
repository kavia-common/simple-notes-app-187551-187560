import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { renderMarkdownToHtml } from '../utils/markdown';

// PUBLIC_INTERFACE
export default function NoteItem({ note, onDelete }) {
  /**
   * Renders a single note list item, with edit and delete actions.
   * Shows a short preview of content (markdown rendered and truncated).
   */
  const { id, title, content } = note;
  const rawPreview = (content || '').length > 160 ? `${content.slice(0, 160)}…` : (content || '');
  const previewHtml = useMemo(() => renderMarkdownToHtml(rawPreview), [rawPreview]);

  return (
    <li className="note-item" aria-label={`Note ${title || 'Untitled'}`}>
      <div>
        <h3 className="note-item-title">{title || 'Untitled'}</h3>
        <div
          className="note-item-content"
          dangerouslySetInnerHTML={{ __html: previewHtml || '<p>No content</p>' }}
        />
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
