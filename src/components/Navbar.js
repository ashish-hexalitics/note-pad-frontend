import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const { user } = useSelector((state) => state.userSlice);
  const isUser = localStorage.getItem("access_token");

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md p-4" style={{height:'70px'}}>
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-6 text-white font-semibold">
          <li>
            <Link
              to="/"
              className="hover:text-gray-200 transition duration-300 ease-in-out"
            >
              Home
            </Link>
          </li>
          {!isUser ? (
            <li>
              <Link
                to="/login"
                className="hover:text-gray-200 transition duration-300 ease-in-out"
              >
                Login
              </Link>
            </li>
          ) : (
            <li>
              <Link
                to="/user/notes"
                className="hover:text-gray-200 transition duration-300 ease-in-out"
              >
                Notes
              </Link>
            </li>
          )}
        </ul>

        {isUser && (
          <div className="flex items-center space-x-6">
            <p className="text-white font-medium">{user.name}</p>
            <button
            className="bg-white text-purple-600 py-2 px-8 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300"
            onClick={() => {
                localStorage.removeItem("access_token");
                window.location.reload();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
