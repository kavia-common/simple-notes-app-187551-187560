import React, { useEffect, useMemo, useState } from 'react';
import { renderMarkdownToHtml } from '../utils/markdown';

// PUBLIC_INTERFACE
export default function NoteEditor({ initialValue, onSave, onCancel, saving, serverError }) {
  /**
   * Note editor for creating/updating a note.
   * Props:
   * - initialValue: { title, content }
   * - onSave: (payload) => Promise
   * - onCancel: () => void
   * - saving: boolean
   * - serverError: optional string error to display from parent/backend
   * Adds a markdown preview toggle for content.
   */
  const [title, setTitle] = useState(initialValue?.title || '');
  const [content, setContent] = useState(initialValue?.content || '');
  const [showPreview, setShowPreview] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setTitle(initialValue?.title || '');
    setContent(initialValue?.content || '');
  }, [initialValue?.title, initialValue?.content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setLocalError('Title is required.');
      return;
    }
    setLocalError('');
    await onSave?.({ title: trimmedTitle, content: content.trim() });
  };

  const previewHtml = useMemo(() => renderMarkdownToHtml(content), [content]);
  const combinedError = localError || serverError;

  return (
    <form className="card" onSubmit={handleSubmit} aria-label="Note editor">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 className="page-title" style={{ margin: 0 }}>Editor</h2>
        <div className="row">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowPreview((v) => !v)}
            aria-pressed={showPreview}
            aria-label="Toggle preview"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
      {combinedError && (
        <div className="state error" role="alert" style={{ marginBottom: 10 }}>
          {combinedError}
        </div>
      )}
      <div style={{ display: 'grid', gap: 10 }}>
        <label>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Title</div>
          <input
            className="input"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            aria-invalid={Boolean(localError)}
            required
          />
        </label>
        <label>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Content</div>
          {!showPreview ? (
            <textarea
              className="textarea"
              placeholder="Write your note... (supports basic Markdown: #, **bold**, *italic*, `code`, [link](https://))"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div
              className="textarea"
              style={{ minHeight: 200, overflowY: 'auto' }}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
              aria-label="Markdown preview"
            />
          )}
        </label>
      </div>
      <div className="row-right" style={{ marginTop: 12 }}>
        <button type="submit" className="btn" disabled={saving || !title.trim()}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
