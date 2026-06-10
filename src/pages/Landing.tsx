import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f0a1e]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <h1 className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">DineFlow</h1>
          </div>
          <ul className="hidden md:flex gap-8 text-white/60 text-sm font-medium">
            {["Home","About","Features","Contact"].map(s=>(
              <li key={s}><a href={`#${s.toLowerCase()}`} className="hover:text-white transition">{s}</a></li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Link to="/login" className="text-sm px-5 py-2 rounded-full border border-white/20 hover:border-purple-400 hover:text-purple-300 transition">Sign In</Link>
            <Link to="/register" className="text-sm px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition font-medium">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="min-h-screen flex items-center px-8 pt-20 relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-700/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full text-purple-300 text-sm mb-6">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse inline-block" />
              Now accepting reservations
            </div>
            <h1 className="text-6xl font-black leading-tight">
              Reserve Your
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">Perfect Table</span>
            </h1>
            <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-md">
              Book tables for birthdays, parties, anniversaries and more. Select your menu, pick your time, and get instant QR confirmation.
            </p>
            <div className="flex gap-4 mt-10">
              <Link to="/register" className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold hover:opacity-90 hover:scale-105 transition duration-200">Get Started →</Link>
              <Link to="/login" className="px-8 py-3.5 rounded-2xl border border-white/10 hover:border-purple-400/50 hover:bg-white/5 transition font-medium">Sign In</Link>
            </div>
            <div className="flex gap-8 mt-12">
              {[["500+","Bookings Made"],["50+","Happy Tables"],["4.9★","Rating"]].map(([v,l])=>(
                <div key={l}><p className="text-2xl font-black">{v}</p><p className="text-xs text-white/40 mt-0.5">{l}</p></div>
              ))}
            </div>
          </div>

          {/* Floating booking card */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-3xl blur-2xl" />
              <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm float-animation w-80">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-lg">🎂</div>
                  <div>
                    <p className="font-bold text-sm">Birthday Party</p>
                    <p className="text-xs text-white/40">Table T05 · 8 members</p>
                  </div>
                  <span className="ml-auto text-xs bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Confirmed</span>
                </div>
                {[["📅","Date","June 15, 2026"],["⏰","Time","7:00 – 10:00 PM"],["⏱","Duration","3 hours"]].map(([i,l,v])=>(
                  <div key={l} className="flex justify-between text-sm mb-2">
                    <span className="text-white/40">{i} {l}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 mt-4 pt-4 flex justify-between items-center">
                  <span className="text-xs text-white/30">Fried Rice · Chicken · Juice</span>
                  <span className="text-lg font-black text-purple-300">Rs. 22,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-28 bg-[#0a0714]">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">About Us</p>
          <h2 className="text-5xl font-black mb-6">Dining made <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">effortless</span></h2>
          <p className="text-white/50 text-lg leading-relaxed">DineFlow helps restaurants manage reservations, tables and menus efficiently. Customers can reserve tables for any function — and get instant confirmation right to their inbox with a QR code.</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 bg-[#0f0a1e]">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">Features</p>
          <h2 className="text-center text-5xl font-black mb-16">Everything you need</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              ["📅","Smart Reservations","Book by function — Birthday, Party, Anniversary, Corporate and more."],
              ["🍛","Menu Selection","Browse food & beverages per function. See pricing in real-time."],
              ["📧","Instant Confirmation","Get email confirmation with QR code after every booking."],
              ["📊","Live Dashboard","Admins manage tables, menus, and reservations in one place."],
              ["🔒","Secure & Fast","JWT auth, encrypted passwords, role-based access control."],
              ["📱","QR Code Check-in","Show your QR at the restaurant for seamless entry."],
            ].map(([icon,title,desc])=>(
              <div key={String(title)} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:bg-white/5 hover:border-purple-500/30 transition group">
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">{icon}</div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-28 bg-[#0a0714]">
        <div className="max-w-xl mx-auto px-8 text-center">
          <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">Contact</p>
          <h2 className="text-5xl font-black mb-6">Get in touch</h2>
          <p className="text-white/50 mb-8">Have questions? Our team is here to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@dineflow.com" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 hover:border-purple-500/40 transition text-sm">✉️ support@dineflow.com</a>
            <a href="tel:+94771234567" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 hover:border-purple-500/40 transition text-sm">📞 +94 77 123 4567</a>
          </div>
        </div>
      </section>

      <footer className="bg-[#060410] border-t border-white/5 text-white/30 text-center py-6 text-sm">
        © 2026 DineFlow. All Rights Reserved.
      </footer>
    </div>
  );
}