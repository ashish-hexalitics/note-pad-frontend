import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const baseStyles = 'flex items-center justify-between p-4 rounded-md shadow-lg';
  
  const typeStyles = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      <div className="flex items-center">
        {/* Icon based on alert type */}
        {type === 'success' && <span className="mr-3">✅</span>}
        {type === 'error' && <span className="mr-3">❌</span>}
        {type === 'warning' && <span className="mr-3">⚠️</span>}
        {type === 'info' && <span className="mr-3">ℹ️</span>}
        
        {/* Alert Message */}
        <span>{message}</span>
      </div>
      
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="text-xl font-bold text-gray-800 hover:text-gray-600 focus:outline-none"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
