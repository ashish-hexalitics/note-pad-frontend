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
import NotePadeEditor from "../../components/NotePadeEditor";
import NotePadePermission from "../../components/NotePadePermission";
import AlertModal from "../../components/common/AlertModal";

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
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showPermisionAlertModal, setShowPermisionAlertModal] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [invitedErrorType, setInvitedErrorType] = useState("");
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
        setCollaborators(
          (prev) =>
            prev &&
            prev.filter((collab) => collab.collaboratorId !== collaboratorId)
        );
        if (user._id === collaboratorId) {
          setShowAlertModal(true);
        }
      });
      socket.on("updatedCollaboratorPermission", (updatedPermission) => {
        if (user._id === updatedPermission.collaboratorId) {
          setPermision(updatedPermission.permission);
          setShowPermisionAlertModal(true);
        }
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
    setInviteMessage(res?.message ? res?.message : "");
    setInvitedErrorType(res?.status ? res?.status : "");
    socket.emit("sendCollaboratorNotes", user);
  };

  const handlePermission = (e, collaborator) => {
    updatePermissionCollaboratorsApi({
      permission: e.target.value,
      collaboratorId: collaborator.collaboratorId,
    }).unwrap();

    socket.emit("updateCollaboratorPermission", {
      permission: e.target.value,
      collaboratorId: collaborator.collaboratorId,
    });

    setCollaborators(
      collaborators.map((collab) => {
        if (collab.collaboratorId === collaborator.collaboratorId) {
          return { ...collab, permission: e.target.value };
        }
        return collab;
      })
    );
  };

  const handledropdownchange = (user) => {
    console.log(user, "selct");
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-between">
      <NotePadeEditor
        note={note}
        content={content}
        handlechange={handlechange}
        user={user}
        messagging={messagging}
        permision={permision}
        noteData={noteData?.data}
      />
      <NotePadePermission
        handleRemoveCollaborator={handleRemoveCollaborator}
        handlePermission={handlePermission}
        handledropdownchange={handledropdownchange}
        handleInvite={handleInvite}
        collaborators={collaborators}
        allUsers={allUsers?.data?.users}
        noteData={noteData?.data}
        user={user}
        inviteMessage={inviteMessage}
        invitedErrorType={invitedErrorType}
      />
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => {
          setShowAlertModal(false);
          window.location.reload();
        }}
        message="Your Note access denied"
        type="error"
      />
      <AlertModal
        isOpen={showPermisionAlertModal}
        onClose={() => {
          setShowPermisionAlertModal(false);
        }}
        message={`Permission Updated ! ${
          permision === "edit"
            ? "Your Can Edit This Note Now"
            : "Your Can View Only This Note"
        }`}
        type="success"
      />
    </div>
  );
}

export default AddNote;
