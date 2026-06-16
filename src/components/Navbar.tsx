import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            D
          </div>

          <h1 className="font-bold text-xl text-purple-600">
            DineFlow
          </h1>
        </div>

        <div className="flex items-center gap-4">

          <Link
            to="/user"
            className="text-gray-600 hover:text-purple-600"
          >
            Dashboard
          </Link>

          <Link
            to="/reservations/my"
            className="text-gray-600 hover:text-purple-600"
          >
            Reservations
          </Link>

          <Link
            to="/menu"
            className="text-gray-600 hover:text-purple-600"
          >
            Menu
          </Link>

          <Link
            to="/profile"
            className="text-gray-600 hover:text-purple-600"
          >
            Profile
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}