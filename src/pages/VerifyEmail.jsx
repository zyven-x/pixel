import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

function VerifyEmail() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      if (!session) return;

      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;

      if (user?.email_confirmed_at) {
        navigate("/");
      }
    };

    checkVerification();
  }, [session, supabase, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-white text-black">
      <div className="text-center items-center gap-2">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="text-gray-600 max-w-md">
          We’ve sent you an email with a verification link. Please check your inbox (or spam folder), and click the link to activate your account.
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
