import React from 'react';
import { NavLink } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Header() {
  /** App header with navigation */
  return (
    <header className="header" role="banner">
      <div className="header-title">Notes</div>
      <div className="header-spacer" />
      <NavLink to="/" end className="header-link">All Notes</NavLink>
      <NavLink to="/new" className="header-link">New Note</NavLink>
    </header>
  );
}
