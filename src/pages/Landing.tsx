import { Link } from "react-router-dom";

function Orb({ x, y, size, color, duration, delay }: {
  x: number; y: number; size: number; color: string; duration: number; delay: number;
}) {
  return (
    <div className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size,
        background: color, filter: "blur(70px)",
        animation: `orbPulse ${duration}s ease-in-out ${delay}s infinite`, opacity: 0.5 }} />
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.2; }
          25%  { transform: translateY(-18px) rotate(5deg) scale(1.05); opacity: 0.28; }
          50%  { transform: translateY(-28px) rotate(-3deg) scale(0.97); opacity: 0.22; }
          75%  { transform: translateY(-12px) rotate(4deg) scale(1.03); opacity: 0.25; }
          100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.2; }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50%       { transform: scale(1.2); opacity: 0.3; }
        }
       @keyframes gentleBob {
  0%,100% {
    transform: translateY(0px);
  }
  25% {
    transform: translateY(-8px);
  }
  50% {
    transform: translateY(-15px);
  }
  75% {
    transform: translateY(-8px);
  }
}
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.4); opacity: 0.9; }
        }

        @keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
        .animate-fade-up   { animation: fadeSlideUp 0.8s ease forwards; }
        .animate-fade-up-2 { animation: fadeSlideUp 0.8s ease 0.15s forwards; opacity: 0; }
        .animate-fade-up-3 { animation: fadeSlideUp 0.8s ease 0.3s forwards; opacity: 0; }
        .card-bob { animation: gentleBob 4s ease-in-out infinite; }
        .sparkle-ring {
          position: absolute;
          border: 1.5px dashed rgba(167,139,250,0.35);
          border-radius: 50%;
          animation: rotateSlow 20s linear infinite;
        }
        .btn-signin {
  background: #faf5ff;
  color: #7c3aed;
  border: 1px solid #d8b4fe;
  transition: all 0.3s ease;
}
        .btn-signin:hover {
  background: #7c3aed;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(124,58,237,0.35);
}
          @keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.animate-card {
  animation: cardEntrance 1s ease 0.5s forwards;
  opacity: 0;
}
      `
      }
      </style>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-pink-100 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <h1 className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              DineFlow
            </h1>
          </div>
          <ul className="hidden md:flex gap-8 text-gray-500 text-sm font-medium">
            {["Home","About","Features","Contact"].map(s => (
              <li key={s}><a href={`#${s.toLowerCase()}`} className="hover:text-purple-600 transition-colors">{s}</a></li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Link to="/login" className="btn-signin text-sm px-6 py-2.5 rounded-full text-white font-bold shadow-md">
              Sign In
            </Link>
            <Link to="/register" className="text-sm px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition font-medium shadow-md shadow-purple-200">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
     <section
  id="home"
  className="min-h-screen flex items-center px-8 pt-20 relative overflow-hidden"
  style={{
    background:
      "linear-gradient(-45deg, #faf5ff, #fdf2f8, #f3e8ff, #ffffff)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 15s ease infinite"
  }}
>
        <Orb x={-5} y={-5}  size={500} color="rgba(124,58,237,0.45)"  duration={8}  delay={0}   />
        <Orb x={70} y={55}  size={400} color="rgba(219,39,119,0.3)"   duration={10} delay={1.5} />
        <Orb x={35} y={75}  size={350} color="rgba(147,51,234,0.35)"  duration={7}  delay={0.8} />
        <Orb x={80} y={0}   size={280} color="rgba(167,139,250,0.4)"  duration={9}  delay={2}   />
        <Orb x={20} y={50}  size={200} color="rgba(236,72,153,0.25)"  duration={11} delay={3}   />

        <div className="sparkle-ring" style={{ width:120, height:120, top:"12%", right:"8%", opacity:0.6 }} />
        <div className="sparkle-ring" style={{ width:80,  height:80,  bottom:"20%", left:"6%", opacity:0.5, animationDirection:"reverse", animationDuration:"15s" }} />
        <div className="sparkle-ring" style={{ width:200, height:200, top:"55%", right:"3%", opacity:0.3, animationDuration:"28s" }} />

        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(circle, rgba(124,58,237,0.08) 1px, transparent 1px)", backgroundSize:"32px 32px" }} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10 w-full">

          <div>
            <div className="animate-fade-up inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-purple-200 px-4 py-2 rounded-full text-purple-700 text-sm mb-6 font-medium shadow-sm">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse inline-block" />
              Now accepting reservations
            </div>

            <h1 className="animate-fade-up-2 text-6xl font-black leading-tight text-gray-900">
              Reserve Your
              <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent mt-1">
                Perfect Table
              </span>
            </h1>

            <p className="animate-fade-up-3 mt-6 text-gray-600 text-lg leading-relaxed max-w-md">
              Book tables for birthdays, parties, anniversaries and more. Select
              your menu, pick your time, and get instant QR confirmation.
            </p>

            <div className="animate-fade-up-3 flex gap-4 mt-10">
              <Link to="/register"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold hover:opacity-90 hover:scale-105 transition duration-200 shadow-lg shadow-purple-300">
                Get Started →
              </Link>
              <Link to="/login"
                className="btn-signin px-8 py-3.5 rounded-2xl text-white font-bold shadow-md">
                Sign In
              </Link>
            </div>

            <div className="animate-fade-up-3 flex gap-8 mt-12">
              {[["500+","Bookings Made"],["50+","Happy Tables"],["4.9★","Rating"]].map(([v,l]) => (
                <div key={l}>
                  <p className="text-2xl font-black text-gray-900">{v}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

       <div className="flex justify-center animate-card">
            <div className="relative card-bob">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-pink-400/40 rounded-3xl blur-3xl scale-110" />
              <div className="absolute -top-3 -right-3 w-5 h-5 bg-purple-400 rounded-full opacity-70 shadow-lg shadow-purple-300"
                style={{ animation:"dotPulse 3s ease-in-out infinite" }} />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full opacity-60"
                style={{ animation:"dotPulse 4s ease-in-out 1s infinite" }} />
              <div className="absolute top-1/2 -right-4 w-3 h-3 bg-orange-300 rounded-full opacity-70"
                style={{ animation:"dotPulse 5s ease-in-out 0.5s infinite" }} />

              <div className="relative bg-white/85 backdrop-blur-xl border border-purple-100 shadow-2xl shadow-purple-200 rounded-3xl p-8 w-80 transition-all duration-300 hover:scale-105 hover:shadow-purple-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-lg shadow-md shadow-purple-200">🎂</div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">Birthday Party</p>
                    <p className="text-xs text-gray-400">Table T05 · 8 members</p>
                  </div>
                  <span className="ml-auto text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-medium">✓ Confirmed</span>
                </div>
                {[["📅","Date","June 15, 2026"],["⏰","Time","7:00 – 10:00 PM"],["⏱","Duration","3 hours"]].map(([i,l,v]) => (
                  <div key={l} className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400">{i} {l}</span>
                    <span className="font-semibold text-gray-700">{v}</span>
                  </div>
                ))}
                <div className="border-t border-purple-100 mt-4 pt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-400">Fried Rice · Chicken · Juice</span>
                  <span className="text-lg font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Rs. 22,500</span>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 border border-purple-100 rounded-lg flex items-center justify-center text-lg">📱</div>
                  <div>
                    <p className="text-xs font-bold text-gray-700">QR Check-in Ready</p>
                    <p className="text-[10px] text-gray-400">Show at restaurant entry</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60 C360 0 1080 0 1440 60 L1440 60 L0 60 Z" fill="#fdf4ff" />
          </svg>
        </div>
      </section>

      <section id="about" className="py-28 relative overflow-hidden" style={{ background: "#fdf4ff" }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background:"rgba(167,139,250,0.2)", filter:"blur(60px)", transform:"translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background:"rgba(236,72,153,0.15)", filter:"blur(50px)", transform:"translate(-30%,30%)" }} />
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <p className="text-purple-500 text-xs font-bold tracking-widest uppercase mb-4">About Us</p>
          <h2 className="text-5xl font-black mb-6 text-gray-900">
            Dining made{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">effortless</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            DineFlow helps restaurants manage reservations, tables and menus efficiently.
            Customers can reserve tables for any function — and get instant confirmation
            right to their inbox with a QR code.
          </p>
          <div className="flex justify-center gap-6 mt-10 flex-wrap">
            {["🎂","🎉","💍","💼","🍽️"].map((e, i) => (
              <div key={i} className="w-14 h-14 bg-white border border-purple-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200"
                style={{ animation:`gentleBob ${5 + i*0.4}s ease-in-out ${i*0.3}s infinite` }}>
                {e}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-28 relative overflow-hidden" style={{ background: "#fce7f3" }}>
        <div className="absolute top-0 left-1/2 w-96 h-96 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ background:"rgba(167,139,250,0.2)", filter:"blur(80px)" }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background:"rgba(124,58,237,0.15)", filter:"blur(60px)", transform:"translate(30%,30%)" }} />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <p className="text-center text-purple-600 text-xs font-bold tracking-widest uppercase mb-4">Features</p>
          <h2 className="text-center text-5xl font-black mb-16 text-gray-900">Everything you need</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              ["📅","Smart Reservations","Book by function — Birthday, Party, Anniversary, Corporate and more."],
              ["🍛","Menu Selection","Browse food & beverages per function. See pricing in real-time."],
              ["📧","Instant Confirmation","Get email confirmation with QR code after every booking."],
              ["📊","Live Dashboard","Admins manage tables, menus, and reservations in one place."],
              ["🔒","Secure & Fast","JWT auth, encrypted passwords, role-based access control."],
              ["📱","QR Code Check-in","Show your QR at the restaurant for seamless entry."],
            ].map(([icon,title,desc]) => (
              <div key={title}
                className="bg-white/90 backdrop-blur-sm border border-purple-100 rounded-2xl p-6 hover:bg-purple-50 hover:border-purple-400 hover:shadow-xl hover:-translate-y-2 transition duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-28 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #fce7f3 50%, #ede9fe 100%)" }}>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background:"rgba(167,139,250,0.25)", filter:"blur(70px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full pointer-events-none"
          style={{ background:"rgba(236,72,153,0.2)", filter:"blur(60px)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(circle, rgba(124,58,237,0.06) 1px, transparent 1px)", backgroundSize:"28px 28px" }} />

        <div className="max-w-2xl mx-auto px-8 text-center relative z-10">
          <p className="text-purple-500 text-xs font-bold tracking-widest uppercase mb-4">Contact</p>
          <h2 className="text-5xl font-black mb-4 text-gray-900">Get in touch</h2>
          <p className="text-gray-500 mb-10 text-lg">Have questions? Our team is here to help. We'd love to hear from you!</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a href="mailto:support@dineflow.com"
              className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-purple-200 shadow-md rounded-2xl px-7 py-5 hover:border-purple-400 hover:shadow-xl transition duration-200 text-sm text-gray-600 font-medium hover:-translate-y-1">
              <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm group-hover:scale-110 transition">✉️</span>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm">Email Us</p>
                <p className="text-xs text-gray-400">support@dineflow.com</p>
              </div>
            </a>
            <a href="tel:+94771234567"
              className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-purple-200 shadow-md rounded-2xl px-7 py-5 hover:border-purple-400 hover:shadow-xl transition duration-200 text-sm text-gray-600 font-medium hover:-translate-y-1">
              <span className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm group-hover:scale-110 transition">📞</span>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm">Call Us</p>
                <p className="text-xs text-gray-400">+94 77 123 4567</p>
              </div>
            </a>
          </div>

          <Link to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-black text-base hover:opacity-90 hover:scale-105 transition duration-200 shadow-xl shadow-purple-200">
            Start Booking Now 🍽️
          </Link>
        </div>
      </section>
      <footer className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white border-t border-purple-100">

  <div
    className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-30"
    style={{ background: "rgba(167,139,250,0.4)" }}
  />
  <div
    className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
    style={{ background: "rgba(236,72,153,0.4)" }}
  />

  <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">

    <div className="grid md:grid-cols-3 gap-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🍽️</span>
          <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            DineFlow
          </h2>
        </div>

        <p className="text-gray-500 leading-relaxed text-sm max-w-sm">
          Making restaurant reservations simple, elegant and fast.
          Book tables for birthdays, anniversaries, parties and special moments.
        </p>
      </div>
      <div>
        <h3 className="font-bold text-gray-800 mb-4">
          Quick Links
        </h3>

        <ul className="space-y-3 text-gray-500">
          <li>
            <a href="#home" className="hover:text-purple-600 transition">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-purple-600 transition">
              About
            </a>
          </li>
          <li>
            <a href="#features" className="hover:text-purple-600 transition">
              Features
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-purple-600 transition">
              Contact
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-gray-800 mb-4">
          Contact
        </h3>

        <div className="space-y-3 text-gray-500 text-sm">
          <p>📧 support@dineflow.com</p>
          <p>📞 +94 77 123 4567</p>
          <p>📍 Colombo, Sri Lanka</p>
        </div>
        <div className="flex gap-3 mt-5">
          <a
            href="#"
            className="w-10 h-10 rounded-xl bg-white shadow-md border border-purple-100 flex items-center justify-center hover:scale-110 hover:shadow-lg transition"
          >
            📘
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-xl bg-white shadow-md border border-purple-100 flex items-center justify-center hover:scale-110 hover:shadow-lg transition"
          >
            📸
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-xl bg-white shadow-md border border-purple-100 flex items-center justify-center hover:scale-110 hover:shadow-lg transition"
          >
            🐦
          </a>
        </div>
      </div>

    </div>
    <div className="border-t border-purple-100 mt-10 pt-6 text-center">

      <p className="text-gray-400 text-sm">
        © 2026{" "}
        <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          DineFlow
        </span>
        . All Rights Reserved 🍽️
      </p>

    </div>
  </div>
</footer>
    </div>
  );
}
