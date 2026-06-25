import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API =  import.meta.env.VITE_API_URL;
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const FUNCTION_TYPES = ["BIRTHDAY", "PARTY", "NORMAL_DINING", "ANNIVERSARY", "CORPORATE"];
const FUNCTION_ICONS: Record<string, string> = {
  BIRTHDAY: "🎂", PARTY: "🎉", NORMAL_DINING: "🍽️", ANNIVERSARY: "💍", CORPORATE: "💼",
};
const HOURLY_RATE = 5000;

interface Table { _id: string; tableNumber: number; capacity: number; status: string; }
interface MenuItem { _id: string; name: string; description: string; price: number; category: string; availableFor: string[]; image?: string; }
interface CartItem extends MenuItem { quantity: number; }

const STEPS = ["Details", "Table", "Menu", "Review"];

export default function CreateReservation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [functionType, setFunctionType] = useState("");
  const [memberCount, setMemberCount] = useState(1);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tablesLoading, setTablesLoading] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuFilter, setMenuFilter] = useState("ALL");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const calcDuration = () => {
    if (!startTime || !endTime) return 0;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return Math.max(1, Math.ceil(diff / 60));
  };
  const duration = calcDuration();
  const tableCharge = duration * HOURLY_RATE;
  const itemsTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalAmount = tableCharge + itemsTotal;

  useEffect(() => {
    if (step !== 1) return;
    setTablesLoading(true);
    axios.get(`${API}/tables`).then(r => setTables(r.data)).catch(console.error).finally(() => setTablesLoading(false));
  }, [step]);

  useEffect(() => {
    if (step !== 2) return;
    setMenuLoading(true);
    const params = functionType ? `?functionType=${functionType}` : "";
    axios.get(`${API}/menu${params}`).then(r => setMenuItems(r.data)).catch(console.error).finally(() => setMenuLoading(false));
  }, [step, functionType]);
  const addToCart = (item: MenuItem) => {
    setCart(c => {
      const ex = c.find(x => x._id === item._id);
      if (ex) return c.map(x => x._id === item._id ? { ...x, quantity: x.quantity + 1 } : x);
      return [...c, { ...item, quantity: 1 }];
    });
  };
  const removeFromCart = (id: string) => {
    setCart(c => {
      const ex = c.find(x => x._id === id);
      if (!ex) return c;
      if (ex.quantity === 1) return c.filter(x => x._id !== id);
      return c.map(x => x._id === id ? { ...x, quantity: x.quantity - 1 } : x);
    });
  };
  const getQty = (id: string) => cart.find(x => x._id === id)?.quantity ?? 0;
  const validateStep = () => {
    setError("");
    if (step === 0) {
      if (!functionType) { setError("Please select a function type."); return false; }
      if (!date) { setError("Please select a date."); return false; }
      if (!startTime || !endTime) { setError("Please select start and end time."); return false; }
      if (duration < 1) { setError("End time must be after start time."); return false; }
      if (memberCount < 1) { setError("Member count must be at least 1."); return false; }
    }
    if (step === 1) {
      if (!selectedTable) { setError("Please select a table."); return false; }
      if (memberCount > selectedTable.capacity) {
        setError(`Table T${String(selectedTable.tableNumber).padStart(2, "0")} fits only ${selectedTable.capacity} people.`);
        return false;
      }
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => { setError(""); setStep(s => s - 1); };
  const handleSubmit = async () => {
    setSubmitting(true); setError("");
    try {
      const payload = {
        tableId: selectedTable!._id,
        functionType,
        memberCount,
        date,
        startTime,
        endTime,
        specialRequests,
        selectedItems: cart.map(i => ({ menuItemId: i._id, quantity: i.quantity })),
      };
      const { data } = await axios.post(`${API}/reservations`, payload, authHeader());
      navigate(`/reservations/${data.reservation._id}`, { state: { reservation: data.reservation, qrCode: data.qrCode } });
    } catch (e: any) {
      setError(e.response?.data?.message || "Booking failed. Please try again.");
      setSubmitting(false);
    }
  };

  const filteredMenu = menuItems.filter(i =>
    menuFilter === "ALL" || i.category === menuFilter
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50">
      {/* Nav */}
      <nav className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/user" className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1">
            ← Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">DineFlow</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
      
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Make a Reservation</h1>
          <p className="text-gray-400 text-sm mt-2">Book your perfect table in a few easy steps</p>
        </div>
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? "bg-purple-600 text-white" :
                i === step ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-md shadow-purple-200" :
                "bg-white border-2 border-purple-100 text-gray-300"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${i === step ? "text-purple-600" : "text-gray-300"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-purple-400" : "bg-purple-100"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-purple-100 rounded-3xl shadow-xl shadow-purple-100 p-6 sm:p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">{error}</div>
          )}

          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-gray-800">Event Details</h2>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Function Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {FUNCTION_TYPES.map(ft => (
                    <button key={ft} onClick={() => setFunctionType(ft)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition text-center ${
                        functionType === ft
                          ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-100"
                          : "border-purple-100 hover:border-purple-300 bg-white"
                      }`}>
                      <span className="text-2xl">{FUNCTION_ICONS[ft]}</span>
                      <span className={`text-xs font-bold ${functionType === ft ? "text-purple-700" : "text-gray-500"}`}>
                        {ft.replace("_", " ")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Date *</label>
                  <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
                    className="w-full border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-purple-400 bg-purple-50/40 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Number of Members *</label>
                  <input type="number" min={1} value={memberCount} onChange={e => setMemberCount(Number(e.target.value))}
                    className="w-full border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-purple-400 bg-purple-50/40 transition" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Start Time *</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                    className="w-full border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-purple-400 bg-purple-50/40 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">End Time *</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                    className="w-full border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-purple-400 bg-purple-50/40 transition" />
                </div>
              </div>

              {duration > 0 && startTime && endTime && (
                <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500">⏱ Duration: <span className="font-bold text-gray-700">{duration} hour{duration > 1 ? "s" : ""}</span></span>
                  <span className="text-gray-500">Table charge: <span className="font-bold text-purple-600">Rs. {tableCharge.toLocaleString()}</span></span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Special Requests (optional)</label>
                <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} rows={2}
                  placeholder="Any special arrangements, dietary requirements…"
                  className="w-full border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-purple-400 bg-purple-50/40 transition resize-none" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl font-black text-gray-800 mb-5">Choose a Table</h2>
              <p className="text-sm text-gray-400 mb-4">Showing all tables — you need at least <span className="font-bold text-purple-600">{memberCount} seats</span></p>

              {tablesLoading ? (
                <div className="text-center py-10 text-gray-400 text-sm">Loading tables…</div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {tables.map(t => {
                    const available = t.status === "AVAILABLE";
                    const fits = t.capacity >= memberCount;
                    const disabled = !available || !fits;
                    const selected = selectedTable?._id === t._id;
                    return (
                      <button key={t._id} onClick={() => !disabled && setSelectedTable(t)} disabled={disabled}
                        className={`text-left p-5 rounded-2xl border-2 transition ${
                          selected ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-100"
                          : disabled ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-purple-100 hover:border-purple-300 bg-white"
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-black text-lg text-gray-800">Table T{String(t.tableNumber).padStart(2, "0")}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            t.status === "AVAILABLE" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-500 border border-red-100"
                          }`}>{t.status}</span>
                        </div>
                        <p className="text-sm text-gray-500">👥 Capacity: <span className="font-bold text-gray-700">{t.capacity} seats</span></p>
                        {!fits && available && <p className="text-xs text-red-400 mt-1">⚠ Too small for {memberCount} members</p>}
                        {selected && <p className="text-xs text-purple-600 font-bold mt-2">✓ Selected</p>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <h2 className="text-xl font-black text-gray-800">Add Food & Drinks</h2>
                <span className="text-xs text-gray-400 font-medium">(Optional)</span>
              </div>

              <div className="flex gap-2 mb-5 flex-wrap">
                {["ALL", "FOOD", "BEVERAGE", "DESSERT"].map(c => (
                  <button key={c} onClick={() => setMenuFilter(c)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${menuFilter === c ? "bg-purple-600 text-white" : "bg-white border border-purple-100 text-gray-500 hover:border-purple-300"}`}>
                    {c}
                  </button>
                ))}
              </div>

              {menuLoading ? (
                <div className="text-center py-10 text-gray-400 text-sm">Loading menu…</div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {filteredMenu.map(item => {
                    const qty = getQty(item._id);
                    return (
                      <div key={item._id} className="bg-white border border-purple-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                          {item.category === "FOOD" ? "🍛" : item.category === "BEVERAGE" ? "🥤" : "🍰"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                          <p className="text-purple-600 text-sm font-black">Rs. {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {qty > 0 && (
                            <>
                              <button onClick={() => removeFromCart(item._id)}
                                className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold text-sm hover:bg-purple-200 transition flex items-center justify-center">−</button>
                              <span className="font-bold text-sm text-gray-800 w-4 text-center">{qty}</span>
                            </>
                          )}
                          <button onClick={() => addToCart(item)}
                            className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition flex items-center justify-center">+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-5 bg-purple-50 border border-purple-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3">Selected Items</p>
                  {cart.map(i => (
                    <div key={i._id} className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{i.name} × {i.quantity}</span>
                      <span className="font-semibold">Rs. {(i.price * i.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-purple-200 mt-3 pt-3 flex justify-between text-sm font-black text-gray-800">
                    <span>Items Total</span>
                    <span className="text-purple-600">Rs. {itemsTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-black text-gray-800 mb-5">Review & Confirm</h2>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5 space-y-3 mb-6">
                <div className="flex items-center gap-3 pb-3 border-b border-purple-100">
                  <span className="text-3xl">{FUNCTION_ICONS[functionType]}</span>
                  <div>
                    <p className="font-black text-gray-800">{functionType.replace("_", " ")}</p>
                    <p className="text-xs text-gray-400">Function type</p>
                  </div>
                </div>

                {[
                  ["📅 Date", new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })],
                  ["⏰ Time", `${startTime} – ${endTime}`],
                  ["⏱ Duration", `${duration} hour${duration > 1 ? "s" : ""}`],
                  ["👥 Members", `${memberCount} people`],
                  ["🍽️ Table", `T${String(selectedTable?.tableNumber).padStart(2, "0")} (${selectedTable?.capacity} seats)`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-gray-500">{l}</span>
                    <span className="font-semibold text-gray-800">{v}</span>
                  </div>
                ))}

                {specialRequests && (
                  <div className="text-sm">
                    <span className="text-gray-500">📝 Requests</span>
                    <p className="text-gray-700 text-xs mt-1 italic">{specialRequests}</p>
                  </div>
                )}
              </div>
              <div className="bg-white border border-purple-100 rounded-2xl p-5">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4">Payment Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Table charge ({duration}h × Rs. {HOURLY_RATE.toLocaleString()})</span>
                    <span className="font-semibold">Rs. {tableCharge.toLocaleString()}</span>
                  </div>
                  {cart.length > 0 && (
                    <>
                      <div className="border-t border-purple-50 pt-2 mt-2">
                        {cart.map(i => (
                          <div key={i._id} className="flex justify-between text-gray-500 text-xs mb-1">
                            <span>{i.name} × {i.quantity}</span>
                            <span>Rs. {(i.price * i.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Food & Drinks</span>
                        <span className="font-semibold">Rs. {itemsTotal.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t-2 border-purple-200 pt-3 mt-3 flex justify-between font-black text-gray-900 text-base">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                      Rs. {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={back} className="flex-1 py-3 rounded-2xl border border-purple-200 text-purple-600 font-bold text-sm hover:bg-purple-50 transition">
                ← Back
              </button>
            )}
            {step < 3 && (
              <button onClick={next}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition shadow-md shadow-purple-200">
                {step === 2 ? "Review Booking →" : "Continue →"}
              </button>
            )}
            {step === 3 && (
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition shadow-md shadow-purple-200 disabled:opacity-50">
                {submitting ? "Confirming…" : "✓ Confirm Reservation"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}