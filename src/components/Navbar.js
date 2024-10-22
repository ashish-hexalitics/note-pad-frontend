import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const { user } = useSelector((state) => state.userSlice);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <ul className="flex space-x-4 text-white">
          <li>
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="hover:text-gray-300">
              Register
            </Link>
          </li>
          <li>
            <Link to="/user/notes" className="hover:text-gray-300">
              notes
            </Link>
          </li>
        </ul>
        <div>
          <p className="hover:text-gray-300 text-white">{user.name}</p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
