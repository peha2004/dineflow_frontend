import { useState, useEffect } from "react";
import axios from "axios";
import { AdminLayout } from "./AdminDashboard";

const API = "http://localhost:5000/api/tables";
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

interface Table { _id: string; tableNumber: number; capacity: number; status: "AVAILABLE" | "BOOKED"; }
const EMPTY = { tableNumber: "", capacity: "", status: "AVAILABLE" };

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchTables = () => {
    setLoading(true);
    axios.get(API).then(r => setTables(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTables(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setError(""); setShowModal(true); };
  const openEdit = (t: Table) => { setForm({ tableNumber: t.tableNumber, capacity: t.capacity, status: t.status }); setEditId(t._id); setError(""); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(""); };

  const handleSave = async () => {
    if (!form.tableNumber || !form.capacity) { setError("Table number and capacity are required."); return; }
    setSaving(true); setError("");
    try {
      const payload = { tableNumber: Number(form.tableNumber), capacity: Number(form.capacity), status: form.status };
      if (editId) await axios.put(`${API}/${editId}`, payload, authHeader());
      else await axios.post(API, payload, authHeader());
      fetchTables(); closeModal();
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to save table.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await axios.delete(`${API}/${deleteId}`, authHeader()); fetchTables(); } catch (e: any) { alert(e.response?.data?.message || "Delete failed"); }
    setDeleteId(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Table Management</h1>
            <p className="text-slate-500 text-sm mt-0.5">Add, edit or remove restaurant tables</p>
          </div>
          <button onClick={openAdd} className="px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-200">
            + Add Table
          </button>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-sm">Loading tables…</div>
          ) : tables.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">No tables found. Add your first table!</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Table #", "Capacity", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tables.map(t => (
                  <tr key={t._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">T{String(t.tableNumber).padStart(2, "0")}</td>
                    <td className="px-6 py-4 text-slate-600">{t.capacity} seats</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.status === "AVAILABLE" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-500 border border-red-100"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(t)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition">Edit</button>
                        <button onClick={() => setDeleteId(t._id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-medium transition">Delete</button>
                      </div>
                    </td>
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
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Table Number</label>
                  <input type="number" value={form.tableNumber} onChange={e => setForm((p: any) => ({ ...p, tableNumber: e.target.value }))}
                    placeholder="e.g. 5" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Capacity (seats)</label>
                  <input type="number" value={form.capacity} onChange={e => setForm((p: any) => ({ ...p, capacity: e.target.value }))}
                    placeholder="e.g. 4" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm((p: any) => ({ ...p, status: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition bg-slate-50">
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="BOOKED">BOOKED</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50">
                  {saving ? "Saving…" : editId ? "Update" : "Add Table"}
                </button>
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
    </AdminLayout>
  );
}