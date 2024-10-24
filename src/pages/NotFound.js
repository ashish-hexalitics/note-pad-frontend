import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back Home
      </Link>
    </div>
  );
}

export default NotFound;
