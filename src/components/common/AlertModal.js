import React from "react";

const AlertModal = ({ type = "info", message, isOpen, onClose }) => {
  if (!isOpen) return null;
  const modalBaseStyles = "fixed inset-0 flex items-center justify-center z-50";
  const overlayStyles = "fixed inset-0 bg-black opacity-50";
  const modalContentStyles =
    "bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto";
  
  const typeStyles = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <div className={modalBaseStyles}>
      <div className={overlayStyles} onClick={onClose}></div>
      <div className={modalContentStyles}>
        <div
          className={`flex items-center justify-between p-4 rounded-md ${typeStyles[type]}`}
        >
          <div className="flex items-center">
            {type === "success" && <span className="mr-3">✅</span>}
            {type === "error" && <span className="mr-3">❌</span>}
            {type === "warning" && <span className="mr-3">⚠️</span>}
            {type === "info" && <span className="mr-3">ℹ️</span>}
            <span>{message}</span>
          </div>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-800 hover:text-gray-600 focus:outline-none"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
