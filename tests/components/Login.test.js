import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../src/components/Login.js'; // Adjust the import path as necessary

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock loginUser from your Firebase auth utilities
jest.mock('../../src/firebase/auth.js', () => ({
  loginUser: jest.fn(),
}));

describe('Login Component', () => {
  test('renders email and password input fields', () => {
    render(<Login />);
    
    // Check if the email input field is rendered
    const emailInput = screen.getByPlaceholderText('Email Address');
    expect(emailInput).toBeInTheDocument();

    // Check if the password input field is rendered
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toBeInTheDocument();
  });
});