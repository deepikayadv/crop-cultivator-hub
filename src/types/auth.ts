export type Role = "farmer" | "admin";

export type FarmerProfile = {
  phone: string;
  name: string;
  village: string;
  landSize: string;
  mainCrop: string;
};

export type AuthUser = {
  id: string;
  name: string;
  phone: string;
  role: Role;
};

/** Shape returned by POST /auth/login on the Express API. */
export type AuthSession = {
  token: string;
  user: AuthUser;
  profile: FarmerProfile;
};

export type LoginInput = FarmerProfile;
