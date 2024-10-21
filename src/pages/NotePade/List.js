import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetNotesApiQuery } from "../../store/slices/noteSlice/api";
import { getNotes } from "../../store/slices/noteSlice/reducer";
import { useDispatch } from "react-redux";
useDispatch;
function NotepadList() {
  const dispatch = useDispatch();
  const [getNotesApi, { isLoading, isError, data }] = useGetNotesApiQuery();

  console.log(data);
  useEffect(() => {
    if (data) {
      dispatch(getNotes(data));
    }
  }, [data]);

  const [notes, setNotes] = useState([
    "First note",
    "Second note",
    "Important task to remember",
    "Meeting notes",
    "Some other random note",
  ]); // Preloaded example notes
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [newNote, setNewNote] = useState(""); // State to manage new note input
  const navigate = useNavigate(); // For navigation

  // Function to handle deleting a note
  const deleteNote = (index) => {
    setNotes(notes.filter((_, noteIndex) => noteIndex !== index));
  };

  // Function to handle searching for a note
  const filteredNotes = notes.filter((note) =>
    note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to add a new note
  const addNote = () => {
    if (newNote.trim() !== "") {
      setNotes([...notes, newNote]);
      setNewNote(""); // Clear input after adding
      setIsModalOpen(false); // Close modal
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Notepad</h1>

        {/* Search bar */}
        <div className="flex mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Search notes..."
          />
        </div>

        {/* "Add Note" button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)} // Open modal
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-200"
          >
            Add Note
          </button>
        </div>

        {/* Notes Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
              >
                <div className="mb-4">
                  <p className="text-lg font-semibold">{note}</p>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => alert("Edit functionality coming soon!")} // Placeholder for editing functionality
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(index)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No notes found</p>
          )}
        </div>

        {/* Add Note Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Add New Note
              </h2>
              <textarea
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                rows="4"
                placeholder="Enter your note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              ></textarea>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)} // Close modal
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addNote}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotepadList;
