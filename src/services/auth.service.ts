import type { AuthSession, FarmerProfile, LoginInput } from "@/types/auth";
import { mockDelay } from "./api-client";
import { frontendStore } from "./frontend-store";

export const DEMO_ADMIN_PHONE = "9999999999";

export async function login(input: LoginInput): Promise<AuthSession> {
  await mockDelay(200);
  const saved = frontendStore.saveFarmer(input);
  return {
    token: `session-${input.phone}`,
    user: {
      id: saved.id ?? `farmer-${input.phone}`,
      name: saved.name,
      phone: saved.phone,
      role: input.phone === DEMO_ADMIN_PHONE ? "admin" : "farmer",
    },
    profile: saved,
  };
}

export async function updateProfile(profile: FarmerProfile): Promise<FarmerProfile> {
  await mockDelay(150);
  return frontendStore.saveFarmer(profile);
}
