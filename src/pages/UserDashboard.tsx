import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navLinks = [
  { to: "/tables", icon: "🍽️", label: "Tables", desc: "Browse available restaurant tables" },
  { to: "/reservations/create", icon: "📅", label: "Make Reservation", desc: "Book a table for your visit" },
  { to: "/reservations", icon: "📋", label: "My Reservations", desc: "View your booking history" },
  { to: "/menu", icon: "🍔", label: "View Menu", desc: "Explore food and drinks" },
  { to: "/qr", icon: "📱", label: "My QR Code", desc: "Access your booking quickly" },
  { to: "/profile", icon: "👤", label: "Profile", desc: "Manage your account details" },
];

export default function UserDashboard() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black shadow-md shadow-purple-200">
              D
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              DineFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="text-sm text-gray-500 hover:text-purple-600 transition font-medium hidden sm:block"
            >
              My Profile
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

     
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white overflow-hidden shadow-xl shadow-purple-200">
        
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl" />

          <div className="relative z-10">
            <p className="text-purple-100 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-3xl font-black mb-2">Your Dashboard</h1>
            <p className="text-purple-100 text-sm max-w-sm">
              Manage your reservations, explore the menu, and check your QR code — all in one place.
            </p>
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <p className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-5">
          Quick Actions
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {navLinks.map(({ to, icon, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white border border-purple-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition duration-200"
            >
              <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition duration-200">
                {icon}
              </div>
              <h2 className="text-base font-bold text-gray-800 mb-1">{label}</h2>
              <p className="text-sm text-gray-400">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}