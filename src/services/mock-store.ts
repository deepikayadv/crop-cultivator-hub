import type {
  AdminUser,
  AppNotification,
  CropPlan,
  ExpenseEntry,
  SavedScheme,
} from "@/types/domain";

/** In-memory demo data used until VITE_API_BASE_URL points at the Express API. */
export const mockStore: {
  plans: CropPlan[];
  expenses: ExpenseEntry[];
  saved: SavedScheme[];
  notifications: AppNotification[];
  users: AdminUser[];
} = {
  plans: [
    { id: "p1", crop: "Wheat", season: "rabi", areaAcres: 2, sowingDate: "2026-11-10", status: "planned" },
    { id: "p2", crop: "Mustard", season: "rabi", areaAcres: 1, sowingDate: "2026-10-20", status: "sown" },
  ],
  expenses: [
    { id: "e1", date: "2026-10-02", type: "expense", category: "seed", amount: 4200, note: "Wheat seed HD-2967" },
    { id: "e2", date: "2026-10-05", type: "expense", category: "fertilizer", amount: 2700, note: "DAP 2 bags" },
    { id: "e3", date: "2026-10-08", type: "income", category: "sale", amount: 18500, note: "Paddy sold at mandi" },
    { id: "e4", date: "2026-10-10", type: "expense", category: "labour", amount: 3000, note: "Harvest labour" },
  ],
  saved: [
    { id: "s1", schemeId: "pm-kisan", savedAt: "2026-10-01" },
    { id: "s2", schemeId: "pmfby", savedAt: "2026-10-06" },
  ],
  notifications: [
    {
      id: "n1",
      kind: "weather",
      title: { en: "Heavy rain expected", hi: "भारी बारिश की संभावना" },
      body: { en: "Postpone spraying for the next 48 hours.", hi: "अगले 48 घंटे छिड़काव टालें।" },
      createdAt: "2026-10-13T08:00:00Z",
      read: false,
    },
    {
      id: "n2",
      kind: "price",
      title: { en: "Mustard price up 4%", hi: "सरसों का भाव 4% बढ़ा" },
      body: { en: "Jaipur mandi rate rose this week.", hi: "इस सप्ताह जयपुर मंडी भाव बढ़ा।" },
      createdAt: "2026-10-12T10:30:00Z",
      read: false,
    },
    {
      id: "n3",
      kind: "scheme",
      title: { en: "PM-KISAN installment released", hi: "पीएम-किसान किस्त जारी" },
      body: { en: "Check your bank account for ₹2,000.", hi: "अपने बैंक खाते में ₹2,000 देखें।" },
      createdAt: "2026-10-09T06:00:00Z",
      read: true,
    },
  ],
  users: [
    { id: "u1", name: "Ramesh Kumar", phone: "9876543210", village: "Karnal", role: "farmer", joinedAt: "2026-08-14" },
    { id: "u2", name: "Sunita Devi", phone: "9812345678", village: "Sikar", role: "farmer", joinedAt: "2026-09-02" },
    { id: "u3", name: "Arjun Patil", phone: "9823456789", village: "Nashik", role: "farmer", joinedAt: "2026-09-21" },
    { id: "u4", name: "Admin Desk", phone: "9999999999", village: "Delhi", role: "admin", joinedAt: "2026-08-01" },
  ],
};
