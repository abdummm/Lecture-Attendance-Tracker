import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../../src/components/Register.js'; // Adjust the import path as necessary

// Mock useNavigate from react-router-dom since it's used in the component
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock registerUser from your Firebase auth utilities
jest.mock('../../src/firebase/auth', () => ({
  registerUser: jest.fn(),
}));

describe('Register Component', () => {
  test('renders email input field', () => {
    render(<Register />);
    // Check if the email input field is rendered
    const emailInput = screen.getByPlaceholderText('Email Address');
    expect(emailInput).toBeInTheDocument();
  });
});