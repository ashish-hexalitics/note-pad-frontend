import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNote } from "../../store/slices/noteSlice/reducer";
import { useGetNoteByIdApiQuery } from "../../store/slices/noteSlice/api";

function NoteHistory() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [collaborators, setCollaborators] = useState([]);

  const note = useSelector((state) => state.noteSlice.note);

  const {
    data: noteData,
    isLoading,
    isError,
  } = useGetNoteByIdApiQuery(params.noteId);

  useEffect(() => {
    if (noteData && !isLoading && !isError) {
      dispatch(setNote(noteData?.data));
      setCollaborators(noteData?.data.collaborators || []);
    }
  }, [noteData, isLoading, isError, dispatch]);

  // Render the collaborators in the UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex mb-8 justify-between items-center w-full">
        <h1 className="text-4xl font-bold text-left text-indigo-600 mb-8">
          Note Collaboration History
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500"
        >
         Back
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center">
          <p className="text-red-500">Error loading note history</p>
        </div>
      ) : collaborators.length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-500">No collaborators found for this note.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-indigo-600 text-white text-left">
                <th className="px-6 py-3 font-medium uppercase tracking-wider">
                  Collaborator Content
                </th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider">
                  Updated By
                </th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider">
                  Permission
                </th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider">
                  Joined At
                </th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider">
                  Updated At
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {collaborators.map((collaborator, index) => (
                <tr
                  key={collaborator._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-indigo-50`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {collaborator.collaboratorContent}
                  </td>
                  <td className="px-6 py-4">{collaborator.name}</td>
                  <td className="px-6 py-4">{collaborator.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 inline-block rounded-full text-sm font-medium ${
                        collaborator.permission === "edit"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {collaborator.permission}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(collaborator.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(collaborator.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NoteHistory;
