import React from 'react';
import './App.css';
import AppRouter from './router';

// PUBLIC_INTERFACE
export default function App() {
  /** Root App component that renders the AppRouter within theme-aware container. */
  return (
    <div className="App">
      <div className="app-container">
        <AppRouter />
      </div>
    </div>
  );
}
