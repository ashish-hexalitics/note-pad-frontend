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
import MyNoteList from "../../components/MyNoteList";
import CollaborateNoteList from "../../components/CollaborateNoteList";
import { useDispatch, useSelector } from "react-redux";

function NotepadList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, refetch } = useGetNotesApiQuery({
    userId: user?._id,
    searchTerm: searchQuery,
  });
  const { data: collabNotes, refetch: refetchCollaboratorNotes } =
    useGetNotesByCollaboratorIdApiQuery(user?._id);

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
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-600">
          My Notepad
        </h1>

        {/* Search bar */}
        <div className="flex items-center mb-6 shadow-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Search notes..."
          />
          <button className="bg-indigo-500 text-white px-4 py-3 rounded-r-md hover:bg-indigo-600 transition duration-300">
            Search
          </button>
        </div>

        {/* "Add Note" button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)} // Open modal
            className="bg-indigo-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-indigo-600 transition duration-300"
          >
            Add Note
          </button>
        </div>

        {/* Notes Cards */}
        <MyNoteList
          notes={filteredNotes}
          isDeleting={isDeleting}
          deleteNote={deleteNote}
          title={"My notes"}
        />

        <CollaborateNoteList
          notes={collaborateNotes}
          title={"Collaborated Notes"}
        />

        {/* Add Note Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-xl transition-transform transform-gpu animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 text-indigo-600">
                Add New Note
              </h3>

              {/* Note Title */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Note Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter note title..."
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)} // Close modal
                  className="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addNote}
                  className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600 transition duration-300"
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
