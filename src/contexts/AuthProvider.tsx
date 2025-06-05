import { supabase } from "@/supabase/supabasse-client";
import type { Session } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type UserType = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const updateUserFromSession = useCallback((session: Session | null) => {
    setUser(session?.user ? {
      id: session.user.id,
      email: session.user.email || "",
    } : null);
    setLoading(false);
  }, []);

  const handleAuthStateChange = useCallback((event: string, session: Session | null) => {
    updateUserFromSession(session);
    if (event === "SIGNED_OUT") navigate("/login", { replace: true });
  }, [updateUserFromSession, navigate]);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          updateUserFromSession(session);
          const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
          unsubscribe = () => subscription.unsubscribe();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();
    
    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [updateUserFromSession, handleAuthStateChange]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) updateUserFromSession(data.session);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email : string, password : string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session) updateUserFromSession(data.session);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut , signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
