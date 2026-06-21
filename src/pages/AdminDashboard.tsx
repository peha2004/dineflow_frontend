import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const API = `http://${window.location.hostname}:5000/api`;
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });


interface Table { _id: string; tableNumber: number; capacity: number; status: "AVAILABLE" | "BOOKED"; }
interface MenuItem { _id: string; name: string; description: string; price: number; category: string; availableFor: string[]; isActive: boolean; image?: string; }
interface User { _id: string; name: string; email: string; role: "USER" | "ADMIN"; createdAt: string; }
interface Reservation {
  _id: string; reservationCode: string; functionType: string; date: string;
  startTime: string; endTime: string; durationHours: number; memberCount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  totalAmount: number; tableCharge: number; itemsTotal: number;
  specialRequests?: string; createdAt: string;
  table: { tableNumber: number; capacity: number };
  user: { name: string; email: string };
  selectedItems: { name: string; price: number; quantity: number }[];
}

const CATEGORIES = ["FOOD", "BEVERAGE", "DESSERT"];
const FUNCTION_TYPES = ["BIRTHDAY", "PARTY", "NORMAL_DINING", "ANNIVERSARY", "CORPORATE"];
const FUNCTION_ICONS: Record<string, string> = {
  BIRTHDAY: "🎂", PARTY: "🎉", NORMAL_DINING: "🍽️", ANNIVERSARY: "💍", CORPORATE: "💼",
};
const CAT_COLORS: Record<string, string> = {
  FOOD: "bg-orange-50 text-orange-600 border-orange-100",
  BEVERAGE: "bg-blue-50 text-blue-600 border-blue-100",
  DESSERT: "bg-pink-50 text-pink-600 border-pink-100",
};
const STATUS_STYLES: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-600 border-amber-200",
  CONFIRMED: "bg-green-50 text-green-600 border-green-200",
  CANCELLED: "bg-red-50 text-red-500 border-red-200",
  COMPLETED: "bg-blue-50 text-blue-600 border-blue-200",
};

const navItems = [
  { tab: "dashboard",    icon: "📊", label: "Dashboard" },
  { tab: "tables",       icon: "🍽️", label: "Tables" },
  { tab: "menu",         icon: "🍔", label: "Menu" },
  { tab: "users",        icon: "👥", label: "Users" },
  { tab: "reservations", icon: "📅", label: "Reservations" },
];

export function AdminLayout({ children, activeTab, onTabChange }: {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (t: string) => void;
}) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          {navItems.map(({ tab, icon, label }) => (
            <button key={tab} onClick={() => { onTabChange(tab); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeTab === tab ? "bg-blue-600 text-white shadow-md shadow-blue-900/40" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
              <span className="text-base">{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-5 border-t border-slate-700">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-800">☰</button>
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

function DashboardTab({ onTabChange }: { onTabChange: (t: string) => void }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/admin/users/stats`, authHeader())
      .then(r => setStats(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: "Total Users",   value: stats.total,        icon: "👥", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Regular Users", value: stats.regularUsers, icon: "👤", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { label: "Admins",        value: stats.admins,        icon: "🛡️", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
    { label: "Active Users",  value: stats.activeUsers,  icon: "✅", color: "bg-green-50 text-green-600 border-green-100" },
  ] : [];

  const quickLinks = [
    { tab: "tables",       icon: "🍽️", label: "Manage Tables",  desc: "Add, edit or remove tables" },
    { tab: "menu",         icon: "🍔", label: "Manage Menu",    desc: "Create and update menu items" },
    { tab: "users",        icon: "👥", label: "Manage Users",   desc: "View and manage user accounts" },
    { tab: "reservations", icon: "📅", label: "Reservations",   desc: "View all customer bookings" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">Welcome back, Admin 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening with DineFlow today.</p>
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse h-24" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon, color }) => (
            <div key={label} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4 ${color.split(" ")[2]}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color.split(" ").slice(0, 2).join(" ")}`}>{icon}</div>
              <div><p className="text-2xl font-black text-slate-800">{value}</p><p className="text-xs text-slate-500">{label}</p></div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4">Quick Actions</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map(({ tab, icon, label, desc }) => (
          <button key={tab} onClick={() => onTabChange(tab)}
            className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition duration-200 text-left">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition">{icon}</div>
            <p className="font-bold text-slate-800 text-sm">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
          </button>
        ))}
      </div>
      {stats?.recentUsers?.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <p className="font-bold text-slate-800 text-sm">Recent Registrations</p>
            <button onClick={() => onTabChange("users")} className="text-xs text-blue-500 hover:underline">View all →</button>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recentUsers.map((u: any) => (
              <div key={u._id} className="flex items-center gap-4 px-6 py-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">{u.name[0].toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{u.name}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === "ADMIN" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TablesTab() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({ tableNumber: "", capacity: "", status: "AVAILABLE" });
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = () => { setLoading(true); axios.get(`${API}/tables`).then(r => setTables(r.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm({ tableNumber: "", capacity: "", status: "AVAILABLE" }); setEditId(null); setError(""); setShowModal(true); };
  const openEdit = (t: Table) => { setForm({ tableNumber: t.tableNumber, capacity: t.capacity, status: t.status }); setEditId(t._id); setError(""); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(""); };

  const handleSave = async () => {
    if (!form.tableNumber || !form.capacity) { setError("Table number and capacity are required."); return; }
    setSaving(true); setError("");
    try {
      const payload = { tableNumber: Number(form.tableNumber), capacity: Number(form.capacity), status: form.status };
      if (editId) await axios.put(`${API}/tables/${editId}`, payload, authHeader());
      else await axios.post(`${API}/tables`, payload, authHeader());
      fetch(); closeModal();
    } catch (e: any) { setError(e.response?.data?.message || "Failed to save."); } finally { setSaving(false); }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try { await axios.delete(`${API}/tables/${deleteId}`, authHeader()); fetch(); } catch { alert("Delete failed"); }
    setDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-slate-800">Table Management</h1><p className="text-slate-500 text-sm mt-0.5">Add, edit or remove restaurant tables</p></div>
        <button onClick={openAdd} className="px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-200">+ Add Table</button>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-10 text-center text-slate-400 text-sm">Loading tables…</div>
        : tables.length === 0 ? <div className="p-10 text-center text-slate-400 text-sm">No tables yet.</div> : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Table #","Capacity","Status","Actions"].map(h => <th key={h} className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tables.map(t => (
                <tr key={t._id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">T{String(t.tableNumber).padStart(2,"0")}</td>
                  <td className="px-6 py-4 text-slate-600">{t.capacity} seats</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${t.status === "AVAILABLE" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-500 border-red-100"}`}>{t.status}</span></td>
                  <td className="px-6 py-4"><div className="flex gap-2">
                    <button onClick={() => openEdit(t)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition">Edit</button>
                    <button onClick={() => setDeleteId(t._id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-medium transition">Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-black text-slate-800 mb-5">{editId ? "Edit Table" : "Add Table"}</h2>
            {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">{error}</div>}
            <div className="space-y-4">
              {[["Table Number","tableNumber","e.g. 5"],["Capacity (seats)","capacity","e.g. 4"]].map(([label,key,ph]) => (
                <div key={key}><label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
                <input type="number" value={form[key]} onChange={e => setForm((p:any) => ({...p,[key]:e.target.value}))} placeholder={ph}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition"/></div>
              ))}
              <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm((p:any) => ({...p,status:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition">
                <option value="AVAILABLE">AVAILABLE</option><option value="BOOKED">BOOKED</option>
              </select></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50">{saving ? "Saving…" : editId ? "Update" : "Add Table"}</button>
            </div>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h2 className="text-lg font-black text-slate-800 mb-2">Delete Table?</h2>
            <p className="text-slate-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({ name:"", description:"", price:"", category:"FOOD", availableFor:[] as string[], image:"", isActive:true });
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetch = () => { setLoading(true); axios.get(`${API}/menu/admin/all`, authHeader()).then(r => setItems(r.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm({ name:"", description:"", price:"", category:"FOOD", availableFor:[], image:"", isActive:true }); setEditId(null); setError(""); setShowModal(true); };
  const openEdit = (item: MenuItem) => { setForm({ name:item.name, description:item.description||"", price:String(item.price), category:item.category, availableFor:item.availableFor||[], image:item.image||"", isActive:item.isActive }); setEditId(item._id); setError(""); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(""); };
  const toggleFT = (ft: string) => setForm((p:any) => ({ ...p, availableFor: p.availableFor.includes(ft) ? p.availableFor.filter((x:string) => x!==ft) : [...p.availableFor,ft] }));

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) { setError("Name, price, and category are required."); return; }
    setSaving(true); setError("");
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editId) await axios.put(`${API}/menu/${editId}`, payload, authHeader());
      else await axios.post(`${API}/menu`, payload, authHeader());
      fetch(); closeModal();
    } catch (e: any) { setError(e.response?.data?.message || "Failed to save."); } finally { setSaving(false); }
  };
  const handleToggle = async (id: string) => { try { await axios.patch(`${API}/menu/${id}/toggle`, {}, authHeader()); fetch(); } catch { alert("Toggle failed"); } };
  const handleDelete = async () => {
    if (!deleteId) return;
    try { await axios.delete(`${API}/menu/${deleteId}/permanent`, authHeader()); fetch(); } catch { alert("Delete failed"); }
    setDeleteId(null);
  };

  const filtered = items.filter(i => (filterCat === "ALL" || i.category === filterCat) && i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div><h1 className="text-2xl font-black text-slate-800">Menu Management</h1><p className="text-slate-500 text-sm mt-0.5">Create and manage food, beverages, and desserts</p></div>
        <button onClick={openAdd} className="px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-200">+ Add Item</button>
      </div>
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <div className="flex gap-2">{["ALL",...CATEGORIES].map(c => <button key={c} onClick={() => setFilterCat(c)} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${filterCat===c ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-blue-300"}`}>{c}</button>)}</div>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…" className="ml-auto border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white text-slate-700 w-52"/>
      </div>
      {loading ? <div className="p-10 text-center text-slate-400 text-sm">Loading menu…</div>
      : filtered.length === 0 ? <div className="p-10 text-center text-slate-400 text-sm">No items found.</div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item._id} className={`bg-white border rounded-2xl p-5 shadow-sm transition ${item.isActive ? "border-slate-100" : "border-slate-200 opacity-60"}`}>
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex-1 min-w-0"><p className="font-bold text-slate-800 truncate">{item.name}</p><p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.description || "No description"}</p></div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border flex-shrink-0 ${CAT_COLORS[item.category] || "bg-slate-50 text-slate-500"}`}>{item.category}</span>
              </div>
              <p className="text-lg font-black text-blue-600 mb-3">Rs. {item.price.toLocaleString()}</p>
              {item.availableFor?.length > 0 && <div className="flex flex-wrap gap-1 mb-3">{item.availableFor.map(f => <span key={f} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{f}</span>)}</div>}
              <div className="flex gap-2 pt-3 border-t border-slate-50">
                <button onClick={() => handleToggle(item._id)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${item.isActive ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>{item.isActive ? "Deactivate" : "Activate"}</button>
                <button onClick={() => openEdit(item)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition">Edit</button>
                <button onClick={() => setDeleteId(item._id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-medium transition ml-auto">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 my-4">
            <h2 className="text-lg font-black text-slate-800 mb-5">{editId ? "Edit Menu Item" : "Add Menu Item"}</h2>
            {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">{error}</div>}
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Name *</label><input value={form.name} onChange={e => setForm((p:any) => ({...p,name:e.target.value}))} placeholder="e.g. Grilled Chicken" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition"/></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm((p:any) => ({...p,description:e.target.value}))} rows={2} placeholder="Short description…" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition resize-none"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Price (Rs.) *</label><input type="number" value={form.price} onChange={e => setForm((p:any) => ({...p,price:e.target.value}))} placeholder="500" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition"/></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Category *</label><select value={form.category} onChange={e => setForm((p:any) => ({...p,category:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-500 mb-2">Available For</label><div className="flex flex-wrap gap-2">{FUNCTION_TYPES.map(ft => <button key={ft} type="button" onClick={() => toggleFT(ft)} className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition ${form.availableFor.includes(ft) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}>{ft}</button>)}</div></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Image URL (optional)</label><input value={form.image} onChange={e => setForm((p:any) => ({...p,image:e.target.value}))} placeholder="https://…" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition"/></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50">{saving ? "Saving…" : editId ? "Update Item" : "Add Item"}</button>
            </div>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h2 className="text-lg font-black text-slate-800 mb-2">Permanently Delete?</h2>
            <p className="text-slate-500 text-sm mb-6">Use Deactivate to hide it instead.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "USER" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetch = () => { setLoading(true); axios.get(`${API}/admin/users`, authHeader()).then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const openEdit = (u: User) => { setEditUser(u); setEditForm({ name: u.name, role: u.role }); setError(""); };
  const closeEdit = () => { setEditUser(null); setError(""); };

  const handleUpdate = async () => {
    if (!editUser) return;
    setSaving(true); setError("");
    try { await axios.patch(`${API}/admin/users/${editUser._id}`, editForm, authHeader()); fetch(); closeEdit(); }
    catch (e: any) { setError(e.response?.data?.message || "Update failed."); } finally { setSaving(false); }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try { await axios.delete(`${API}/admin/users/${deleteId}`, authHeader()); fetch(); } catch { alert("Delete failed"); }
    setDeleteId(null);
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div><h1 className="text-2xl font-black text-slate-800">User Management</h1><p className="text-slate-500 text-sm mt-0.5">View, edit roles, and remove users</p></div>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white text-slate-700 w-60"/>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-10 text-center text-slate-400 text-sm">Loading users…</div>
        : filtered.length === 0 ? <div className="p-10 text-center text-slate-400 text-sm">No users found.</div> : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["User","Email","Role","Joined","Actions"].map(h => <th key={h} className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(u => (
                <tr key={u._id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">{u.name[0].toUpperCase()}</div><span className="font-medium text-slate-800 truncate max-w-[120px]">{u.name}</span></div></td>
                  <td className="px-6 py-4 text-slate-500 truncate max-w-[160px]">{u.email}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === "ADMIN" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>{u.role}</span></td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4"><div className="flex gap-2">
                    <button onClick={() => openEdit(u)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition">Edit</button>
                    <button onClick={() => setDeleteId(u._id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-medium transition">Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-black text-slate-800 mb-5">Edit User</h2>
            {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">{error}</div>}
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label><input value={editForm.name} onChange={e => setEditForm(p => ({...p,name:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition"/></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Role</label><select value={editForm.role} onChange={e => setEditForm(p => ({...p,role:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition"><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeEdit} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleUpdate} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50">{saving ? "Saving…" : "Update User"}</button>
            </div>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-lg font-black text-slate-800 mb-2">Delete User?</h2>
            <p className="text-slate-500 text-sm mb-6">This permanently removes the user.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReservationsTab() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Reservation | null>(null);

  useEffect(() => {
    axios.get(`${API}/reservations`, authHeader())
      .then(r => setReservations(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const counts = {
    ALL: reservations.length,
    CONFIRMED: reservations.filter(r => r.status === "CONFIRMED").length,
    PENDING:   reservations.filter(r => r.status === "PENDING").length,
    COMPLETED: reservations.filter(r => r.status === "COMPLETED").length,
    CANCELLED: reservations.filter(r => r.status === "CANCELLED").length,
  };

  const filtered = reservations.filter(r => {
    const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
    const matchSearch =
      r.reservationCode.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.functionType.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800">Reservation History</h1>
        <p className="text-slate-500 text-sm mt-1">View all customer bookings and their details</p>
      </div>

    
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label:"Total",     value:counts.ALL,       color:"bg-slate-50 text-slate-600 border-slate-200" },
          { label:"Confirmed", value:counts.CONFIRMED, color:"bg-green-50 text-green-600 border-green-200" },
          { label:"Completed", value:counts.COMPLETED, color:"bg-blue-50 text-blue-600 border-blue-200" },
          { label:"Cancelled", value:counts.CANCELLED, color:"bg-red-50 text-red-500 border-red-200" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl border p-4 shadow-sm ${color}`}>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs font-semibold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

     
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="flex gap-2 flex-wrap">
          {["ALL","CONFIRMED","PENDING","COMPLETED","CANCELLED"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${filterStatus===s ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-blue-300"}`}>
              {s} <span className="ml-1 opacity-60">{counts[s as keyof typeof counts]}</span>
            </button>
          ))}
        </div>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, code…"
          className="ml-auto border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white text-slate-700 w-64"/>
      </div>

   
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-10 text-center text-slate-400 text-sm">Loading reservations…</div>
        : filtered.length === 0 ? (
          <div className="p-10 text-center"><div className="text-4xl mb-3">📋</div><p className="text-slate-500 text-sm">No reservations found.</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Code","Customer","Function","Date & Time","Table","Total","Status",""].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(r => (
                <tr key={r._id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3"><p className="font-mono text-xs text-slate-600">{r.reservationCode}</p><p className="text-xs text-slate-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">{r.user?.name?.[0]?.toUpperCase() ?? "?"}</div>
                      <div className="min-w-0"><p className="font-medium text-slate-700 truncate max-w-[110px]">{r.user?.name}</p><p className="text-xs text-slate-400 truncate max-w-[110px]">{r.user?.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-base mr-1">{FUNCTION_ICONS[r.functionType] ?? "📅"}</span><span className="text-slate-600 text-xs">{r.functionType.replace("_"," ")}</span></td>
                  <td className="px-4 py-3"><p className="text-slate-700 text-xs font-medium">{new Date(r.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p><p className="text-slate-400 text-xs">{r.startTime} – {r.endTime}</p></td>
                  <td className="px-4 py-3"><p className="text-slate-700 text-xs font-bold">T{String(r.table?.tableNumber).padStart(2,"0")}</p><p className="text-slate-400 text-xs">{r.memberCount} guests</p></td>
                  <td className="px-4 py-3 font-bold text-slate-800 text-xs">Rs. {r.totalAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${STATUS_STYLES[r.status]}`}>{r.status}</span></td>
                  <td className="px-4 py-3"><button onClick={() => setSelected(r)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

  
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{FUNCTION_ICONS[selected.functionType] ?? "📅"}</span>
                <div><p className="font-black text-slate-800">{selected.functionType.replace("_"," ")}</p><p className="text-xs text-slate-400 font-mono">{selected.reservationCode}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
              </div>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black">{selected.user?.name?.[0]?.toUpperCase() ?? "?"}</div>
                  <div><p className="font-bold text-slate-800">{selected.user?.name}</p><p className="text-sm text-slate-500">{selected.user?.email}</p></div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Booking Details</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["📅 Date", new Date(selected.date).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})],
                    ["⏰ Time", `${selected.startTime} – ${selected.endTime}`],
                    ["⏱ Duration", `${selected.durationHours} hour${selected.durationHours > 1 ? "s" : ""}`],
                    ["👥 Guests", `${selected.memberCount} people`],
                    ["🍽️ Table", `T${String(selected.table?.tableNumber).padStart(2,"0")} (${selected.table?.capacity} seats)`],
                    ["📆 Booked on", new Date(selected.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})],
                  ].map(([l,v]) => (
                    <div key={l} className="bg-slate-50 rounded-xl px-3 py-2">
                      <p className="text-xs text-slate-400">{l}</p>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            
              {selected.specialRequests && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">⚠️ Special Requests</p>
                  <p className="text-sm text-amber-800 italic">{selected.specialRequests}</p>
                </div>
              )}
        
              {selected.selectedItems?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Food & Drinks</p>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    {selected.selectedItems.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-600">{item.name} <span className="text-slate-400">× {item.quantity}</span></span>
                        <span className="font-semibold text-slate-700">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Summary</p>
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600"><span>Table charge ({selected.durationHours}h × Rs. 5,000)</span><span className="font-semibold">Rs. {selected.tableCharge?.toLocaleString()}</span></div>
                  {selected.itemsTotal > 0 && <div className="flex justify-between text-slate-600"><span>Food & Drinks</span><span className="font-semibold">Rs. {selected.itemsTotal?.toLocaleString()}</span></div>}
                  <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-black text-slate-800 text-base"><span>Total</span><span className="text-blue-600">Rs. {selected.totalAmount?.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-5">
              <button onClick={() => setSelected(null)} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard"    && <DashboardTab onTabChange={setActiveTab} />}
      {activeTab === "tables"       && <TablesTab />}
      {activeTab === "menu"         && <MenuTab />}
      {activeTab === "users"        && <UsersTab />}
      {activeTab === "reservations" && <ReservationsTab />}
    </AdminLayout>
  );
}