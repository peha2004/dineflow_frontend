import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const API = "http://localhost:5000/api";
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const navItems = [
  { to: "/admin", icon: "📊", label: "Dashboard", exact: true },
  { to: "/admin/tables", icon: "🍽️", label: "Tables" },
  { to: "/admin/menu", icon: "🍔", label: "Menu" },
  { to: "/admin/users", icon: "👥", label: "Users" },
  { to: "/admin/reservations", icon: "📅", label: "Reservations" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to) && to !== "/admin"
      ? true
      : location.pathname === to;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-black shadow-lg">D</div>
          <div>
            <p className="font-black text-white text-lg leading-none">DineFlow</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ to, icon, label, exact }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(to, exact)
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
      
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-800"
          >
            ☰
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">A</span>
            Admin
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}


export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/admin/users/stats`, authHeader())
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: "Total Users", value: stats.total, icon: "👥", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Regular Users", value: stats.regularUsers, icon: "👤", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { label: "Admins", value: stats.admins, icon: "🛡️", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
    { label: "Active Users", value: stats.activeUsers, icon: "✅", color: "bg-green-50 text-green-600 border-green-100" },
  ] : [];

  const quickLinks = [
    { to: "/admin/tables", icon: "🍽️", label: "Manage Tables", desc: "Add, edit or remove tables" },
    { to: "/admin/menu", icon: "🍔", label: "Manage Menu", desc: "Create and update menu items" },
    { to: "/admin/users", icon: "👥", label: "Manage Users", desc: "View and manage user accounts" },
    { to: "/admin/reservations", icon: "📅", label: "Reservations", desc: "View all bookings" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
      
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800">Welcome back, Admin 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening with DineFlow today.</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map(({ label, value, icon, color }) => (
              <div key={label} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4 ${color.split(" ")[2]}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color.split(" ").slice(0, 2).join(" ")}`}>
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4">Quick Actions</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map(({ to, icon, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition duration-200"
              >
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition">
                  {icon}
                </div>
                <p className="font-bold text-slate-800 text-sm">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
        {stats?.recentUsers?.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <p className="font-bold text-slate-800 text-sm">Recent Registrations</p>
              <Link to="/admin/users" className="text-xs text-blue-500 hover:underline">View all →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {stats.recentUsers.map((u: any) => (
                <div key={u._id} className="flex items-center gap-4 px-6 py-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {u.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === "ADMIN" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}