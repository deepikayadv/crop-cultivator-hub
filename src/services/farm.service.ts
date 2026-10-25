import { crops } from "@/data/farm-data";
import type {
  AdminStats,
  AdminUser,
  AdvisorInput,
  AppNotification,
  CropPlan,
  CropRecommendation,
  DashboardSummary,
  ExpenseEntry,
  NewCropPlan,
  SaleEntry,
  SavedScheme,
  SupportTicket,
} from "@/types/domain";
import { mockDelay } from "./api-client";
import { frontendStore } from "./frontend-store";

export async function getDashboardSummary(phone?: string): Promise<DashboardSummary> {
  await mockDelay(150);
  return frontendStore.getDashboardSummary(phone);
}

// Crop plans
export async function listPlans(phone?: string): Promise<CropPlan[]> {
  await mockDelay(150);
  return frontendStore.getPlans(phone);
}

export async function createPlan(input: NewCropPlan, phone: string): Promise<CropPlan> {
  await mockDelay(200);
  return frontendStore.addPlan(input, phone);
}

export async function updatePlan(plan: CropPlan): Promise<CropPlan> {
  await mockDelay(150);
  return frontendStore.updatePlan(plan);
}

export async function deletePlan(id: string): Promise<void> {
  await mockDelay(150);
  frontendStore.deletePlan(id);
}

// Expenses
export async function listExpenses(phone?: string): Promise<ExpenseEntry[]> {
  await mockDelay(150);
  return frontendStore.getExpenses(phone);
}

export async function createExpense(
  expense: Omit<ExpenseEntry, "id">,
  phone: string,
): Promise<ExpenseEntry> {
  await mockDelay(150);
  return frontendStore.addExpense(expense, phone);
}

export async function deleteExpense(id: string): Promise<void> {
  await mockDelay(150);
  frontendStore.deleteExpense(id);
}

// Sales
export async function listSales(phone?: string): Promise<SaleEntry[]> {
  await mockDelay(150);
  return frontendStore.getSales(phone);
}

export async function createSale(
  sale: Omit<SaleEntry, "id">,
  phone: string,
): Promise<SaleEntry> {
  await mockDelay(150);
  return frontendStore.addSale(sale, phone);
}

export async function deleteSale(id: string): Promise<void> {
  await mockDelay(150);
  frontendStore.deleteSale(id);
}

// Saved schemes
export async function listSavedSchemes(phone?: string): Promise<SavedScheme[]> {
  await mockDelay(100);
  return frontendStore.getSavedSchemes(phone);
}

export async function toggleSaveScheme(schemeId: string, phone: string): Promise<boolean> {
  await mockDelay(100);
  return frontendStore.toggleSaveScheme(schemeId, phone);
}

// Notifications
export async function listNotifications(phone?: string): Promise<AppNotification[]> {
  await mockDelay(100);
  return frontendStore.getNotifications(phone);
}

export async function markNotificationRead(id: string): Promise<void> {
  frontendStore.markNotificationRead(id);
}

export async function markAllNotificationsRead(phone?: string): Promise<void> {
  await mockDelay(100);
  frontendStore.markAllNotificationsRead(phone);
}

// Support Tickets
export async function listTickets(phone?: string): Promise<SupportTicket[]> {
  await mockDelay(150);
  return phone ? frontendStore.getTickets(phone) : frontendStore.getAllTickets();
}

export async function submitSupportTicket(
  ticket: Omit<SupportTicket, "id" | "createdAt" | "status">,
): Promise<SupportTicket> {
  await mockDelay(250);
  return frontendStore.submitTicket(ticket);
}

export async function replyToSupportTicket(
  ticketId: string,
  reply: string,
  status: "in_progress" | "resolved",
): Promise<SupportTicket | null> {
  await mockDelay(200);
  return frontendStore.replyToTicket(ticketId, reply, status);
}

// Crop advisor engine
export async function getRecommendations(input: AdvisorInput): Promise<CropRecommendation[]> {
  await mockDelay(250);

  // Match season and evaluate soil and water suitability
  return crops.map((c) => {
    let score = 50;

    // Season match
    if (c.season === input.season) score += 30;

    // Soil compatibility
    const soilLower = input.soil.toLowerCase();
    const cSoil = c.soil.en.toLowerCase();
    if (cSoil.includes(soilLower) || soilLower.includes("alluvial") || cSoil.includes("well-drained")) {
      score += 10;
    }

    // Water compatibility
    const waterLower = input.water.toLowerCase();
    const cWater = c.water.en.toLowerCase();
    if (
      (waterLower === "high" || waterLower === "canal") &&
      (cWater.includes("high") || cWater.includes("frequent") || /paddy|sugarcane/i.test(c.name.en))
    ) {
      score += 10;
    } else if (
      (waterLower === "low" || waterLower === "rainfed") &&
      (cWater.includes("low") || cWater.includes("drought") || /mustard|gram|millet/i.test(c.name.en))
    ) {
      score += 10;
    } else {
      score += 5;
    }

    // Cap score at 98
    const finalScore = Math.min(98, Math.max(45, score));

    return {
      cropId: c.id,
      crop: c.name,
      emoji: c.emoji,
      score: finalScore,
      suitableSeason: {
        en: c.season.toUpperCase(),
        hi: c.season === "rabi" ? "रबी" : c.season === "kharif" ? "खरीफ" : "जायद",
      },
      soilRequirements: c.soil,
      waterRequirements: c.water,
      growingDuration: {
        en: `${c.durationDays} days`,
        hi: `${c.durationDays} दिन`,
      },
      reason: {
        en: `High suitability for ${input.season} season in ${input.state || "Northern Plains"}. Compatible with ${input.soil} soil and ${input.water} irrigation.`,
        hi: `${input.season === "rabi" ? "रबी" : "खरीफ"} मौसम और ${input.soil} मिट्टी के लिए अत्यधिक उपयुक्त। ${input.water} सिंचाई व्यवस्था के अनुकूल।`,
      },
    };
  }).sort((a, b) => b.score - a.score);
}

// Admin
export async function getAdminStats(): Promise<AdminStats> {
  await mockDelay(150);
  const farmers = frontendStore.getAllFarmers();
  const plans = frontendStore.getPlans();
  const tickets = frontendStore.getAllTickets();
  const expenses = frontendStore.getExpenses();
  const sales = frontendStore.getSales();

  return {
    farmers: farmers.length,
    activeCropPlans: plans.filter((p) => p.status !== "harvested" && p.status !== "cancelled").length,
    totalSchemes: 8,
    openTickets: tickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
    totalExpensesRecorded: expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    totalRevenueRecorded: sales.reduce((s, e) => s + Number(e.totalAmount || 0), 0),
  };
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  await mockDelay(150);
  const farmers = frontendStore.getAllFarmers();
  return farmers.map((f) => ({
    id: f.id ?? `farmer-${f.phone}`,
    name: f.name,
    phone: f.phone,
    email: f.email,
    village: f.village,
    district: f.district,
    state: f.state,
    role: f.phone === "9999999999" ? "admin" : "farmer",
    joinedAt: f.createdAt ?? "2026-01-01",
  }));
}
