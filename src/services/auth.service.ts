import type { AuthSession, FarmerProfile, LoginInput } from "@/types/auth";
import { apiRequest, isApiConfigured, mockDelay } from "./api-client";

/** Demo-mode only: this number signs in as admin. The real API decides roles. */
export const DEMO_ADMIN_PHONE = "9999999999";

export async function login(input: LoginInput): Promise<AuthSession> {
  if (isApiConfigured) {
    return apiRequest<AuthSession>("/auth/login", { method: "POST", body: input });
  }
  await mockDelay();
  return {
    token: `demo-${input.phone}`,
    user: {
      id: `farmer-${input.phone}`,
      name: input.name,
      phone: input.phone,
      role: input.phone === DEMO_ADMIN_PHONE ? "admin" : "farmer",
    },
    profile: input,
  };
}

export async function updateProfile(profile: FarmerProfile): Promise<FarmerProfile> {
  if (isApiConfigured) {
    return apiRequest<FarmerProfile>("/farmers/me", { method: "PUT", body: profile });
  }
  await mockDelay();
  return profile;
}
