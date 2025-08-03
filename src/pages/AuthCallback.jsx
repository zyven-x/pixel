import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        supabase.auth.getSessionFromUrl().then(({ data, error }) => {
          if (data?.session) {
            supabase.auth.setSession(data.session);
            navigate("/");
          }
        });
      } else {
        navigate("/");
      }
    });
  }, []);

  return <p>Logging you in...</p>;
}
