import React, { useState } from 'react';
import { useRegisterMutation } from '../../store/slices/authSlice/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [register, { isLoading, isError, data }] = useRegisterMutation();

  const navigate = useNavigate()
  
  // Local state for input values
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Call the register mutation with the input values
    try {
      const result = await register({ name:fullName, email, password }).unwrap();
      localStorage.setItem('access_token',result.token)
      navigate('/login')
      // Handle successful registration (e.g., show success message or redirect)
      console.log('Registration successful:', result);
    } catch (error) {
      // Handle registration error
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)} // Update full name state
              className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="********"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
              className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="********"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-200"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Loading...' : 'Register'}
          </button>

          {isError && <p className="text-red-500 text-center mt-2">Registration failed. Please try again.</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;
