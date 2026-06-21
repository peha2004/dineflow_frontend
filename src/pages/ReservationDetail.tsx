import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const API = `http://${window.location.hostname}:5000/api`;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const FUNCTION_ICONS: Record<string, string> = {
  BIRTHDAY: "🎂", PARTY: "🎉", NORMAL_DINING: "🍽️", ANNIVERSARY: "💍", CORPORATE: "💼",
};
const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
  CONFIRMED: "bg-green-50 text-green-600 border-green-100",
  CANCELLED: "bg-red-50 text-red-500 border-red-100",
  COMPLETED: "bg-blue-50 text-blue-600 border-blue-100",
};

export default function ReservationDetail() {
  const { id, code } = useParams<{ id?: string; code?: string }>();
  const location = useLocation();

  const stateData = location.state as { reservation?: any; qrCode?: string } | null;

  const [reservation, setReservation] = useState<any>(stateData?.reservation ?? null);
  const [qrCode, setQrCode] = useState<string>(stateData?.qrCode ?? "");
  const [loading, setLoading] = useState(!stateData?.reservation);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (stateData?.reservation) return;

    const isCodeRoute = !!code;
    const url = isCodeRoute
      ? `${API}/reservations/code/${code}`
      : `${API}/reservations/${id}`;
    const config = isCodeRoute ? {} : authHeader();

    axios
      .get(url, config)
      .then((r) => {
        setReservation(r.data);
        setQrCode(r.data.qrCode ?? "");
      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data ?? err.message);
        setFetchError("Could not load this reservation.");
      })
      .finally(() => setLoading(false));
  }, [id, code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">🍽️</div>
          <p className="text-gray-400 text-sm">Loading reservation…</p>
        </div>
      </div>
    );
  }

  if (fetchError || !reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-5xl mb-2">❌</div>
        <p className="text-gray-700 font-bold text-lg">Reservation not found</p>
        <p className="text-gray-400 text-sm max-w-xs">
          {fetchError || "This reservation code may be invalid or the booking was cancelled."}
        </p>
        <Link to="/reservations/my" className="mt-2 text-purple-600 text-sm hover:underline font-medium">
          ← Back to My Reservations
        </Link>
      </div>
    );
  }

  const r = reservation;
  const table = r.table;
  const isJustBooked = !!stateData?.reservation;
  const isQRView = !!code;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50">

      <nav className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          {!isQRView && (
            <Link to="/reservations/my" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
              ← My Reservations
            </Link>
          )}
          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">DineFlow</span>
          </div>
          {isQRView && (
            <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-semibold">📱 QR Check-in</span>
          )}
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {isJustBooked && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="text-4xl">🎉</div>
            <div>
              <p className="font-black text-green-700">Booking Confirmed!</p>
              <p className="text-sm text-green-600 mt-0.5">
                Your table is reserved. Show the QR code at the restaurant for check-in.
              </p>
            </div>
          </div>
        )}

        {isQRView && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="text-4xl">🏪</div>
            <div>
              <p className="font-black text-blue-700">Restaurant Check-in View</p>
              <p className="text-sm text-blue-600 mt-0.5">Verify the booking details below before seating guests.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{FUNCTION_ICONS[r.functionType] ?? "📅"}</span>
            <div>
              <h1 className="text-2xl font-black text-gray-900">{r.functionType?.replace("_", " ")}</h1>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{r.reservationCode}</p>
            </div>
          </div>
          <span className={`text-sm px-3 py-1.5 rounded-full font-bold border ${STATUS_STYLES[r.status]}`}>
            {r.status}
          </span>
        </div>
        {qrCode && !isQRView && (
          <div className="bg-white border border-purple-100 rounded-3xl p-6 text-center shadow-md shadow-purple-100">
            <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4">Your Check-in QR Code</p>
            <div className="inline-block p-3 bg-white border-2 border-purple-100 rounded-2xl shadow-inner mb-4">
              <img src={qrCode} alt="Reservation QR Code" className="w-52 h-52 object-contain" />
            </div>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Show this at the restaurant reception for quick check-in.
            </p>
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = qrCode;
                a.download = `${r.reservationCode}-qr.png`;
                a.click();
              }}
              className="mt-4 inline-block text-sm px-5 py-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 font-medium transition"
            >
              ⬇ Download QR
            </button>
          </div>
        )}

        <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm space-y-4">
          <p className="text-xs font-bold text-purple-500 uppercase tracking-widest">Booking Details</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ["📅 Date", new Date(r.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })],
              ["⏰ Time", `${r.startTime} – ${r.endTime}`],
              ["⏱ Duration", `${r.durationHours} hour${r.durationHours > 1 ? "s" : ""}`],
              ["👥 Members", `${r.memberCount} people`],
              ["🍽️ Table", table ? `T${String(table.tableNumber).padStart(2, "0")} (${table.capacity} seats)` : "—"],
              ["🎭 Function", r.functionType?.replace("_", " ")],
            ].map(([label, value]) => (
              <div key={label} className="bg-purple-50/50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          {r.specialRequests && (
            <div className="bg-purple-50/50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400">📝 Special Requests</p>
              <p className="text-sm text-gray-600 mt-0.5 italic">{r.specialRequests}</p>
            </div>
          )}
        </div>

        {r.selectedItems?.length > 0 && (
          <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4">Food & Drinks</p>
            <div className="space-y-2">
              {r.selectedItems.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                  <span className="font-semibold text-gray-700">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4">Payment Summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Table charge ({r.durationHours}h × Rs. 5,000)</span>
              <span className="font-semibold">Rs. {r.tableCharge?.toLocaleString()}</span>
            </div>
            {r.itemsTotal > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Food & Drinks</span>
                <span className="font-semibold">Rs. {r.itemsTotal?.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t-2 border-purple-100 pt-3 mt-2 flex justify-between font-black text-gray-900 text-base">
              <span>Total Amount</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Rs. {r.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        
        {!isQRView && (
          <div className="flex gap-3">
            <Link to="/reservations/my" className="flex-1 text-center py-3 rounded-2xl border border-purple-200 text-purple-600 font-bold text-sm hover:bg-purple-50 transition">
              ← All Reservations
            </Link>
            <Link to="/reservations/create" className="flex-1 text-center py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition shadow-md shadow-purple-200">
              + New Booking
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}