import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmAttendance from '../../src/components/ConfirmAttendance.js';
import { useParams, useNavigate } from 'react-router-dom';

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));
// Mock Firebase and React Router DOM
describe('ConfirmAttendance Component', () => {
    test('renders invalid token message by default', () => {
      render(<ConfirmAttendance />);
      // Check if the component shows the invalid token message
      // We assume the token is invalid by default for the simplicity of this test
      const messageElement = screen.queryByText('Invalid or Expired Token.');
      expect(messageElement).toBeInTheDocument();
    });
  });