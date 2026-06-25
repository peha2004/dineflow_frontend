import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const API =  import.meta.env.VITE_API_URL;
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

interface Reservation {
  _id: string;
  reservationCode: string;
  functionType: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  totalAmount: number;
  table: { tableNumber: number; capacity: number };
}

const FUNCTION_ICONS: Record<string, string> = {
  BIRTHDAY: "🎂", PARTY: "🎉", NORMAL_DINING: "🍽️", ANNIVERSARY: "💍", CORPORATE: "💼",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
  CONFIRMED: "bg-green-50 text-green-600 border-green-100",
  CANCELLED: "bg-red-50 text-red-500 border-red-100",
  COMPLETED: "bg-blue-50 text-blue-600 border-blue-100",
};

const USER_ACTIONS = [
  {
    to: "/reservations/create",
    icon: "📅",
    label: "Book a Table",
    desc: "Reserve a table for your function",
    highlight: true,
  },
  {
    to: "/reservations/my",
    icon: "📋",
    label: "My Reservations",
    desc: "View and manage your bookings",
    highlight: false,
  },
  {
    to: "/menu",
    icon: "🍔",
    label: "View Menu",
    desc: "Explore food, drinks & desserts",
    highlight: false,
  },
  {
    to: "/profile",
    icon: "👤",
    label: "My Profile",
    desc: "Update your account details",
    highlight: false,
  },
];

export default function UserDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/reservations/my`, authHeader())
      .then(r => setRecentReservations(r.data.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50">
      <nav className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black shadow-md shadow-purple-200">
              D
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              DineFlow
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="text-sm text-gray-500 hover:text-purple-600 transition font-medium hidden sm:block"
            >
              👤 Profile
            </Link>
            <button
              onClick={logout}
              className="text-sm px-4 py-2 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white overflow-hidden shadow-xl shadow-purple-200">
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Welcome back 👋</p>
              <h1 className="text-3xl font-black mb-2">Your Dashboard</h1>
              <p className="text-purple-100 text-sm max-w-sm">
                Book tables, add food, and track your reservations — all in one place.
              </p>
            </div>
            <button
              onClick={() => navigate("/reservations/create")}
              className="flex-shrink-0 bg-white text-purple-700 font-black text-sm px-6 py-3 rounded-2xl hover:bg-purple-50 transition shadow-md"
            >
              + Book a Table
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-4">What would you like to do?</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {USER_ACTIONS.map(({ to, icon, label, desc, highlight }) => (
              <Link
                key={to}
                to={to}
                className={`group rounded-2xl p-6 border transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                  highlight
                    ? "bg-gradient-to-br from-purple-600 to-pink-500 border-transparent text-white shadow-md shadow-purple-200"
                    : "bg-white border-purple-100 hover:border-purple-300"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition ${
                  highlight ? "bg-white/20" : "bg-purple-50 border border-purple-100"
                }`}>
                  {icon}
                </div>
                <h2 className={`text-sm font-bold mb-1 ${highlight ? "text-white" : "text-gray-800"}`}>{label}</h2>
                <p className={`text-xs ${highlight ? "text-purple-100" : "text-gray-400"}`}>{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold tracking-widest uppercase text-purple-400">Recent Reservations</p>
            <Link to="/reservations/my" className="text-xs text-purple-600 hover:underline font-medium">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-purple-100 h-36 animate-pulse" />
              ))}
            </div>
          ) : recentReservations.length === 0 ? (
            <div className="bg-white border border-purple-100 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-3">📅</div>
              <p className="font-bold text-gray-700 mb-1">No reservations yet</p>
              <p className="text-sm text-gray-400 mb-4">Book your first table to get started!</p>
              <Link
                to="/reservations/create"
                className="inline-block px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold rounded-xl hover:opacity-90 transition shadow-md shadow-purple-200"
              >
                Book Now
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-4">
              {recentReservations.map(r => (
                <Link
                  key={r._id}
                  to={`/reservations/${r._id}`}
                  className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-purple-300 transition duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{FUNCTION_ICONS[r.functionType] ?? "📅"}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${STATUS_STYLES[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="font-bold text-gray-800 text-sm mb-1">
                    {r.functionType.replace("_", " ")}
                  </p>
                  <p className="text-xs text-gray-400 mb-1">
                    📅 {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    ⏰ {r.startTime} – {r.endTime}
                  </p>
                  {r.table && (
                    <p className="text-xs text-gray-400 mb-3">
                      🍽️ Table T{String(r.table.tableNumber).padStart(2, "0")}
                    </p>
                  )}
                  <p className="text-sm font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Rs. {r.totalAmount?.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}