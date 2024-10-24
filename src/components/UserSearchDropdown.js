import React, { useState, useEffect } from "react";
import Alert from "./common/Alert";

function UserSearchDropdown({
  allUsers,
  handleInvite,
  handledropdownchange,
  invitedErrorType,
  inviteMessage,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [permission, setPermission] = useState("view");
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] =
    useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (inviteMessage) {
      setShow(true);
    }
  }, [inviteMessage]);

  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchTerm(user.email);
    handledropdownchange && handledropdownchange(user);
    setIsDropdownOpen(false);
  };

  const handlePermissionChange = (perm) => {
    setPermission(perm);
    setIsPermissionDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="w-full">
      <label className="block text-lg font-semibold mb-2">
        Invite Collaborator
      </label>

      <input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onClick={() => setIsDropdownOpen(true)}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
      />

      {isDropdownOpen && (
        <ul className="max-h-40 overflow-y-auto border rounded-md">
          {allUsers && allUsers.length > 0 ? (
            allUsers
              .filter((user) =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <li
                  key={user._id}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    selectedUser?._id === user._id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  {user.email}
                </li>
              ))
          ) : (
            <p className="text-gray-500 p-2">No users found.</p>
          )}
        </ul>
      )}

      {/* Permissions Dropdown */}
      <div className="relative">
        <label className="block text-lg font-semibold mb-2">Permission</label>
        <div
          onClick={() => setIsPermissionDropdownOpen(!isPermissionDropdownOpen)}
          className="w-full p-2 border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
        >
          {permission === "view" ? "Can View" : "Can Edit"}
        </div>

        {isPermissionDropdownOpen && (
          <ul className="absolute w-full bg-white border rounded-md mt-1 shadow-md z-10">
            <li
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handlePermissionChange("view")}
            >
              Can View
            </li>
            <li
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handlePermissionChange("edit")}
            >
              Can Edit
            </li>
          </ul>
        )}
      </div>

      <button
        onClick={() => handleInvite(selectedUser, permission)}
        disabled={!selectedUser}
        className="w-full bg-blue-500 text-white px-4 py-2 mt-4 mb-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Invite Selected User
      </button>
      {invitedErrorType && inviteMessage && show && (
        <Alert
          type={invitedErrorType}
          message={inviteMessage}
          onClose={() => {
            setShow(false);
          }}
        />
      )}
    </div>
  );
}

export default UserSearchDropdown;
