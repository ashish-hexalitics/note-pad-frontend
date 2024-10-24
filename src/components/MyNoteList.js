import React from "react";
import { useNavigate } from "react-router-dom";

function MyNoteList({ notes, isDeleting, deleteNote }) {
  const navigate = useNavigate();

  return (
    <>
      <p className="text-2xl font-semibold text-indigo-600 mb-6">My Notes</p>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105 flex flex-col justify-between overflow-hidden"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                  {note.title}
                </h3>
                <p className="text-gray-600 text-sm truncate">{note.content}</p>
              </div>
              <div className="flex justify-end space-x-4 mt-auto">
                <button
                  onClick={() => navigate(`/user/edit-note/${note._id}`)}
                  className="text-blue-500 hover:text-blue-700 font-semibold transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteNote(note._id)} // Pass the noteId to delete
                  className="text-red-500 hover:text-red-700 font-semibold transition-colors duration-200"
                  disabled={isDeleting} // Disable button while deleting
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No notes found</p>
        )}
      </div>
    </>
  );
}

export default MyNoteList;
