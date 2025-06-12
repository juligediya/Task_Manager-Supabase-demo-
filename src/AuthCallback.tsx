// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase/supabasse-client";

export default function AuthCallback() {
  const { updateUserFromSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthResponse = async () => {
      try {
        // Get the current session
        const session = await supabase.auth.getSession();
        console.log('Session:', session.data.session);


        if (!session) {
          console.error("No session found");
          navigate("/login");
          return;
        }


        // Update the auth context with the new session
        // updateUserFromSession(session);
        navigate("/", { replace: true });

      } catch (error) {
        console.error("Error handling OAuth response:", error);
        navigate("/login");
      }
    };

    handleOAuthResponse();
  }, [updateUserFromSession, navigate]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('✅ Session:', session);
    });
  }, []);

  return <p>Signing you in...</p>;
}