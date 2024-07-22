import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentNavigationBar from '../../src/components/StudentNavigationBar'; // Adjust the import path as necessary
import { BrowserRouter } from 'react-router-dom'; // Needed for Link components

describe('StudentNavigationBar Component', () => {
  test('renders "Attendance Records" link', () => {
    // Wrap the component in BrowserRouter to avoid "useHref() may be used only in the context of a <Router>" error
    render(
      <BrowserRouter>
        <StudentNavigationBar />
      </BrowserRouter>
    );
    // Check if the "Attendance Records" link is rendered
    const attendanceRecordsLink = screen.getByText('Attendance Records');
    expect(attendanceRecordsLink).toBeInTheDocument();
  });
});
