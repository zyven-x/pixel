import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./supabaseClient";

import App from "./App.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from "./pages/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <BrowserRouter>
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
      </BrowserRouter>
    </SessionContextProvider>
  </StrictMode>
);
