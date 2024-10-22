import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../store/slices/authSlice/api";
import { useNavigate } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch();
  const [login, { isLoading, isError, data }] = useLoginMutation();
  const navigate = useNavigate()

  // Local state for input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form submission handler
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await login({ email, password }).unwrap();
      localStorage.setItem('access_token',result.token)
      navigate('/user/notes')
    } catch (error) {
      // Handle login error
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
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

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-200"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Loading..." : "Login"}
          </button>

          {isError && (
            <p className="text-red-500 text-center mt-2">
              Login failed. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
