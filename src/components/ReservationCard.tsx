import { Link } from "react-router-dom";

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
  table: {
    tableNumber: number;
    capacity: number;
  };
  selectedItems: {
    name: string;
    price: number;
    quantity: number;
  }[];
}

const FUNCTION_ICONS: Record<string, string> = {
  BIRTHDAY: "🎂",
  PARTY: "🎉",
  NORMAL_DINING: "🍽️",
  ANNIVERSARY: "💍",
  CORPORATE: "💼",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
  CONFIRMED: "bg-green-50 text-green-600 border-green-100",
  CANCELLED: "bg-red-50 text-red-500 border-red-100",
  COMPLETED: "bg-blue-50 text-blue-600 border-blue-100",
};

interface Props {
  reservation: Reservation;
  onCancel: (id: string) => void;
}

export default function ReservationCard({
  reservation,
  onCancel,
}: Props) {
  return (
    <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center text-2xl">
            {FUNCTION_ICONS[reservation.functionType] ?? "📅"}
          </div>

          <div>
            <p className="font-black text-gray-800">
              {reservation.functionType.replace("_", " ")}
            </p>

            <p className="text-xs text-gray-400 font-mono">
              {reservation.reservationCode}
            </p>
          </div>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold border ${
            STATUS_STYLES[reservation.status]
          }`}
        >
          {reservation.status}
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mt-4 text-sm">
        <div className="bg-purple-50/60 rounded-xl px-3 py-2">
          <p className="text-xs text-gray-400">Date</p>

          <p className="font-semibold text-gray-700 text-xs mt-0.5">
            {new Date(reservation.date).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-purple-50/60 rounded-xl px-3 py-2">
          <p className="text-xs text-gray-400">Time</p>

          <p className="font-semibold text-gray-700 text-xs mt-0.5">
            {reservation.startTime} - {reservation.endTime}
          </p>
        </div>

        <div className="bg-purple-50/60 rounded-xl px-3 py-2">
          <p className="text-xs text-gray-400">Table</p>

          <p className="font-semibold text-gray-700 text-xs mt-0.5">
            T{String(reservation.table?.tableNumber).padStart(2, "0")}
          </p>
        </div>
      </div>

      {reservation.selectedItems?.length > 0 && (
        <div className="mt-3 text-xs text-gray-400">
          🍛{" "}
          {reservation.selectedItems
            .map((i) => `${i.name} ×${i.quantity}`)
            .join(", ")}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-50">
        <p className="font-black text-base text-purple-600">
          Rs. {reservation.totalAmount?.toLocaleString()}
        </p>

        <div className="flex gap-2">
          <Link
            to={`/reservations/${reservation._id}`}
            className="text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600"
          >
            View / QR
          </Link>

          {reservation.status === "PENDING" && (
            <button
              onClick={() => onCancel(reservation._id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}