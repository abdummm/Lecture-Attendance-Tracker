import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScanQR from '../../src/components/ScanQR.js'; // Adjust the import path as necessary

describe('ScanQR Component', () => {
  test('renders initial message', () => {
    render(<ScanQR />);
    const initialMessage = screen.getByText('Scan QR code to mark attendance');
    expect(initialMessage).toBeInTheDocument();
  });
});
