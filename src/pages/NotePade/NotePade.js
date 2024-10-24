import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetNoteByIdApiQuery,
  useUpdateNotesApiMutation,
  useUpdateNotesCollaboratorsApiMutation,
  useRemoveNotesCollaboratorsApiMutation,
  useUpdatePermissionCollaboratorsApiMutation,
  useCheckPermissionCollaboratorsApiMutation,
} from "../../store/slices/noteSlice/api";
import { setNote } from "../../store/slices/noteSlice/reducer";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUserQuery,
  useGetAllUsersQuery,
} from "../../store/slices/userSlice/api";
import { setUser } from "../../store/slices/userSlice/reducer";
import io from "socket.io-client";
import UserSearchDropdown from "../../components/UserSearchDropdown";
import NotePadeEditor from "../../components/NotePadeEditor";

function AddNote() {
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const note = useSelector((state) => state.noteSlice.note);
  const [content, setContent] = useState(note.content);
  const [collaborators, setCollaborators] = useState([]);
  const [messagging, setMessagging] = useState([]);
  const [permision, setPermision] = useState("view");
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

  const {
    data: noteData,
    isLoading,
    isError,
  } = useGetNoteByIdApiQuery(params.noteId);
  const [updateNote] = useUpdateNotesApiMutation();
  const [updateNotesCollaboratorsApi] =
    useUpdateNotesCollaboratorsApiMutation();
  const [removeNotesCollaboratorsApi] =
    useRemoveNotesCollaboratorsApiMutation();
  const [updatePermissionCollaboratorsApi] =
    useUpdatePermissionCollaboratorsApiMutation();
  const [checkPermissionCollaboratorsApi] =
    useCheckPermissionCollaboratorsApiMutation();

  useEffect(() => {
    if (noteData && !isLoading && !isError) {
      dispatch(setNote(noteData?.data));
      setContent(noteData.data.content);
      setCollaborators(noteData?.data.collaborators || []);
    }
  }, [noteData, isLoading, isError, dispatch]);

  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:8000");
      setSocket(newSocket);
      console.log(newSocket);
    }
    return () => {
      socket && socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinNote", {
        noteId: params.noteId,
        user: {
          ...user,
          token: localStorage.getItem("access_token"),
        },
      });
      socket.on("sentJoinedUsers", (data) => {
        const { collaborators, onlineUsers } = data;
        const updatedCollaborators =
          Array.isArray(collaborators?.data?.collaborators) &&
          collaborators?.data?.collaborators.map((collab) => {
            const onUser = onlineUsers.find(
              (onlineUser) => onlineUser._id === collab.collaboratorId
            );
            return {
              ...collab,
              isOnline: onUser?.isOnline || false,
            };
          });
        setCollaborators(updatedCollaborators);
      });
      socket.on("noteContentUpdated", (data) => {
        setMessagging(data.messagging);
        setContent(data.currentContent);
        // setContent(data.content);
      });
      socket.on("resetMessegSuccess", () => {
        setMessagging([]);
      });
      socket.on("removeCollaboratorsSuccess", (collaboratorId) => {
        setCollaborators((prev) =>
          prev.filter((collab) => collab.collaboratorId !== collaboratorId)
        );
      });
    }
  }, [socket]);

  useEffect(() => {
    if (messagging.length > 0) {
      setTimeout(() => {
        socket.emit("resetMesseging", {});
      }, 3000);
    }
  }, [messagging]);

  useEffect(() => {
    if (params.noteId) {
      setUserPermisstion(params.noteId);
    }
  }, [params.noteId]);

  const setUserPermisstion = async (noteId) => {
    const permissionData = await checkPermissionCollaboratorsApi(
      noteId
    ).unwrap();
    setPermision(permissionData.permission);
  };

  const { data: userData } = useGetUserQuery();

  const { data: allUsers } = useGetAllUsersQuery();

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      if (
        userData &&
        userData?.data?.user &&
        noteData &&
        noteData?.data?.owner
      ) {
        if (userData.data.user._id !== noteData.data.owner) {
          handlecupdateCollabe();
        }
        dispatch(setUser(userData?.data?.user));
      }
    }
  }, [user, userData, dispatch]);

  const handlecupdateCollabe = async () => {
    const res = await updateNotesCollaboratorsApi({
      noteId: noteData.data._id,
    }).unwrap();
  };

  const handlechange = async (e) => {
    e.preventDefault();
    setContent(e.target.value);
    const updateNoteContentdata = {
      ...user,
      content: e.target.value,
      noteId: params.noteId,
      token: localStorage.getItem("access_token"),
    };
    socket.emit("updateNoteContent", updateNoteContentdata);
    socket.on("noteContentUpdated", (data) => {
      setMessagging(data.messagging);
      console.log(data.messagging, "updatedNote");
      // setContent(data.content);
    });
    await updateNote({
      content: e.target.value,
      noteId: params.noteId,
    }).unwrap();
  };

  const handleRemoveCollaborator = (collaboratorId) => {
    setCollaborators((prev) =>
      prev.filter((collab) => collab.collaboratorId !== collaboratorId)
    );
    removeNotesCollaboratorsApi({
      collaboratorId,
      noteId: params.noteId,
    }).unwrap();
    socket.emit("removeCollaborators", collaboratorId);
  };

  const handleInvite = async (selectedUser, permission) => {
    if (!selectedUser) {
      alert("No user selected.");
      return;
    }

    const res = await updateNotesCollaboratorsApi({
      noteId: noteData.data._id,
      collaboratorId: selectedUser._id,
      permission,
    }).unwrap();

    // Handle inviting the user (you can make an API call here)
    console.log("Inviting user:", permission, selectedUser._id, res);
    // Call your invite API logic or socket event here
  };

  const handlePermission = (e, collaborator) => {
    console.log(collaborator, e.target.value);
    updatePermissionCollaboratorsApi({
      permission: e.target.value,
      collaboratorId: collaborator.collaboratorId,
    }).unwrap();
    setCollaborators(
      collaborators.map((colaab) => {
        if (colaab.collaboratorId === collaborator.collaboratorId) {
          return { ...colaab, permission: e.target.value };
        }
        return colaab;
      })
    );
  };

  const handledropdownchange = (user) => {
    console.log(user, "selct");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start space-x-10">
      <NotePadeEditor
        note={note}
        content={content}
        handlechange={handlechange}
        user={user}
        messagging={messagging}
        permision={permision}
      />
      {/* Options Section */}
      <div className="w-80 bg-white p-6 rounded-lg shadow-md">
        {/* Collaborators List */}
        <h3 className="text-lg font-semibold mb-2">Collaborators</h3>
        <ul className="space-y-2">
          {collaborators.length > 0 ? (
            collaborators.map((collaborator, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
              >
                {/* Flex container for the name and online status */}
                <div className="flex items-center justify-between space-x-2">
                  {/* Online/Offline Indicator */}
                  {/* <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      collaborator.isOnline ||
                      collaborator.collaboratorId === user._id
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span> */}

                  {/* Collaborator's name */}
                  <span>
                    {collaborator.collaboratorId === user._id
                      ? "You"
                      : collaborator.name}
                  </span>
                  {/* Remove button (visible if the current user is the owner) */}
                  {noteData?.data?.isOwner && (
                    <div className="ms-2">
                      <select
                        value={collaborator.permission}
                        onChange={(e) => handlePermission(e, collaborator)}
                      >
                        <option value="view">Can View</option>
                        <option value="edit">Can Edit</option>
                      </select>
                      <button
                        onClick={() =>
                          handleRemoveCollaborator(collaborator.collaboratorId)
                        }
                        className="text-red-500 hover:text-red-700 font-semibold ms-2"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No collaborators added yet.</p>
          )}
        </ul>
        {allUsers?.data?.users && noteData?.data?.isOwner && (
          <UserSearchDropdown
            allUsers={allUsers?.data?.users}
            handledropdownchange={handledropdownchange}
            handleInvite={handleInvite}
          />
        )}
      </div>
    </div>
  );
}

export default AddNote;
