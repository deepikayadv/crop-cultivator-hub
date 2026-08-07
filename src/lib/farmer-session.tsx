import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type FarmerProfile = {
  phone: string;
  name: string;
  village: string;
  landSize: string;
  mainCrop: string;
};

const STORAGE_KEY = "kisanmitra.farmer";

type SessionValue = {
  farmer: FarmerProfile | null;
  ready: boolean;
  signIn: (profile: FarmerProfile) => void;
  update: (patch: Partial<FarmerProfile>) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);

/**
 * Evaluation-I session store: profile lives in localStorage only.
 * Evaluation-II swaps this provider's internals for real auth + database.
 */
export function FarmerSessionProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setFarmer(JSON.parse(raw) as FarmerProfile);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: FarmerProfile | null) => {
    setFarmer(next);
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      farmer,
      ready,
      signIn: (profile) => persist(profile),
      update: (patch) => persist({ ...(farmer ?? blankFarmer()), ...patch }),
      signOut: () => persist(null),
    }),
    [farmer, ready, persist],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function blankFarmer(): FarmerProfile {
  return { phone: "", name: "", village: "", landSize: "", mainCrop: "" };
}

export function useFarmerSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useFarmerSession must be used inside FarmerSessionProvider");
  return ctx;
}
