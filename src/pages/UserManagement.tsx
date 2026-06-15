import { useState, useEffect } from "react";
import axios from "axios";
import { AdminLayout } from "./AdminDashboard";

const API = "http://localhost:5000/api/admin";
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

interface User { _id: string; name: string; email: string; role: "USER" | "ADMIN"; createdAt: string; }

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "USER" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    axios.get(`${API}/users`, authHeader()).then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openEdit = (u: User) => { setEditUser(u); setEditForm({ name: u.name, role: u.role }); setError(""); };
  const closeEdit = () => { setEditUser(null); setError(""); };

  const handleUpdate = async () => {
    if (!editUser) return;
    setSaving(true); setError("");
    try {
      await axios.patch(`${API}/users/${editUser._id}`, editForm, authHeader());
      fetchUsers(); closeEdit();
    } catch (e: any) {
      setError(e.response?.data?.message || "Update failed.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await axios.delete(`${API}/users/${deleteId}`, authHeader()); fetchUsers(); } catch (e: any) { alert(e.response?.data?.message || "Delete failed"); }
    setDeleteId(null);
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-slate-800">User Management</h1>
            <p className="text-slate-500 text-sm mt-0.5">View, edit roles, and remove users</p>
          </div>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users…"
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white text-slate-700 w-60"
          />
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-sm">Loading users…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">No users found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["User", "Email", "Role", "Joined", "Actions"].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {u.name[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800 truncate max-w-[120px]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-[160px]">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === "ADMIN" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(u)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition">Edit</button>
                        <button onClick={() => setDeleteId(u._id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-medium transition">Delete</button>
                      </div>
                    </td>
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
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                  <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Role</label>
                  <select value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={closeEdit} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handleUpdate} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50">
                  {saving ? "Saving…" : "Update User"}
                </button>
              </div>
            </div>
          </div>
        )}
        {deleteId && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h2 className="text-lg font-black text-slate-800 mb-2">Delete User?</h2>
              <p className="text-slate-500 text-sm mb-6">This will permanently remove the user and cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}