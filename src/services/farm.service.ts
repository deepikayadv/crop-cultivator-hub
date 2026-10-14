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
  SavedScheme,
} from "@/types/domain";
import { apiRequest, isApiConfigured, mockDelay } from "./api-client";
import { mockStore } from "./mock-store";

/** Each function calls the Express API when configured, otherwise demo data. */

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (isApiConfigured) return apiRequest("/dashboard/summary");
  await mockDelay();
  const ex = mockStore.expenses;
  return {
    savedSchemes: mockStore.saved.length,
    activePlans: mockStore.plans.filter((p) => p.status !== "harvested").length,
    monthExpense: ex.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0),
    monthIncome: ex.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0),
    unreadNotifications: mockStore.notifications.filter((n) => !n.read).length,
  };
}

// Crop plans
export async function listPlans(): Promise<CropPlan[]> {
  if (isApiConfigured) return apiRequest("/crop-plans");
  await mockDelay();
  return [...mockStore.plans];
}
export async function createPlan(input: NewCropPlan): Promise<CropPlan> {
  if (isApiConfigured) return apiRequest("/crop-plans", { method: "POST", body: input });
  await mockDelay();
  const plan: CropPlan = { ...input, id: `p${Date.now()}`, status: "planned" };
  mockStore.plans = [plan, ...mockStore.plans];
  return plan;
}
export async function deletePlan(id: string): Promise<void> {
  if (isApiConfigured) return apiRequest(`/crop-plans/${encodeURIComponent(id)}`, { method: "DELETE" });
  await mockDelay();
  mockStore.plans = mockStore.plans.filter((p) => p.id !== id);
}

// Expenses
export async function listExpenses(): Promise<ExpenseEntry[]> {
  if (isApiConfigured) return apiRequest("/expenses");
  await mockDelay();
  return [...mockStore.expenses];
}

// Saved schemes
export async function listSavedSchemes(): Promise<SavedScheme[]> {
  if (isApiConfigured) return apiRequest("/saved-schemes");
  await mockDelay();
  return [...mockStore.saved];
}
export async function removeSavedScheme(id: string): Promise<void> {
  if (isApiConfigured) return apiRequest(`/saved-schemes/${encodeURIComponent(id)}`, { method: "DELETE" });
  await mockDelay();
  mockStore.saved = mockStore.saved.filter((s) => s.id !== id);
}

// Notifications
export async function listNotifications(): Promise<AppNotification[]> {
  if (isApiConfigured) return apiRequest("/notifications");
  await mockDelay(200);
  return [...mockStore.notifications];
}
export async function markAllNotificationsRead(): Promise<void> {
  if (isApiConfigured) return apiRequest("/notifications/read-all", { method: "PATCH" });
  await mockDelay();
  mockStore.notifications = mockStore.notifications.map((n) => ({ ...n, read: true }));
}

// Crop advisor
export async function getRecommendations(input: AdvisorInput): Promise<CropRecommendation[]> {
  if (isApiConfigured) return apiRequest("/recommendations", { method: "POST", body: input });
  await mockDelay(500);
  const waterScore = { low: 0, medium: 1, high: 2 }[input.water];
  return crops
    .filter((c) => c.season === input.season)
    .map((c) => {
      const thirsty = /paddy|rice|sugarcane|धान/i.test(c.name.en) ? 2 : /wheat|maize/i.test(c.name.en) ? 1 : 0;
      const score = Math.max(40, 95 - Math.abs(thirsty - waterScore) * 20);
      return {
        cropId: c.id,
        crop: c.name,
        emoji: c.emoji,
        score,
        reason: {
          en: `Suits ${input.season} season. Water need: ${c.water.en}. Soil: ${c.soil.en}.`,
          hi: `${c.sowing.hi} में बुवाई। पानी: ${c.water.hi}। मिट्टी: ${c.soil.hi}।`,
        },
      };
    })
    .sort((a, b) => b.score - a.score);
}

// Admin
export async function getAdminStats(): Promise<AdminStats> {
  if (isApiConfigured) return apiRequest("/admin/stats");
  await mockDelay();
  return {
    farmers: mockStore.users.filter((u) => u.role === "farmer").length,
    admins: mockStore.users.filter((u) => u.role === "admin").length,
    openTickets: 3,
    schemes: 8,
  };
}
export async function listUsers(): Promise<AdminUser[]> {
  if (isApiConfigured) return apiRequest("/admin/users");
  await mockDelay();
  return [...mockStore.users];
}
