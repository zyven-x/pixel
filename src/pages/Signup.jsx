import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for verification link.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center text-black">Create a Pixel Account</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            className="w-full p-3 pl-4 border border-gray-300 rounded-full"
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full p-3 pl-4 border border-gray-300 rounded-full"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 pl-4 border border-gray-300 rounded-full"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="w-full p-3 pl-4 border border-gray-300 rounded-full"
            type="password"
            placeholder="Confirm Password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-full hover:bg-gray-800"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-black font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
