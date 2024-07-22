import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../firebase/auth'; // Adjust the import path as necessary

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await loginUser(email, password);
      navigate('/'); // Redirect to the home page or dashboard based on role (adjust as necessary)
    } catch (error) {
      setError(error.message);
      // Optionally, handle more specific login errors based on error.code here
    }
  };

  const handleRegisterNavigate = () => {
    navigate('/register'); // Navigate to the register page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-sm">
        <div className="mb-4">
          <img className="mx-auto h-24" src="/black_logo.png" alt="Logo" />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email Address"
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log In
            </button>
          </div>
        </form>
        <div className="mt-4">
          <p className="text-gray-600">or</p>
          <button
            onClick={handleRegisterNavigate}
            className="mt-2 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;