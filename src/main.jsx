import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider, createBrowserSupabaseClient } from "@supabase/auth-helpers-react";
import { supabase } from "./supabaseClient";

import App from "./App.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from "./pages/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword.jsx";

import "./index.css";

useEffect(() => {
  const recoverSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const { data: recoveredSession } = await supabase.auth.recoverSession();
      if (recoveredSession?.session) {
        supabase.auth.setSession(recoveredSession.session);
      }
    }
  };
  recoverSession();
}, []);

const [supabaseClient] = useState(() =>
  createBrowserSupabaseClient({
    persistSession: true,
    autoRefreshToken: true,
  })
);
const Router = import.meta.env.VITE_IS_EXTENSION === "true" ? HashRouter : BrowserRouter;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </SessionContextProvider>
  </StrictMode>
);
