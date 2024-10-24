import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../store/slices/authSlice/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const [login, { isLoading, isError }] = useLoginMutation();
  const navigate = useNavigate();

  // Local state for input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form submission handler
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await login({ email, password }).unwrap();
      localStorage.setItem("access_token", result.token);
      navigate("/user/notes");
    } catch (error) {
      // Handle login error
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100" style={{height:'calc(100% - 70px)'}}>
      <div className="w-full max-w-md bg-white p-10 shadow-2xl rounded-lg">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Welcome Back!
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {isError && (
            <p className="text-red-500 text-center mt-4">
              Login failed. Please try again.
            </p>
          )}
        </form>

        <div className="text-center mt-6">
          <Link to="/register" className="text-indigo-600 hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
