import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetNoteByIdApiQuery,
  useUpdateNotesApiMutation,
} from "../../store/slices/noteSlice/api";
import { setNote } from "../../store/slices/noteSlice/reducer";
import { useDispatch, useSelector } from "react-redux";

function AddNote() {
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const note = useSelector((state) => state.noteSlice.note);
  const [profileColor, setProfileColor] = useState("#4f46e5"); // Default profile color
  const [content, setContent] = useState(note.content); // State for user name
  const [collaborators, setCollaborators] = useState([]); // State for collaborators
  const navigate = useNavigate();

  const {
    data: noteData,
    isLoading,
    isError,
  } = useGetNoteByIdApiQuery(params.noteId); // Fetch note by ID
  const [updateNote, { isLoading: isUpdating }] = useUpdateNotesApiMutation(); // Mutation for updating notes

  useEffect(() => {
    if (noteData && !isLoading && !isError) {
      dispatch(setNote(noteData?.data));
      setContent(noteData.data.content);
      setCollaborators(noteData?.data.collaborators || []); // Fetch collaborators
    }
  }, [noteData, isLoading, isError, dispatch]);

  // Placeholder function for inviting friends
  const handleInviteFriends = () => {
    alert("Invite friends functionality is coming soon!");
  };

  const handleRemoveCollaborator = (collaboratorId) => {
    setCollaborators((prev) =>
      prev.filter((collab) => collab.id !== collaboratorId)
    );
  };

  const handlechange = async (e) => {
    e.preventDefault();
    setContent(e.target.value);
    await updateNote({
      content: e.target.value,
      noteId: params.noteId,
    }).unwrap();
  };

  console.log(note, user, "noteData");

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start space-x-10">
      {/* Main Note Section */}
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Add a New Note</h1>

        {/* Note Title Display */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Note Title:
          </label>
          <p className="w-full p-2 border rounded-md bg-gray-100">
            {note?.title || "No title available"}
          </p>
        </div>

        {/* Note Content */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Note Content
          </label>
          <textarea
            value={content}
            onChange={handlechange}
            rows="8"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Write your note content here..."
          ></textarea>
        </div>
      </div>

      {/* Options Section */}
      <div className="w-80 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Options</h2>

        {/* Invite Friends Button */}
        <button
          onClick={handleInviteFriends}
          className="w-full bg-blue-500 text-white px-4 py-2 mb-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Invite Friends
        </button>

        {/* Collaborators List */}
        <h3 className="text-lg font-semibold mb-2">Collaborators</h3>
        <ul className="space-y-2">
          {collaborators.length > 0 ? (
            collaborators.map((collaborator) => (
              <li
                key={collaborator.id}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
              >
                <span>{collaborator.name}</span>
                <button
                  onClick={() => handleRemoveCollaborator(collaborator.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No collaborators added yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AddNote;
