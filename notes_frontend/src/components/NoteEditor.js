import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export default function NoteEditor({ initialValue, onSave, onCancel, saving }) {
  /**
   * Note editor for creating/updating a note.
   * Props:
   * - initialValue: { title, content }
   * - onSave: (payload) => Promise
   * - onCancel: () => void
   * - saving: boolean
   */
  const [title, setTitle] = useState(initialValue?.title || '');
  const [content, setContent] = useState(initialValue?.content || '');

  useEffect(() => {
    setTitle(initialValue?.title || '');
    setContent(initialValue?.content || '');
  }, [initialValue?.title, initialValue?.content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave?.({ title: title.trim(), content: content.trim() });
  };

  return (
    <form className="card" onSubmit={handleSubmit} aria-label="Note editor">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 className="page-title" style={{ margin: 0 }}>Editor</h2>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
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
          <textarea
            className="textarea"
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
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
