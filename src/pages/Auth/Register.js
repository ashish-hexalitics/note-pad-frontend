import React, { useState } from "react";
import { useRegisterMutation } from "../../store/slices/authSlice/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [register, { isLoading, isError }] = useRegisterMutation();
  const navigate = useNavigate();

  // Local state for input values
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Call the register mutation with the input values
    try {
      const result = await register({
        name: fullName,
        email,
        password,
      }).unwrap();
      localStorage.setItem("access_token", result.token);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div
      className="flex justify-center items-center bg-gray-100"
      style={{ height: "calc(100% - 70px)" }}
    >
      <div className="w-full max-w-2xl bg-white p-10 shadow-2xl rounded-lg">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 space-x-4">
            <div className="">
              <label className="block text-gray-700 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="">
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
          </div>
          <div className="grid grid-cols-2 space-x-4">
            <div className="">
              <label className="block text-gray-700 font-semibold">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                placeholder="********"
                required
              />
            </div>

            <div className="">
              <label className="block text-gray-700 font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                placeholder="********"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>

          {isError && (
            <p className="text-red-500 text-center mt-4">
              Registration failed. Please try again.
            </p>
          )}
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-indigo-600 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
