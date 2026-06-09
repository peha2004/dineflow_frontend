import { useState } from "react";

import { loginUser }
from "../services/authService";

import { useNavigate }
from "react-router-dom";

import { useAuth }
from "../hooks/useAuth";

export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const data =
        await loginUser({
          email,
          password,
        });

      login(
  data.token,
  data.user.role
);

      if (data.user.role === "ADMIN") {

        navigate("/admin");

      } else {

        navigate("/user");
      }

    } catch {

      alert("Invalid Credentials");
    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-[#d68a62]">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="bg-[#b66742] text-white p-3 rounded-xl w-full"
        >
          Login
        </button>

      </form>

    </div>
  );
}