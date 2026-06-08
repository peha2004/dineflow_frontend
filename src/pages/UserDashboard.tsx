import { useAuth }
from "../hooks/useAuth";

export default function UserDashboard() {

  const { logout } = useAuth();

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold">

        User Dashboard

      </h1>

      <button
        onClick={logout}
        className="mt-5 bg-red-500 text-white px-5 py-2 rounded"
      >
        Logout
      </button>

    </div>
  );
}