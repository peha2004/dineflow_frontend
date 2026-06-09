import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminDashboard() {

  const { logout } = useAuth();

  return (

    <div className="min-h-screen flex">

     

      <div className="w-64 bg-[#b66742] text-white p-5">

        <h1 className="text-2xl font-bold mb-8">
          DineFlow Admin
        </h1>

        <div className="flex flex-col gap-4">

          <Link to="/admin/tables">
            Table Management
          </Link>

          <Link to="/admin/reservations">
            Reservations
          </Link>

          <Link to="/admin/menu">
            Menu Management
          </Link>

          <Link to="/admin/users">
            User Management
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 rounded p-2 mt-5"
          >
            Logout
          </button>

        </div>

      </div>

      

      <div className="flex-1 p-10">

        <h1 className="text-4xl font-bold">
          Welcome Admin
        </h1>

        <p className="mt-3">
          Select an option from the sidebar.
        </p>

      </div>

    </div>
  );
}