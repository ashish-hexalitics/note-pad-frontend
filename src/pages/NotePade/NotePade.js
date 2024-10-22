import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetNoteByIdApiQuery,
  useUpdateNotesApiMutation,
  useUpdateNotesCollaboratorsApiMutation,
} from "../../store/slices/noteSlice/api";
import { setNote } from "../../store/slices/noteSlice/reducer";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "../../store/slices/userSlice/api";
import { setUser } from "../../store/slices/userSlice/reducer";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // Replace with your server URL

function AddNote() {
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const note = useSelector((state) => state.noteSlice.note);
  const [content, setContent] = useState(note.content);
  const [collaborators, setCollaborators] = useState([]);
  const [permision, setPermision] = useState("view");

  const navigate = useNavigate();

  const {
    data: noteData,
    isLoading,
    isError,
  } = useGetNoteByIdApiQuery(params.noteId);
  const [updateNote] = useUpdateNotesApiMutation();
  const [updateNotesCollaboratorsApi] =
    useUpdateNotesCollaboratorsApiMutation();

  useEffect(() => {
    if (noteData && !isLoading && !isError) {
      dispatch(setNote(noteData?.data));
      setContent(noteData.data.content);
      setCollaborators(noteData?.data.collaborators || []);
      console.log(noteData);
      if (noteData?.data?.isOwner) {
        setPermision("all");
      }
    }
  }, [noteData, isLoading, isError, dispatch]);

  const { data: userData } = useGetUserQuery();

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      if (
        userData &&
        userData?.data?.user &&
        noteData &&
        noteData?.data?.owner
      ) {
        socket.emit("joinNote", {
          noteId: params.noteId,
          user: {
            ...userData.data.user,
            token: localStorage.getItem("access_token"),
          },
        });
        // Listen for collaborator updates
        socket.on("updateCollaborators", (updatedCollaborators) => {
          console.log(
            "Updated Collaborators:",
            updatedCollaborators.data.collaborators
          );
          setCollaborators(updatedCollaborators.data.collaborators);
        });
        if (userData.data.user._id !== noteData.data.owner) {
          handlecupdateCollabe();
        } else {
          setPermision("all");
        }
        dispatch(setUser(userData?.data?.user));
      }
    }
    return () => {
      socket.off("updateCollaborators");
      socket.disconnect();
    };
  }, [user, userData, dispatch]);

  // useEffect(() => {
  //   // Join the note room when the component mounts
  //   if (user) {
  //     console.log('gaya')
  //     socket.emit("joinNote", {
  //       noteId: params.noteId,
  //       user: { ...user, token: localStorage.getItem("access_token") },
  //     });

  //     // Listen for collaborator updates
  //     socket.on("updateCollaborators", (updatedCollaborators) => {
  //       console.log(
  //         "Updated Collaborators:",
  //         updatedCollaborators.data.collaborators
  //       );
  //       setCollaborators(updatedCollaborators.data.collaborators);
  //     });
  //   }
  //   // Cleanup on component unmount
  //   return () => {
  //     socket.off("updateCollaborators");
  //     socket.disconnect();
  //   };
  // }, [user]);

  // socket.on("updateCollaborators", (updatedCollaborators) => {
  //   console.log(
  //     "Updated Collaborators:",
  //     updatedCollaborators.data.collaborators
  //   );
  //   setCollaborators(updatedCollaborators.data.collaborators);
  // });

  const handlecupdateCollabe = async () => {
    const res = await updateNotesCollaboratorsApi(noteData.data._id).unwrap();
    setPermision(
      res?.data?.collaborator ? res?.data?.collaborator?.permission : "all"
    );
  };

  const handlechange = async (e) => {
    e.preventDefault();
    setContent(e.target.value);
   const data = await updateNote({
      content: e.target.value,
      noteId: params.noteId,
    }).unwrap();
    socket.emit("updateNoteContent", data);
    socket.on("noteContentUpdated", (updatedNote) => {
      console.log(updatedNote.data,"updatedNote")
    });
  };

  const handleInviteFriends = () => {
    if (note.sharedLink) {
      navigator.clipboard
        .writeText(note.sharedLink)
        .then(() => {
          alert("Invite link copied to clipboard! Share it with your friends.");
        })
        .catch((err) => {
          console.error("Failed to copy link: ", err);
          alert("Failed to copy invite link. Please try again.");
        });
    } else {
      alert("No invite link available.");
    }
  };

  const handleRemoveCollaborator = (collaboratorId) => {
    setCollaborators((prev) =>
      prev.filter((collab) => collab.id !== collaboratorId)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start space-x-10">
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
            disabled={permision !== "all" && permision !== "edit"}
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
          Copy Invite Friends Link
        </button>

        {/* Collaborators List */}
        <h3 className="text-lg font-semibold mb-2">Collaborators</h3>
        <ul className="space-y-2">
          {collaborators.length > 0 ? (
            collaborators.map((collaborator, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
              >
                <span>{collaborator.name}</span>
                {userData?.data?.user?._id === noteData?.data?.owner && (
                  <button
                    onClick={() => handleRemoveCollaborator(collaborator.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                )}
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
