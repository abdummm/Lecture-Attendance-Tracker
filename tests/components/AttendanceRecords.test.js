import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });

import React from 'react';
import { render, screen,waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AttendanceRecords from '../../src/components/AttendanceRecords.js'; // Adjust this path as necessary
import { UserRoleContext } from '../../src/App'; // Adjust this path as necessary
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../src/firebase/config.js', () => ({
  firestore: jest.fn(),
  auth: {
    currentUser: { uid: 'testUserId' },
  },
}));

// Mock Firestore 'getDocs' and related functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

describe('AttendanceRecords Component', () => {
  const mockClasses = [
    { id: 'class1', name: 'Intro to Testing' },
    { id: 'class2', name: 'Advanced Testing' },
  ];

  beforeEach(() => {
    require('firebase/firestore').getDocs.mockImplementation(() => Promise.resolve({
      docs: mockClasses.map(cls => ({
        id: cls.id,
        data: () => ({ name: cls.name }),
      })),
    }));
  });

  const renderComponentWithRole = (role) =>
    render(
      <UserRoleContext.Provider value={role}>
        <BrowserRouter>
          <AttendanceRecords />
        </BrowserRouter>
      </UserRoleContext.Provider>
    );

  test('renders class links for a professor', async () => {
    renderComponentWithRole('professor');

    await waitFor(() => {
      mockClasses.forEach((cls) => {
        expect(screen.getByText(cls.name)).toBeInTheDocument();
      });
    });
  });

  test('renders class links for a student', async () => {
    renderComponentWithRole('student');

    await waitFor(() => {
      mockClasses.forEach((cls) => {
        expect(screen.getByText(cls.name)).toBeInTheDocument();
      });
    });
  });
});