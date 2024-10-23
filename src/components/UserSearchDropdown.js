import React, { useState } from "react";

function UserSearchDropdown({ allUsers, handleInvite, handledropdownchange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [permission, setPermission] = useState("view"); // State to track the permission
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] = useState(false); // State to track permission dropdown

  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchTerm(user.email); // Set the search input to the selected user's email
    handledropdownchange && handledropdownchange(user);
    setIsDropdownOpen(false); // Close user dropdown after selecting
  };

  // Handle permission selection
  const handlePermissionChange = (perm) => {
    setPermission(perm);
    setIsPermissionDropdownOpen(false); // Close permission dropdown after selecting
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="w-full">
      <label className="block text-lg font-semibold mb-2">
        Invite Collaborator
      </label>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onClick={() => setIsDropdownOpen(true)} // Open user dropdown when clicked
        onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on typing
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
      />

      {/* User List - Visible only when isDropdownOpen is true */}
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
        <label className="block text-lg font-semibold mb-2">
          Permission
        </label>
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

      {/* Invite Button */}
      <button
        onClick={() => handleInvite(selectedUser, permission)} // Pass selected permission
        disabled={!selectedUser} // Disable if no user is selected
        className="w-full bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Invite Selected User
      </button>
    </div>
  );
}

export default UserSearchDropdown;
