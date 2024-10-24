import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="h-screen bg-gradient-to-b from-indigo-500 to-purple-600 flex flex-col justify-center items-center text-white"
      style={{ height: "calc(100% - 70px)" }}
    >
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-6">Welcome to NotesHub</h1>
        <p className="text-lg font-light mb-10 max-w-2xl">
          Collaborate, share, and organize your notes seamlessly with NotesHub.
          Whether you're working solo or with a team, NotesHub makes
          collaboration effortless and efficient.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-white text-indigo-600 py-3 px-8 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/register"
            className="bg-white text-purple-600 py-3 px-8 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
