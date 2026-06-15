import { useState, useEffect } from "react";
import axios from "axios";
import { AdminLayout } from "./AdminDashboard";

const API = "http://localhost:5000/api/menu";
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const CATEGORIES = ["FOOD", "BEVERAGE", "DESSERT"];
const FUNCTION_TYPES = ["BIRTHDAY", "PARTY", "NORMAL_DINING", "ANNIVERSARY", "CORPORATE"];
const CATEGORY_COLORS: Record<string, string> = {
  FOOD: "bg-orange-50 text-orange-600 border-orange-100",
  BEVERAGE: "bg-blue-50 text-blue-600 border-blue-100",
  DESSERT: "bg-pink-50 text-pink-600 border-pink-100",
};

const EMPTY_FORM = { name: "", description: "", price: "", category: "FOOD", availableFor: [] as string[], image: "", isActive: true };

interface MenuItem { _id: string; name: string; description: string; price: number; category: string; availableFor: string[]; isActive: boolean; image?: string; }

export default function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchItems = () => {
    setLoading(true);
    axios.get(`${API}/admin/all`, authHeader()).then(r => setItems(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setError(""); setShowModal(true); };
  const openEdit = (item: MenuItem) => {
    setForm({ name: item.name, description: item.description || "", price: String(item.price), category: item.category, availableFor: item.availableFor || [], image: item.image || "", isActive: item.isActive });
    setEditId(item._id); setError(""); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setError(""); };

  const toggleAvailableFor = (ft: string) => {
    setForm((p: any) => ({
      ...p,
      availableFor: p.availableFor.includes(ft) ? p.availableFor.filter((x: string) => x !== ft) : [...p.availableFor, ft]
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) { setError("Name, price, and category are required."); return; }
    if (Number(form.price) < 0) { setError("Price cannot be negative."); return; }
    setSaving(true); setError("");
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editId) await axios.put(`${API}/${editId}`, payload, authHeader());
      else await axios.post(API, payload, authHeader());
      fetchItems(); closeModal();
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to save item.");
    } finally { setSaving(false); }
  };

  const handleToggle = async (id: string) => {
    try { await axios.patch(`${API}/${id}/toggle`, {}, authHeader()); fetchItems(); } catch (e: any) { alert("Toggle failed"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await axios.delete(`${API}/${deleteId}/permanent`, authHeader()); fetchItems(); } catch (e: any) { alert("Delete failed"); }
    setDeleteId(null);
  };

  const filtered = items.filter(i =>
    (filterCat === "ALL" || i.category === filterCat) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
       
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Menu Management</h1>
            <p className="text-slate-500 text-sm mt-0.5">Create and manage food, beverages, and desserts</p>
          </div>
          <button onClick={openAdd} className="px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-200">
            + Add Item
          </button>
        </div>

        <div className="flex gap-3 mb-5 flex-wrap items-center">
          <div className="flex gap-2">
            {["ALL", ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${filterCat === c ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-blue-300"}`}>
                {c}
              </button>
            ))}
          </div>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…"
            className="ml-auto border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white text-slate-700 w-52" />
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Loading menu…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">No items found.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(item => (
              <div key={item._id} className={`bg-white border rounded-2xl p-5 shadow-sm transition ${item.isActive ? "border-slate-100" : "border-slate-200 opacity-60"}`}>
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.description || "No description"}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border flex-shrink-0 ${CATEGORY_COLORS[item.category] || "bg-slate-50 text-slate-500"}`}>
                    {item.category}
                  </span>
                </div>

                <p className="text-lg font-black text-blue-600 mb-3">Rs. {item.price.toLocaleString()}</p>

                {item.availableFor?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.availableFor.map(f => (
                      <span key={f} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{f}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-slate-50">
                  <button onClick={() => handleToggle(item._id)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${item.isActive ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                    {item.isActive ? "Deactivate" : "Activate"}
                  </button>
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
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Name *</label>
                  <input value={form.name} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} placeholder="e.g. Grilled Chicken"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} rows={2} placeholder="Short description…"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Price (Rs.) *</label>
                    <input type="number" value={form.price} onChange={e => setForm((p: any) => ({ ...p, price: e.target.value }))} placeholder="500"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Category *</label>
                    <select value={form.category} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">Available For (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {FUNCTION_TYPES.map(ft => (
                      <button key={ft} type="button" onClick={() => toggleAvailableFor(ft)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition ${form.availableFor.includes(ft) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}>
                        {ft}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Image URL (optional)</label>
                  <input value={form.image} onChange={e => setForm((p: any) => ({ ...p, image: e.target.value }))} placeholder="https://…"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 bg-slate-50 transition" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50">
                  {saving ? "Saving…" : editId ? "Update Item" : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h2 className="text-lg font-black text-slate-800 mb-2">Permanently Delete Item?</h2>
              <p className="text-slate-500 text-sm mb-6">This cannot be undone. Use Deactivate to hide it instead.</p>
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