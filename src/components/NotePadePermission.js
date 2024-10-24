import React from "react";
import UserSearchDropdown from "./UserSearchDropdown";

function NotePadePermission({
  user,
  allUsers,
  noteData,
  collaborators,
  handleRemoveCollaborator,
  handlePermission,
  handledropdownchange,
  handleInvite,
  inviteMessage,
  invitedErrorType
}) {
  return (
    <div className="w-80 bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-2">Collaborators</h3>
      <ul className="space-y-2">
        {collaborators.length > 0 ? (
          collaborators.map((collaborator, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
            >
              <div className="flex items-center justify-between space-x-2">
                <span>
                  {collaborator.collaboratorId === user._id
                    ? "You"
                    : collaborator.name}
                </span>
                {noteData && noteData?.isOwner && (
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
      {allUsers && noteData && noteData?.isOwner && (
        <UserSearchDropdown
          allUsers={allUsers}
          handledropdownchange={handledropdownchange}
          handleInvite={handleInvite}
          invitedErrorType={invitedErrorType}
          inviteMessage={inviteMessage}
        />
      )}
    </div>
  );
}

export default NotePadePermission;
