/** @format */

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/welcome to my app/i);
  expect(welcomeElement).toBeInTheDocument();
});
