import React, { useEffect, useMemo, useState } from 'react';
import { renderMarkdownToHtml } from '../utils/markdown';

// PUBLIC_INTERFACE
export default function NoteEditor({ initialValue, onSave, onCancel, saving }) {
  /**
   * Note editor for creating/updating a note.
   * Props:
   * - initialValue: { title, content }
   * - onSave: (payload) => Promise
   * - onCancel: () => void
   * - saving: boolean
   * Adds a markdown preview toggle for content.
   */
  const [title, setTitle] = useState(initialValue?.title || '');
  const [content, setContent] = useState(initialValue?.content || '');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setTitle(initialValue?.title || '');
    setContent(initialValue?.content || '');
  }, [initialValue?.title, initialValue?.content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave?.({ title: title.trim(), content: content.trim() });
  };

  const previewHtml = useMemo(() => renderMarkdownToHtml(content), [content]);

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
      <div style={{ display: 'grid', gap: 10 }}>
        <label>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Title</div>
          <input
            className="input"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
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
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
