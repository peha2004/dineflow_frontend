import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function UserDashboard() {

  const { logout } = useAuth();

  return (

    <div className="min-h-screen bg-gray-100">

     

      <div className="bg-[#b66742] text-white p-5 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          DineFlow
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

    

      <div className="p-10">

        <h1 className="text-4xl font-bold mb-8">
          User Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          

          <Link
            to="/tables"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold">
              🍽 View Available Tables
            </h2>

            <p className="mt-2 text-gray-600">
              Browse available restaurant tables.
            </p>
          </Link>

         

          <Link
            to="/reservations/create"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold">
              📅 Make Reservation
            </h2>

            <p className="mt-2 text-gray-600">
              Book a table for your visit.
            </p>
          </Link>

        

          <Link
            to="/reservations"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold">
              📋 My Reservations
            </h2>

            <p className="mt-2 text-gray-600">
              View your booking history.
            </p>
          </Link>

       

          <Link
            to="/menu"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold">
              🍔 View Menu
            </h2>

            <p className="mt-2 text-gray-600">
              Explore food and drinks.
            </p>
          </Link>

        

          <Link
            to="/qr"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold">
              📱 Scan QR / Reservation Code
            </h2>

            <p className="mt-2 text-gray-600">
              Access your booking quickly.
            </p>
          </Link>

         

          <Link
            to="/profile"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold">
              👤 Profile
            </h2>

            <p className="mt-2 text-gray-600">
              Manage your account details.
            </p>
          </Link>

        </div>

      </div>

    </div>
  );
}