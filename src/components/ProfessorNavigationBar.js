import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfessorNavigationBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic here
    // For demonstration, navigate to login screen
    navigate('/login');
  };

  return (
    <nav className="bg-blue-500 text-white p-4 flex items-center justify-between relative">
      <img src="/white_logo.png" alt="Logo" className="h-8" />
      <div className="flex-grow flex justify-center gap-4">
        <Link to="/take-attendance" className="hover:underline">Take Attendance</Link>
        <Link to="/attendance-records" className="hover:underline">Attendance Records</Link>
        <Link to="/manage-classes" className="hover:underline">Manage Classes</Link>
      </div>
      <div className="flex items-center" onClick={() => setShowDropdown(!showDropdown)}>
        <img src="/Default_pfp.png" alt="Profile" className="h-6 w-6 cursor-pointer" />
        {showDropdown && (
          // Adjust the `top` style to the height of the profile icon plus desired space
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded shadow-lg py-1 z-10">
            <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
            <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log out</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ProfessorNavigationBar;
