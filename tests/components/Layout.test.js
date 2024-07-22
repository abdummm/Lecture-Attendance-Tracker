import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../../src/components/Layout.js'; // Adjust the import path as necessary
import { UserRoleContext } from '../../src/App.js'; // Adjust the path as necessary

// Mock the components that Layout uses
jest.mock('../../src/components/ProfessorNavigationBar.js', () => () => <div>Professor Navigation Bar</div>);
jest.mock('../../src/components/StudentNavigationBar.js', () => () => <div>Student Navigation Bar</div>);

describe('Layout Component', () => {
  test('renders without crashing', () => {
    // Providing a default value for UserRoleContext
    const role = 'student'; // You can change this to 'professor' to test the other branch

    // Render the Layout component within the UserRoleContext provider
    const { container } = render(
      <UserRoleContext.Provider value={role}>
        <Layout>
          <div>Test Child</div>
        </Layout>
      </UserRoleContext.Provider>
    );

    expect(container).toBeInTheDocument();
  });
});