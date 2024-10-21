import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddNote() {
  const [title, setTitle] = useState(""); // State to store note title
  const [note, setNote] = useState(""); // State to store note content
  const [username, setUsername] = useState("John Doe"); // State for user name
  const [profileColor, setProfileColor] = useState("#4f46e5"); // Default profile color (indigo)
  const navigate = useNavigate();

  // Function to handle adding a note
  const handleAddNote = () => {
    if (title.trim() !== "" && note.trim() !== "") {
      alert(`Note added:\nTitle: ${title}\nContent: ${note}`);
      setTitle("");
      setNote("");
      navigate("/notepad"); // Redirect back to the Notepad page
    }
  };

  // Function to handle invite (Placeholder logic)
  const handleInviteFriends = () => {
    alert("Invite friends functionality is coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start space-x-10">
      {/* Main Note Section */}
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Add a New Note</h1>

        {/* Note Title */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Note Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter the title of your note..."
          />
        </div>

        {/* Note Content */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Note Content</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="8" // Increased height
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Write your note content here..."
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleAddNote}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-200"
          >
            Save Note
          </button>
        </div>
      </div>

      {/* Right Sidebar with Options */}
      <div className="w-80 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Options</h2>

        {/* Invite Friends */}
        <button
          onClick={handleInviteFriends}
          className="w-full bg-blue-500 text-white px-4 py-2 mb-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Invite Friends
        </button>

        {/* Profile Color Picker */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Profile Color</label>
          <input
            type="color"
            value={profileColor}
            onChange={(e) => setProfileColor(e.target.value)}
            className="w-full cursor-pointer"
          />
          <p className="mt-2 text-sm" style={{ color: profileColor }}>
            Current color for {username}
          </p>
        </div>

        {/* Rename Username */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Rename Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter new username..."
          />
        </div>
      </div>
    </div>
  );
}

export default AddNote;
