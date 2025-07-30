import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  async function handleReset() {
    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully.");
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-3xl p-20 w-full max-w-lg">
        <h1 className="text-4xl font-bold mb-7 text-center text-black">Reset Password</h1>
        <input
          type="password"
          className="w-full p-3 pl-4 border border-gray-300 rounded-full mb-4"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-3 pl-4 border border-gray-300 rounded-full mb-4"
          placeholder="Confirm New Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {message && <p className="mt-4 text-sm text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleReset}
          className="w-full bg-black text-white p-3 rounded-full hover:bg-gray-800"
        >
          Set New Password
        </button>
      </div>
    </div>
  );
}
