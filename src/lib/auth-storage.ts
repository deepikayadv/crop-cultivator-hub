import type { AuthSession, FarmerProfile } from "@/types/auth";

const KEY = "kisanmitra.session";
const LEGACY_KEY = "kisanmitra.farmer"; // Evaluation-I profile format

/** Browser-only. Holds the token returned by the API (never DB credentials). */
export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as AuthSession;
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const p = JSON.parse(legacy) as FarmerProfile;
      const migrated: AuthSession = {
        token: `demo-${p.phone}`,
        user: { id: `farmer-${p.phone}`, name: p.name, phone: p.phone, role: "farmer" },
        profile: p,
      };
      writeSession(migrated);
      window.localStorage.removeItem(LEGACY_KEY);
      return migrated;
    }
  } catch {
    window.localStorage.removeItem(KEY);
  }
  return null;
}

export function writeSession(session: AuthSession | null) {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(KEY, JSON.stringify(session));
  else window.localStorage.removeItem(KEY);
}
