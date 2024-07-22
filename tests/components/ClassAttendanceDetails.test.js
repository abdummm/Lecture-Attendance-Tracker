import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, Route, MemoryRouter } from 'react-router-dom';
import ClassAttendanceDetails from '../../src/components/ClassAttendanceDetails.js';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    classId: 'dummyClassId',
  }),
}));

describe('ClassAttendanceDetails Component', () => {
  test('renders loading state', () => {
    render(
      <MemoryRouter>
        <ClassAttendanceDetails />
      </MemoryRouter>
    );

    // Check for loading text
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // Add more simple tests here if needed
});