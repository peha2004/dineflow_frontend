import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReservationCard from "../components/ReservationCard";

const API = "http://localhost:5000/api";
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

interface Reservation {
  _id: string;
  reservationCode: string;
  functionType: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  memberCount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  totalAmount: number;
  tableCharge: number;
  itemsTotal: number;
  table: { tableNumber: number; capacity: number };
  selectedItems: { name: string; price: number; quantity: number }[];
}

export default function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchReservations = () => {
    setLoading(true);
    axios.get(`${API}/reservations/my`, authHeader())
      .then(r => setReservations(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await axios.delete(`${API}/reservations/${cancelId}`, authHeader());
      fetchReservations();
    } catch (e: any) {
      alert(e.response?.data?.message || "Cancel failed");
    } finally {
      setCancelling(false);
      setCancelId(null);
    }
  };

  const filtered = reservations.filter(r =>
    filterStatus === "ALL" || r.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50">
      {/* Nav */}
      <nav className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/user" className="text-purple-600 hover:text-purple-800 text-sm font-medium">← Dashboard</Link>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">DineFlow</span>
          </div>
          <div className="ml-auto">
            <Link to="/reservations/create"
              className="text-sm px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition shadow-md shadow-purple-200">
              + New Booking
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">My Reservations</h1>
          <p className="text-gray-400 text-sm mt-1">View and manage all your table bookings</p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${filterStatus === s ? "bg-purple-600 text-white" : "bg-white border border-purple-100 text-gray-500 hover:border-purple-300"}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-purple-100 h-32 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-purple-100 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-bold text-gray-700 mb-1">No reservations found</p>
            <p className="text-sm text-gray-400 mb-5">
              {filterStatus === "ALL" ? "You haven't made any bookings yet." : `No ${filterStatus.toLowerCase()} reservations.`}
            </p>
            <Link to="/reservations/create"
              className="inline-block px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold rounded-xl hover:opacity-90 transition shadow-md shadow-purple-200">
              Book a Table
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
  <ReservationCard
    key={r._id}
    reservation={r}
    onCancel={setCancelId}
  />
))}
          </div>
        )}
      </div>

      {cancelId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-lg font-black text-gray-800 mb-2">Cancel Reservation?</h2>
            <p className="text-gray-500 text-sm mb-6">This will free the table and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Keep It</button>
              <button onClick={handleCancel} disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition disabled:opacity-50">
                {cancelling ? "Cancelling…" : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}