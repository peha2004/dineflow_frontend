import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MenuCard from "../components/MenuCard";

const API = import.meta.env.VITE_API_URL;

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  availableFor: string[];
  image?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: "🍛",
  BEVERAGE: "🥤",
  DESSERT: "🍰",
};


export default function ViewMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/menu`)
      .then((r) => setItems(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(
    (i) =>
      (filterCat === "ALL" || i.category === filterCat) &&
      i.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-purple-50 to-pink-50">
      <nav className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/user"
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            ← Dashboard
          </Link>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm">
              D
            </div>
            <span className="font-black bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              DineFlow
            </span>
          </div>
          <div className="ml-auto">
            <Link
              to="/reservations/create"
              className="text-sm px-4 py-2 bg-linear-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition shadow-md shadow-purple-200"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-gray-900">Our Menu</h1>
          <p className="text-gray-400 text-sm mt-2">
            Browse our selection of food, drinks, and desserts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-8 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {["ALL", "FOOD", "BEVERAGE", "DESSERT"].map((c) => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`text-sm px-4 py-2 rounded-xl font-semibold transition ${filterCat === c ? "bg-purple-600 text-white shadow-md shadow-purple-200" : "bg-white border border-purple-100 text-gray-500 hover:border-purple-300"}`}
              >
                {c === "ALL" ? "All" : `${CATEGORY_ICONS[c]} ${c}`}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu…"
            className="border border-purple-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white text-gray-700 w-full sm:w-52"
          />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-purple-100 h-36 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No items found.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <MenuCard
                key={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                category={item.category}
                availableFor={item.availableFor}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm mb-3">
            Ready to order? Add items when making a reservation.
          </p>
          <Link
            to="/reservations/create"
            className="inline-block px-6 py-3 bg-linear-to-r from-purple-600 to-pink-500 text-white font-bold rounded-2xl hover:opacity-90 transition shadow-md shadow-purple-200 text-sm"
          >
            Book a Table & Add Food →
          </Link>
        </div>
      </div>
    </div>
  );
}
