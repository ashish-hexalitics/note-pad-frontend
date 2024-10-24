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
  invitedErrorType,
}) {
  return (
    <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Collaborators</h3>
      <ul className="space-y-3 mb-6">
        {collaborators.length > 0 ? (
          collaborators.map((collaborator, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  {collaborator.collaboratorId === user._id ? "You" : collaborator.name}
                </span>
                {noteData && noteData?.isOwner && (
                  <div className="flex items-center space-x-2">
                    <select
                      value={collaborator.permission}
                      onChange={(e) => handlePermission(e, collaborator)}
                      className="px-2 py-1 border rounded text-gray-600"
                    >
                      <option value="view">Can View</option>
                      <option value="edit">Can Edit</option>
                    </select>
                    <button
                      onClick={() => handleRemoveCollaborator(collaborator.collaboratorId)}
                      className="text-red-500 hover:text-red-600 font-semibold"
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
        <div className="space-y-3">
          <UserSearchDropdown
            allUsers={allUsers}
            handledropdownchange={handledropdownchange}
            handleInvite={handleInvite}
            invitedErrorType={invitedErrorType}
            inviteMessage={inviteMessage}
          />
        </div>
      )}
    </div>
  );
}

export default NotePadePermission;

