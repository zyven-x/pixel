import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = useUser();
  const [message, setMessage] = useState("");

  if (user === undefined) return null;
  if (user) return <Navigate to="/" />;

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  }

  async function handleGoogleLogin() {
    const redirectTo = "https://pixel-io.vercel.app";
    
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
  }

  async function handleForgotPassword() {
    if (!email) {
      return setError("Please enter your email to reset password.");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link sent. Check your email.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-md">
        {/* Login Heading */}
        <div className="justify-center items-center flex mb-10 gap-4">
          <h1 className="text-4xl font-bold text-black">Login</h1>
          <h1 className="text-4xl font-bold text-black">to</h1>
          <img src="/Pixal_logo.png" className=" max-w-20" alt="logo" />
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full p-3 pl-5 border border-gray-300 rounded-full"
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 pl-5 border border-gray-300 rounded-full"
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <p
            onClick={handleForgotPassword}
            className="text-sm text-black cursor-pointer hover:underline text-left ml-4"
          >
            Forgot Password?
          </p>
          {message && (
            <p className="mt-4 text-sm text-green-600 text-center">{message}</p>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-full hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">or</div>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full p-3 border border-gray-300 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-black font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
