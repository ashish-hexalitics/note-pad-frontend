import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetNotesApiQuery,
  useAddNotesApiMutation,
  useDeleteNotesApiMutation,
  useGetNotesByCollaboratorIdApiQuery,
} from "../../store/slices/noteSlice/api";
import {
  getNotes,
  getcollaborateNotes,
} from "../../store/slices/noteSlice/reducer";
import { useDispatch, useSelector } from "react-redux";

function NotepadList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, refetch } = useGetNotesApiQuery({
    userId: user?._id,
    searchTerm: searchQuery,
  });
  const { data: collabNotes } = useGetNotesByCollaboratorIdApiQuery(user?._id);

  console.log(data, collabNotes, "collabNotes");

  const { notes, collaborateNotes } = useSelector((state) => state.noteSlice);

  // Using the mutation hook for adding a note
  const [addNoteApi, { isLoading: isAdding, isError: isAddError, isSuccess }] =
    useAddNotesApiMutation();

  // Using the mutation hook for deleting a note
  const [deleteNoteApi, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteNotesApiMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(""); // For the new note title
  const navigate = useNavigate();

  useEffect(() => {
    if (data && !isLoading && !isError) {
      dispatch(getNotes(data.data));
    }
  }, [data, isLoading, isError, dispatch]);

  useEffect(() => {
    if (searchQuery) {
      refetch();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (collabNotes) {
      dispatch(getcollaborateNotes(collabNotes.data));
    }
  }, [collabNotes, isLoading, isError, dispatch]);

  // Function to delete a note
  const deleteNote = async (noteId) => {
    try {
      await deleteNoteApi(noteId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete note: ", error);
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to add a new note
  const addNote = async () => {
    if (title.trim() !== "") {
      try {
        const res = await addNoteApi({
          title,
          owner: user?._id,
          content: "",
        }).unwrap();
        setTitle("");
        setIsModalOpen(false);
        refetch();
        navigate(`/user/add-note/${res.data._id}`);
      } catch (error) {
        console.error("Failed to add note: ", error);
      }
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
        <p className="text-lg font-semibold mb-2">My notes</p>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-2">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between overflow-hidden"
              >
                <div className="mb-4">
                  <p className="text-lg font-semibold">{note.title}</p>
                  <p className="text-lg font-semibold">{note.content}</p>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => navigate(`/user/edit-note/${note._id}`)}
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note._id)} // Pass the noteId to delete
                    className="text-red-500 hover:text-red-700 font-semibold"
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

        {/* Notes Cards */}
        <p className="text-lg font-semibold mb-2">invited notes</p>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {collaborateNotes.length > 0 ? (
            collaborateNotes.map((note, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between overflow-hidden"
              >
                <div className="mb-4">
                  <p className="text-lg font-semibold">{note.title}</p>
                  <p className="text-lg font-semibold">{note.content}</p>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() =>
                      navigate(
                        `/user/${
                          note.permission === "edit" ? "edit" : "view"
                        }-note/${note._id}`
                      )
                    }
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                  >
                    {note.permission === "edit" ? "Edit" : "View"}
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
              {/* Note Title */}
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Add New Note Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Enter the title of your note..."
                />
              </div>
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
                  disabled={isAdding} // Disable while adding note
                >
                  {isAdding ? "Adding..." : "Add Note"}
                </button>
              </div>

              {/* Show error message if failed to add note */}
              {isAddError && (
                <p className="text-red-500 mt-4">Failed to add note.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotepadList;
