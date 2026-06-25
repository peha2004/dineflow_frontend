import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const API =  `${import.meta.env.VITE_API_URL}/user`;
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export default function UserProfile() {
  const { logout } = useAuth();

  const [profile, setProfile] = useState<{ name: string; email: string; role: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    axios.get(`${API}/profile`, authHeader())
      .then(r => { setProfile(r.data); setForm({ name: r.data.name, email: r.data.email }); })
      .catch(console.error);
  }, []);

  const handleProfileSave = async () => {
    setProfileMsg(""); setProfileErr("");
    setSavingProfile(true);
    try {
      const { data } = await axios.put(`${API}/profile`, form, authHeader());
      setProfile(data.user);
      setProfileMsg("Profile updated successfully!");
    } catch (e: any) {
      setProfileErr(e.response?.data?.message || "Update failed.");
    } finally { setSavingProfile(false); }
  };

  const handlePasswordChange = async () => {
    setPwMsg(""); setPwErr("");
    if (pwForm.newPassword !== pwForm.confirm) { setPwErr("New passwords do not match."); return; }
    if (pwForm.newPassword.length < 6) { setPwErr("New password must be at least 6 characters."); return; }
    setSavingPw(true);
    try {
      await axios.put(`${API}/password`, { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, authHeader());
      setPwMsg("Password changed successfully!");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (e: any) {
      setPwErr(e.response?.data?.message || "Password change failed.");
    } finally { setSavingPw(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50">
      <nav className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/user" className="text-purple-600 hover:text-purple-800 text-sm font-medium">← Dashboard</Link>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">DineFlow</span>
          </div>
          <button onClick={logout} className="ml-auto text-sm px-3 py-1.5 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition font-medium">Logout</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Profile</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your account details and password</p>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-5 flex items-center gap-4 text-white shadow-md shadow-purple-200">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
            {profile?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="font-black text-lg">{profile?.name}</p>
            <p className="text-purple-100 text-sm">{profile?.email}</p>
            <span className="inline-block mt-1 text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">{profile?.role}</span>
          </div>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-black text-gray-800 mb-5">Edit Profile</h2>
          {profileMsg && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">{profileMsg}</div>}
          {profileErr && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">{profileErr}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-purple-400 bg-purple-50/40 transition" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-purple-400 bg-purple-50/40 transition" />
            </div>
            <button onClick={handleProfileSave} disabled={savingProfile}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition shadow-md shadow-purple-200">
              {savingProfile ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-black text-gray-800 mb-5">Change Password</h2>
          {pwMsg && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">{pwMsg}</div>}
          {pwErr && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">{pwErr}</div>}
          <div className="space-y-4">
            {[
              { label: "Current Password", key: "currentPassword", placeholder: "Your current password" },
              { label: "New Password", key: "newPassword", placeholder: "Min. 6 characters" },
              { label: "Confirm New Password", key: "confirm", placeholder: "••••••••" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{f.label}</label>
                <input type="password" value={pwForm[f.key as keyof typeof pwForm]}
                  onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full border border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-purple-400 bg-purple-50/40 transition" />
              </div>
            ))}
            <button onClick={handlePasswordChange} disabled={savingPw}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition shadow-md shadow-purple-200">
              {savingPw ? "Updating…" : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}