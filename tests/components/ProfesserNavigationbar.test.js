import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfessorNavigationBar from '../../src/components/ProfessorNavigationBar'; // Adjust the import path as necessary
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate since it's used in the component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Use actual for all non-hook parts
  useNavigate: () => jest.fn(), // Mock the hook
}));

describe('ProfessorNavigationBar Component', () => {
  test('renders "Manage Classes" link', () => {
    render(
      <BrowserRouter>
        <ProfessorNavigationBar />
      </BrowserRouter>
    );
    // Check if the "Manage Classes" link is rendered
    const manageClassesLink = screen.getByText('Manage Classes');
    expect(manageClassesLink).toBeInTheDocument();
  });
});