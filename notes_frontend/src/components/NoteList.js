import React from 'react';
import NoteItem from './NoteItem';

// PUBLIC_INTERFACE
export default function NoteList({ notes, onDelete }) {
  /** Renders a list of notes or empty state. */
  if (!notes?.length) {
    return <div className="state">No notes yet. Create your first note!</div>;
  }

  return (
    <ul className="note-list">
      {notes.map((n) => (
        <NoteItem key={n.id} note={n} onDelete={onDelete} />
      ))}
    </ul>
  );
}
