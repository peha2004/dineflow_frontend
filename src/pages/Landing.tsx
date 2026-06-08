import { Link } from "react-router-dom";
import tableImage from "../images/table.jpg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#d68a62]">

      {/* NAVBAR */}

      <nav className="fixed top-0 w-full z-50 bg-[#b66742]/80 backdrop-blur-lg border-b border-white/10">

        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

          <h1 className="text-2xl font-black text-white">
            DineFlow
          </h1>

          <ul className="hidden md:flex gap-8 text-white font-medium">

            <li>
              <a href="#home" className="hover:text-yellow-200 duration-300">
                Home
              </a>
            </li>

            <li>
              <a href="#about" className="hover:text-yellow-200 duration-300">
                About
              </a>
            </li>

            <li>
              <a href="#features" className="hover:text-yellow-200 duration-300">
                Features
              </a>
            </li>

            <li>
              <a href="#contact" className="hover:text-yellow-200 duration-300">
                Contact
              </a>
            </li>

          </ul>

          <div className="flex gap-3">

            <Link
              to="/login"
              className="bg-white px-5 py-2 rounded-full hover:scale-105 duration-300"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="bg-black text-white px-5 py-2 rounded-full hover:scale-105 duration-300"
            >
              Sign Up
            </Link>

          </div>

        </div>

      </nav>

      {/* HERO */}

      <section
        id="home"
        className="min-h-screen flex items-center px-8"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <div>

            <h1 className="text-6xl font-black text-white leading-tight">

              Reserve Your
              <br />
              Perfect Table

            </h1>

            <p className="mt-6 text-white/80 text-lg">

              Book tables online, scan QR menus,
              order food seamlessly and enjoy a modern dining experience.

            </p>

            <div className="flex gap-4 mt-8">

              <Link
                to="/register"
                className="bg-white px-8 py-3 rounded-full font-bold hover:scale-105 duration-300"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="bg-black text-white px-8 py-3 rounded-full hover:scale-105 duration-300"
              >
                Login
              </Link>

            </div>

          </div>

     <div className="flex justify-center relative">

  <div className="absolute w-72 h-72 bg-white/20 blur-3xl rounded-full"></div>

  <img
    src={tableImage}
    alt="table"
    className="relative z-10 w-[500px] float-animation drop-shadow-2xl"
  />

</div>

        </div>
      </section>

      {/* ABOUT */}

      <section
        id="about"
        className="py-24 bg-white"
      >

        <div className="max-w-6xl mx-auto px-8 text-center">

          <h2 className="text-5xl font-bold text-[#b66742]">

            About DineFlow

          </h2>

          <p className="mt-6 text-gray-600 text-lg max-w-3xl mx-auto">

            DineFlow helps restaurants manage reservations,
            tables and QR-code menus efficiently.
            Customers can reserve their tables online
            and access menus instantly by scanning QR codes.

          </p>

        </div>

      </section>

      {/* FEATURES */}

      <section
        id="features"
        className="py-24 bg-[#fff7f2]"
      >

        <div className="max-w-7xl mx-auto px-8">

          <h2 className="text-center text-5xl font-bold text-[#b66742] mb-16">
            Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 duration-300">
              <h3 className="font-bold text-2xl">
                📅 Table Reservations
              </h3>

              <p className="mt-4 text-gray-600">
                Reserve tables online quickly and easily.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 duration-300">
              <h3 className="font-bold text-2xl">
                📱 QR Menus
              </h3>

              <p className="mt-4 text-gray-600">
                Scan QR codes to access menus instantly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 duration-300">
              <h3 className="font-bold text-2xl">
                🍽 Smart Ordering
              </h3>

              <p className="mt-4 text-gray-600">
                Order directly from your table.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CONTACT */}

      <section
        id="contact"
        className="py-24 bg-[#b66742]"
      >

        <div className="text-center text-white">

          <h2 className="text-5xl font-bold">
            Contact Us
          </h2>

          <p className="mt-4">
            support@dineflow.com
          </p>

          <p>
            +94 77 123 4567
          </p>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="bg-black text-white text-center py-6">

        © 2026 DineFlow. All Rights Reserved.

      </footer>

    </div>
  );
}