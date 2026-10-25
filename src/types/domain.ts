import type { L } from "@/lib/i18n";
import type { Role } from "./auth";

export type Season = "kharif" | "rabi" | "zaid";

export type DashboardSummary = {
  savedSchemes: number;
  activePlans: number;
  totalExpense: number;
  totalRevenue: number;
  netProfit: number;
  unreadNotifications: number;
  upcomingHarvests: number;
};

export type CropPlanStatus = "planned" | "sown" | "growing" | "harvested" | "cancelled";

export type CropPlan = {
  id: string;
  farmerPhone?: string;
  farmerName?: string;
  crop: string;
  season: Season;
  areaAcres: number;
  sowingDate: string;
  expectedHarvestDate?: string;
  actualHarvestDate?: string;
  status: CropPlanStatus;
  notes?: string;
  stageProgress?: number; // 0 to 100 percentage
};

export type NewCropPlan = Omit<CropPlan, "id">;

export type ExpenseType = "expense" | "income";
export type ExpenseCategory =
  | "seed"
  | "fertilizer"
  | "labour"
  | "irrigation"
  | "transportation"
  | "equipment"
  | "sale"
  | "other";

export type ExpenseEntry = {
  id: string;
  farmerPhone?: string;
  farmerName?: string;
  planId?: string;
  cropName?: string;
  date: string;
  type: ExpenseType;
  category: ExpenseCategory;
  amount: number;
  note: string;
};

export type SaleEntry = {
  id: string;
  farmerPhone?: string;
  farmerName?: string;
  planId?: string;
  crop: string;
  quantityQuintals: number;
  pricePerQuintal: number;
  totalAmount: number;
  saleDate: string;
  buyerName?: string;
  notes?: string;
};

export type SavedScheme = {
  id: string;
  farmerPhone?: string;
  schemeId: string;
  savedAt: string;
};

export type NotificationKind = "weather" | "crop" | "scheme" | "support" | "price" | "system";

export type AppNotification = {
  id: string;
  farmerPhone?: string;
  kind: NotificationKind;
  title: L;
  body: L;
  createdAt: string;
  read: boolean;
  link?: string;
};

export type SoilType = "alluvial" | "black" | "red" | "sandy" | "clay" | "loamy";
export type WaterAvailability = "canal" | "borewell" | "rainfed" | "drip" | "tank" | "low" | "medium" | "high";

export type AdvisorInput = {
  state: string;
  season: Season;
  soil: string;
  water: string;
  landAcres: number;
};

export type CropRecommendation = {
  cropId: string;
  crop: L;
  emoji: string;
  score: number;
  suitableSeason: L;
  soilRequirements: L;
  waterRequirements: L;
  growingDuration: L;
  reason: L;
};

export type SupportTicketCategory =
  | "crop"
  | "pest"
  | "irrigation"
  | "scheme"
  | "market"
  | "other";

export type SupportTicketStatus = "open" | "in_progress" | "resolved";

export type SupportTicket = {
  id: string;
  farmerPhone: string;
  farmerName: string;
  subject: string;
  category: SupportTicketCategory;
  description: string;
  status: SupportTicketStatus;
  createdAt: string;
  adminReply?: string;
  repliedAt?: string;
};

export type EligibilityStatus = "eligible" | "not_eligible" | "needs_verification";

export type EligibilityResult = {
  schemeId: string;
  schemeName: L;
  summary: L;
  status: EligibilityStatus;
  reason: L;
  requiredDocuments: L[];
  officialLink: string;
  lastVerified: string;
};

export type MandiRecord = {
  id: string;
  crop: L;
  commodity: string;
  mandi: L;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number; // average/ruling price
  arrivalDate: string;
  source: string;
  lastUpdated: string;
};

export type AdminStats = {
  farmers: number;
  activeCropPlans: number;
  totalSchemes: number;
  openTickets: number;
  totalExpensesRecorded: number;
  totalRevenueRecorded: number;
};

export type AdminUser = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  village: string;
  district: string;
  state: string;
  role: Role;
  joinedAt: string;
};
