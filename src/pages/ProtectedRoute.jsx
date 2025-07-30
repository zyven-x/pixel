import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function ProtectedRoute({ children }) {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/login");
    }
  }, [isLoading, session, navigate]);

  if (isLoading) return null;

  return children;
}
