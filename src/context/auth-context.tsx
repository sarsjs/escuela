 "use client";

import * as React from "react";
import { createContext, useContext } from "react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { fetchUsers } from "@/lib/supabase/data";
import type { User } from "@/lib/types";

type AuthContextValue = {
  session: Session | null;
  profile: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = React.PropsWithChildren<Record<string, never>>;

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadSession = React.useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        await refreshProfile(session.user);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("auth load session", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = async (user: SupabaseUser) => {
    try {
      const users = await fetchUsers();
      const match = users.find((stored) => stored.email === user.email || stored.id === user.id);
      if (match) setProfile(match);
    } catch (error) {
      console.error("refresh profile", error);
      setProfile(null);
    }
  };

  React.useEffect(() => {
    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        refreshProfile(session.user);
      } else {
        setProfile(null);
      }
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [loadSession]);

  const value: AuthContextValue = React.useMemo(
    () => ({
      session,
      profile,
      loading,
      signIn: async (email: string) => {
        await supabase.auth.signInWithOtp({ email });
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
