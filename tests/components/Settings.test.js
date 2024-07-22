import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../../src/components/Settings.js'; // Adjust the import path as necessary

// Mock auth and firestore since they're used in the component
jest.mock('../../src/firebase/config', () => ({
  auth: {
    currentUser: { uid: 'testUid', email: 'test@test.com' },
  },
  firestore: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({ email: 'test@test.com', idNumber: '123456' }) })),
  updateDoc: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
}));

describe('Settings Component', () => {
    test('renders without crashing', () => {
      render(<Settings />);
      // If the component renders without throwing an error, the test will pass.
    });
  });
