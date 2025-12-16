import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NoteList from '../components/NoteList';
import { useNotesList } from '../hooks/useNotesApi';
import NotesApi from '../api/client';

// PUBLIC_INTERFACE
export default function NotesPage() {
  /**
   * List page: shows all notes, loading and error states, delete with confirm.
   * Adds search and sort controls wired to backend via q, sort, order.
   */
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('updatedAt');
  const [order, setOrder] = useState('desc');

  const params = useMemo(() => ({ q, sort, order }), [q, sort, order]);
  const { data, loading, error, reload, setData } = useNotesList(params);
  const [deletingId, setDeletingId] = useState(null);

  const clearSearch = () => setQ('');

  const onDelete = useCallback(async (note) => {
    if (!note?.id) return;
    const ok = window.confirm(`Delete note "${note.title || 'Untitled'}"? This cannot be undone.`);
    if (!ok) return;
    setDeletingId(note.id);
    try {
      // optimistic update
      setData((prev) => prev.filter((n) => n.id !== note.id));
      await NotesApi.remove(note.id);
    } catch {
      // If backend delete fails, fall back to reloading
    } finally {
      await reload();
      setDeletingId(null);
    }
  }, [reload, setData]);

  return (
    <div className="grid" role="main">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h1 className="page-title">Your Notes</h1>
          <Link className="btn" to="/new">New Note</Link>
        </div>

        <div className="row" style={{ marginBottom: 10, gap: 8, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              className="input"
              type="search"
              placeholder="Search title or content…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search notes"
            />
          </div>
          {q && (
            <button className="btn btn-secondary" type="button" onClick={clearSearch} aria-label="Clear search">
              Clear
            </button>
          )}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Sort</span>
              <select
                className="input"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort field"
                style={{ width: 150 }}
              >
                <option value="updatedAt">Updated</option>
                <option value="createdAt">Created</option>
                <option value="title">Title</option>
              </select>
            </label>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Order</span>
              <select
                className="input"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                aria-label="Sort order"
                style={{ width: 120 }}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </label>
          </div>
        </div>

        {loading && <div className="state loading" role="status">Loading notes…</div>}
        {error && <div className="state error" role="alert">{error}</div>}
        {!loading && !error && (
          <NoteList
            notes={data}
            onDelete={onDelete}
          />
        )}
        {deletingId && <div className="state" style={{ marginTop: 10 }}>Deleting…</div>}
      </div>
      <div className="card">
        <h2 className="page-title">Quick Create</h2>
        <p className="note-item-content">Use the New Note button to create and edit a note.</p>
        <Link className="btn" to="/new" aria-label="Create new note">Create note</Link>
      </div>
    </div>
  );
}
