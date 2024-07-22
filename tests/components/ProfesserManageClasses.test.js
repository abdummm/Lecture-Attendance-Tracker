import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfessorManageClasses from '../../src/components/ProfessorManageClasses.js'; // Adjust the import path as necessary

// Mock the necessary hooks and modules
jest.mock('../../src/firebase/config.js', () => ({
  auth: { currentUser: { uid: 'testUid' } },
  firestore: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(() => {
    const unsubscribeMock = jest.fn(); // Mocked unsubscribe function
    return unsubscribeMock;
  }),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

describe('ProfessorManageClasses Component', () => {
  test('renders "Add Class" button', () => {
    render(<ProfessorManageClasses />);
    const addButton = screen.getByText('Add Class');
    expect(addButton).toBeInTheDocument();
  });
});