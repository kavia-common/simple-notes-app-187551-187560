import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import Header from './components/Header';

// PUBLIC_INTERFACE
export function AppRouter() {
  /** Router for the Notes App, defines routes and shared header */
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<NotesPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        <Route path="/new" element={<NoteDetailPage isNew />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
