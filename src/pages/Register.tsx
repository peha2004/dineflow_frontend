import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await registerUser({
        name,
        email,
        password,
      });

      alert("Registration Successful");

      navigate("/login");

    } catch {

      alert("Registration Failed");
    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-[#d68a62]">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-6">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="border p-3 w-full mb-4"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

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
          Register
        </button>

      </form>

    </div>
  );
}