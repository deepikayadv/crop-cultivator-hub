import type { L } from "@/lib/i18n";
import type { Role } from "./auth";

export type Season = "kharif" | "rabi" | "zaid";

export type DashboardSummary = {
  savedSchemes: number;
  activePlans: number;
  monthExpense: number;
  monthIncome: number;
  unreadNotifications: number;
};

export type CropPlanStatus = "planned" | "sown" | "harvested";

export type CropPlan = {
  id: string;
  crop: string;
  season: Season;
  areaAcres: number;
  sowingDate: string;
  status: CropPlanStatus;
};

export type NewCropPlan = Omit<CropPlan, "id" | "status">;

export type ExpenseType = "expense" | "income";
export type ExpenseCategory =
  | "seed"
  | "fertilizer"
  | "labour"
  | "irrigation"
  | "equipment"
  | "sale"
  | "other";

export type ExpenseEntry = {
  id: string;
  date: string;
  type: ExpenseType;
  category: ExpenseCategory;
  amount: number;
  note: string;
};

export type SavedScheme = { id: string; schemeId: string; savedAt: string };

export type NotificationKind = "weather" | "scheme" | "price" | "system";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: L;
  body: L;
  createdAt: string;
  read: boolean;
};

export type SoilType = "alluvial" | "black" | "red" | "sandy";
export type WaterAvailability = "low" | "medium" | "high";

export type AdvisorInput = {
  season: Season;
  soil: SoilType;
  water: WaterAvailability;
  landAcres: number;
};

export type CropRecommendation = {
  cropId: string;
  crop: L;
  emoji: string;
  score: number;
  reason: L;
};

export type AdminStats = {
  farmers: number;
  admins: number;
  openTickets: number;
  schemes: number;
};

export type AdminUser = {
  id: string;
  name: string;
  phone: string;
  village: string;
  role: Role;
  joinedAt: string;
};
