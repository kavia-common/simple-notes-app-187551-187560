import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NoteEditor from '../components/NoteEditor';
import { useNoteDetail } from '../hooks/useNotesApi';
import NotesApi from '../api/client';

// PUBLIC_INTERFACE
export default function NoteDetailPage({ isNew: forcedNew }) {
  /**
   * Detail page for viewing/editing/creating a note.
   * - If isNew or no id param => create mode
   */
  const params = useParams();
  const navigate = useNavigate();
  const id = forcedNew ? null : params.id;
  const { note, setNote, loading, error, isNew, save, remove } = useNoteDetail(id);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (isNew) {
        const created = await NotesApi.create(payload);
        navigate(`/notes/${created.id}`, { replace: true });
      } else {
        await save(payload);
        navigate('/', { replace: true });
      }
    } catch {
      // error already handled in hook/api
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const ok = window.confirm('Delete this note? This action cannot be undone.');
    if (!ok) return;
    setDeleting(true);
    try {
      await remove();
      navigate('/', { replace: true });
    } catch {
      // error displayed via hook
    } finally {
      setDeleting(false);
    }
  };

  const initial = isNew ? { title: '', content: '' } : (note || { title: '', content: '' });

  return (
    <div className="grid" role="main">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h1 className="page-title">{isNew ? 'New Note' : 'Edit Note'}</h1>
          {!isNew && (
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>
        {loading && !isNew && <div className="state loading">Loading note…</div>}
        {error && <div className="state error" role="alert">{error}</div>}
        {(!loading || isNew) && (
          <NoteEditor
            initialValue={initial}
            onSave={handleSave}
            onCancel={() => navigate(-1)}
            saving={saving}
          />
        )}
      </div>
      <div className="card">
        <h2 className="page-title">Tips</h2>
        <p className="note-item-content">Use a clear title. Your notes save to the backend API.</p>
      </div>
    </div>
  );
}
