export type Role = "farmer" | "admin";

export type SoilCategory = "alluvial" | "black" | "red" | "sandy" | "clay" | "loamy";
export type WaterCategory = "canal" | "borewell" | "rainfed" | "drip" | "tank" | "medium" | "high" | "low";
export type FarmerCategory = "marginal" | "small" | "semi-medium" | "medium" | "large" | "women" | "sc_st" | "general";

export type FarmerProfile = {
  id?: string;
  phone: string;
  password?: string;
  role?: Role;
  email?: string;
  name: string;
  village: string;
  district: string;
  state: string;
  landSize: string; // in acres
  soilType: string;
  waterAvailability: string;
  mainCrop?: string;
  farmerCategory?: FarmerCategory;
  createdAt?: string;
};

export type AuthUser = {
  id: string;
  name: string;
  phone: string;
  role: Role;
};

/** Active session in localStorage */
export type AuthSession = {
  token: string;
  user: AuthUser;
  profile: FarmerProfile;
};

export type LoginInput = FarmerProfile;
