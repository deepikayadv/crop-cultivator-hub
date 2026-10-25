import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { FarmerProfile } from "@/types/auth";
import { frontendStore } from "@/services/frontend-store";

export type { FarmerProfile };

const STORAGE_KEY = "kisanmitra.farmer";

type SessionValue = {
  farmer: FarmerProfile | null;
  ready: boolean;
  isAdmin: boolean;
  signIn: (profile: FarmerProfile) => void;
  update: (patch: Partial<FarmerProfile>) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);

function blankFarmer(): FarmerProfile {
  return {
    phone: "",
    name: "",
    village: "",
    district: "",
    state: "",
    landSize: "",
    soilType: "alluvial",
    waterAvailability: "canal",
    mainCrop: "",
    farmerCategory: "small",
  };
}

export function FarmerSessionProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      if (raw === "guest") {
        setFarmer(null);
      } else {
        try {
          const parsed = JSON.parse(raw) as FarmerProfile;
          setFarmer(parsed);
        } catch {
          window.localStorage.setItem(STORAGE_KEY, "guest");
          setFarmer(null);
        }
      }
    } else {
      // Fresh user first time: default to Ramesh Kumar, but if they log out they will stay guest
      const seed = frontendStore.getFarmer("9876543210");
      if (seed) {
        setFarmer(seed);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      }
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: FarmerProfile | null) => {
    setFarmer(next);
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      frontendStore.saveFarmer(next);
    } else {
      window.localStorage.setItem(STORAGE_KEY, "guest");
    }
  }, []);

  const isAdmin = farmer?.phone === "9999999999" || farmer?.role === "admin";

  const value = useMemo<SessionValue>(
    () => ({
      farmer,
      ready,
      isAdmin,
      signIn: (profile) => persist(profile),
      update: (patch) => {
        const current = farmer ?? blankFarmer();
        const merged = { ...current, ...patch };
        persist(merged);
      },
      signOut: () => persist(null),
    }),
    [farmer, ready, isAdmin, persist],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useFarmerSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useFarmerSession must be used inside FarmerSessionProvider");
  return ctx;
}
