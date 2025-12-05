import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

test('renders Home page heading', () => {
  render(
    <Router>
      <App />
    </Router>
  );
  const headingElement = screen.getByText(/Water Quality Monitor/i);
  expect(headingElement).toBeInTheDocument();
});
