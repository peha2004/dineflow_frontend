import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password });
      navigate("/login");
    } catch {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 flex items-center justify-center px-4 py-10">
     
      <div className="absolute w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none top-1/4 left-1/4" />
      <div className="absolute w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none bottom-1/4 right-1/4" />

      <div className="relative w-full max-w-md">
       
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black shadow-md shadow-purple-200">
              D
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              DineFlow
            </span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Create your account</p>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl p-8 shadow-xl shadow-purple-100">
          <h1 className="text-xl font-bold text-gray-800 mb-6">Join DineFlow</h1>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", label: "Full name", type: "text", placeholder: "John Doe" },
              { name: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
              { name: "password", label: "Password", type: "password", placeholder: "Min. 6 characters" },
              { name: "confirm", label: "Confirm password", type: "password", placeholder: "••••••••" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name as keyof typeof form]}
                  onChange={handleChange}
                  required
                  placeholder={f.placeholder}
                  className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white transition-all"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90 disabled:opacity-50 transition-all mt-2 shadow-md shadow-purple-200"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}