import React from "react";
import { useNavigate } from "react-router-dom";

function NotePadeEditor({
  note,
  content,
  handlechange,
  user,
  messagging,
  permision,
  noteData,
}) {
  const navigate = useNavigate();
  return (
    <div className="min-w-5xl w-full bg-white px-4 py-8 flex flex-col items-start">
      <div className="flex mb-8 justify-between items-center w-full">
        <h1 className="text-4xl font-bold text-left text-indigo-600">
          Edit Your Note
        </h1>
        {noteData && noteData?.isOwner && (
          <button
            onClick={() => navigate(`/user/history/${noteData?._id}`)}
            className="text-gray-500"
          >
            See All History
          </button>
        )}
      </div>

      {/* Note Title Display */}
      <div className="mb-6 w-full">
        <label className="block text-lg font-semibold mb-2">Note Title:</label>
        <p className="w-full p-2 border rounded-md bg-gray-100">
          {note?.title || "No title available"}
        </p>
      </div>

      {/* Note Content */}
      <div className="mb-6 w-full">
        {permision === "edit" ? (
          <div>
            <label className="block text-lg font-semibold mb-2">
              Note Content
            </label>
            <textarea
              value={content}
              onChange={handlechange}
              rows="8"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Write your note content here..."
              disabled={permision !== "edit"}
            ></textarea>
          </div>
        ) : (
          <div>{content}</div>
        )}
      </div>
      <div className="w-full">
        {Array.isArray(messagging) &&
          messagging.length > 0 &&
          messagging
            .filter((msg) => msg.userId !== user._id)
            .map((message, index) => {
              return (
                <div
                  key={index}
                  className="w-full mb-6 p-6 rounded-lg shadow-md"
                >
                  {/* User's message with justified text */}
                  <div className="w-full text-justify text-green-500">
                    <span className="inline-block">{message.message}</span>
                  </div>

                  {/* Content block with justified text */}
                  <div className="w-full text-justify text-gray-500">
                    {message.content}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default NotePadeEditor;
