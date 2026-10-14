import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthSession, AuthUser, FarmerProfile, LoginInput, Role } from "@/types/auth";
import { readSession, writeSession } from "./auth-storage";
import * as authService from "@/services/auth.service";

type AuthContextValue = {
  ready: boolean;
  user: AuthUser | null;
  profile: FarmerProfile | null;
  role: Role | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (input: LoginInput) => Promise<AuthSession>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<FarmerProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setReady(true);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const next = await authService.login(input);
    writeSession(next);
    setSession(next);
    return next;
  }, []);

  const logout = useCallback(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    writeSession(null);
    setSession(null);
  }, [queryClient]);

  const updateProfile = useCallback(
    async (patch: Partial<FarmerProfile>) => {
      if (!session) return;
      const profile = await authService.updateProfile({ ...session.profile, ...patch });
      const next: AuthSession = { ...session, profile, user: { ...session.user, name: profile.name } };
      writeSession(next);
      setSession(next);
    },
    [session],
  );

  const value = useMemo<AuthContextValue>(() => {
    const role = session?.user.role ?? null;
    return {
      ready,
      user: session?.user ?? null,
      profile: session?.profile ?? null,
      role,
      isAuthenticated: session !== null,
      isAdmin: role === "admin",
      login,
      logout,
      updateProfile,
    };
  }, [ready, session, login, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
