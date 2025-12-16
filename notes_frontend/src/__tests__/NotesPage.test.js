import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotesPage from '../pages/NotesPage';

test('renders notes page title', () => {
  render(
    <MemoryRouter>
      <NotesPage />
    </MemoryRouter>
  );
  expect(screen.getByText(/your notes/i)).toBeInTheDocument();
});
