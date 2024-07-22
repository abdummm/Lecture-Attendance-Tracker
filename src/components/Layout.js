// Layout.js
import React, { useContext } from 'react';
import { UserRoleContext } from '../App'; // Adjust the path as necessary
import ProfessorNavigationBar from './ProfessorNavigationBar';
import StudentNavigationBar from './StudentNavigationBar';

const Layout = ({ children }) => {
  const role = useContext(UserRoleContext); // Using context to get the current user role
  const NavigationBar = role === 'professor' ? ProfessorNavigationBar : StudentNavigationBar;

  return (
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
