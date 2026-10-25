import type { FarmerProfile } from "@/types/auth";
import type {
  AppNotification,
  CropPlan,
  ExpenseEntry,
  SaleEntry,
  SavedScheme,
  SupportTicket,
  MandiRecord,
  DashboardSummary,
} from "@/types/domain";
import { crops as seedCrops, type Crop } from "@/data/farm-data";

const STORAGE_KEY = "kisanmitra.store.v4";

type StoreState = {
  farmers: FarmerProfile[];
  crops: Crop[];
  plans: CropPlan[];
  expenses: ExpenseEntry[];
  sales: SaleEntry[];
  savedSchemes: SavedScheme[];
  notifications: AppNotification[];
  tickets: SupportTicket[];
};

export const DEFAULT_FARMERS: FarmerProfile[] = [
  {
    id: "f1",
    phone: "9876543210",
    password: "farmer123",
    role: "farmer",
    email: "ramesh.kumar@example.in",
    name: "Ramesh Kumar",
    village: "Khairpur",
    district: "Karnal",
    state: "Haryana",
    landSize: "5.5",
    soilType: "alluvial",
    waterAvailability: "canal",
    mainCrop: "Wheat",
    farmerCategory: "medium",
    createdAt: "2026-03-15T09:00:00Z",
  },
  {
    id: "f2",
    phone: "9812345678",
    password: "farmer123",
    role: "farmer",
    email: "sunita.devi@example.in",
    name: "Sunita Devi",
    village: "Nagda",
    district: "Ujjain",
    state: "Madhya Pradesh",
    landSize: "2.5",
    soilType: "black",
    waterAvailability: "borewell",
    mainCrop: "Soybean",
    farmerCategory: "women",
    createdAt: "2026-03-10T09:00:00Z",
  },
  {
    id: "f3",
    phone: "9823456789",
    password: "farmer123",
    role: "farmer",
    email: "suresh.patil@example.in",
    name: "Suresh Patil",
    village: "Niphad",
    district: "Nashik",
    state: "Maharashtra",
    landSize: "1.5",
    soilType: "red",
    waterAvailability: "drip",
    mainCrop: "Cotton",
    farmerCategory: "marginal",
    createdAt: "2026-03-05T09:00:00Z",
  },
  {
    id: "admin-1",
    phone: "9999999999",
    password: "admin123",
    role: "admin",
    email: "admin@kisanmitra.gov.in",
    name: "Dr. Rajesh Sharma (Krishi Adhikari)",
    village: "Central Krishi Bhawan",
    district: "New Delhi",
    state: "Delhi",
    landSize: "10.0",
    soilType: "loamy",
    waterAvailability: "canal",
    mainCrop: "Wheat",
    farmerCategory: "general",
    createdAt: "2026-01-01T00:00:00Z",
  },
];

// Seed records to give farmers and admin an immediate rich experience
const initialStore: StoreState = {
  farmers: DEFAULT_FARMERS,
  crops: seedCrops,
  plans: [
    // Farmer 1 (Ramesh Kumar - 9876543210)
    {
      id: "plan-1",
      farmerPhone: "9876543210",
      crop: "Wheat",
      season: "rabi",
      areaAcres: 3,
      sowingDate: "2026-11-10",
      expectedHarvestDate: "2027-04-15",
      status: "growing",
      stageProgress: 65,
      notes: "PBW 550 variety sown with seed drill. Superphosphate applied.",
    },
    {
      id: "plan-2",
      farmerPhone: "9876543210",
      crop: "Mustard",
      season: "rabi",
      areaAcres: 1.5,
      sowingDate: "2026-10-20",
      expectedHarvestDate: "2027-03-10",
      status: "growing",
      stageProgress: 80,
      notes: "Pusa Bold variety. Flowering stage, monitoring for aphids.",
    },
    // Farmer 2 (Sunita Devi - 9812345678)
    {
      id: "plan-3",
      farmerPhone: "9812345678",
      crop: "Soybean",
      season: "kharif",
      areaAcres: 2.5,
      sowingDate: "2026-06-25",
      expectedHarvestDate: "2026-10-10",
      status: "harvested",
      stageProgress: 100,
      notes: "JS 335 high germination seed. Successfully harvested and sold.",
    },
    {
      id: "plan-4",
      farmerPhone: "9812345678",
      crop: "Gram",
      season: "rabi",
      areaAcres: 2.0,
      sowingDate: "2026-10-28",
      expectedHarvestDate: "2027-03-05",
      status: "growing",
      stageProgress: 55,
      notes: "Desi Chana (JG-11). Pod development stage.",
    },
    // Farmer 3 (Suresh Patil - 9823456789)
    {
      id: "plan-5",
      farmerPhone: "9823456789",
      crop: "Cotton",
      season: "kharif",
      areaAcres: 1.5,
      sowingDate: "2026-06-15",
      expectedHarvestDate: "2026-11-30",
      status: "growing",
      stageProgress: 85,
      notes: "Bt-Cotton under micro-drip irrigation. Second picking underway.",
    },
    {
      id: "plan-6",
      farmerPhone: "9823456789",
      crop: "Onion",
      season: "rabi",
      areaAcres: 1.0,
      sowingDate: "2026-11-20",
      expectedHarvestDate: "2027-04-10",
      status: "planned",
      stageProgress: 15,
      notes: "Nashik Red Onion nursery preparation.",
    },
  ],
  expenses: [
    // Farmer 1 Expenses
    {
      id: "exp-1",
      farmerPhone: "9876543210",
      planId: "plan-1",
      cropName: "Wheat",
      date: "2026-11-05",
      type: "expense",
      category: "seed",
      amount: 4500,
      note: "Certified PBW 550 seed bags (120 kg)",
    },
    {
      id: "exp-2",
      farmerPhone: "9876543210",
      planId: "plan-1",
      cropName: "Wheat",
      date: "2026-11-12",
      type: "expense",
      category: "fertilizer",
      amount: 6200,
      note: "DAP (3 bags) and Urea",
    },
    {
      id: "exp-3",
      farmerPhone: "9876543210",
      planId: "plan-1",
      cropName: "Wheat",
      date: "2026-12-04",
      type: "expense",
      category: "irrigation",
      amount: 2800,
      note: "Tube-well electricity & canal maintenance fee",
    },
    {
      id: "exp-4",
      farmerPhone: "9876543210",
      planId: "plan-2",
      cropName: "Mustard",
      date: "2026-10-18",
      type: "expense",
      category: "seed",
      amount: 1800,
      note: "Pusa Bold hybrid seed",
    },
    {
      id: "exp-5",
      farmerPhone: "9876543210",
      planId: "plan-2",
      cropName: "Mustard",
      date: "2026-11-20",
      type: "expense",
      category: "labour",
      amount: 3500,
      note: "Weeding and intercultural hoeing",
    },
    // Farmer 2 (Sunita Devi) Expenses
    {
      id: "exp-6",
      farmerPhone: "9812345678",
      planId: "plan-3",
      cropName: "Soybean",
      date: "2026-06-20",
      type: "expense",
      category: "seed",
      amount: 3200,
      note: "JS 335 Soybean certified seed bags",
    },
    {
      id: "exp-7",
      farmerPhone: "9812345678",
      planId: "plan-3",
      cropName: "Soybean",
      date: "2026-07-15",
      type: "expense",
      category: "fertilizer",
      amount: 2400,
      note: "Single Super Phosphate (SSP) & Rhizobium",
    },
    {
      id: "exp-8",
      farmerPhone: "9812345678",
      planId: "plan-4",
      cropName: "Gram",
      date: "2026-10-25",
      type: "expense",
      category: "seed",
      amount: 2800,
      note: "JG-11 Desi Gram seed",
    },
    // Farmer 3 (Suresh Patil) Expenses
    {
      id: "exp-9",
      farmerPhone: "9823456789",
      planId: "plan-5",
      cropName: "Cotton",
      date: "2026-06-10",
      type: "expense",
      category: "seed",
      amount: 2200,
      note: "Bt-Cotton hybrid packets",
    },
    {
      id: "exp-10",
      farmerPhone: "9823456789",
      planId: "plan-5",
      cropName: "Cotton",
      date: "2026-08-05",
      type: "expense",
      category: "machinery",
      amount: 3100,
      note: "Micro-drip line maintenance & tractor tilling",
    },
  ],
  sales: [
    // Farmer 1 Sales
    {
      id: "sale-1",
      farmerPhone: "9876543210",
      crop: "Paddy (Basmati)",
      quantityQuintals: 45,
      pricePerQuintal: 3850,
      totalAmount: 173250,
      saleDate: "2026-10-15",
      buyerName: "Karnal Mandi Arhtiya Traders",
      notes: "Grade A grain moisture 13.5%",
    },
    // Farmer 2 Sales
    {
      id: "sale-2",
      farmerPhone: "9812345678",
      crop: "Soybean",
      quantityQuintals: 32,
      pricePerQuintal: 4450,
      totalAmount: 142400,
      saleDate: "2026-10-12",
      buyerName: "Ujjain Krishi Mandi Samiti",
      notes: "Oil content 19.2% premium lot",
    },
    // Farmer 3 Sales
    {
      id: "sale-3",
      farmerPhone: "9823456789",
      crop: "Cotton",
      quantityQuintals: 18,
      pricePerQuintal: 6900,
      totalAmount: 124200,
      saleDate: "2026-10-20",
      buyerName: "Nashik Ginning & Pressing APMC",
      notes: "First picking long staple cotton",
    },
  ],
  savedSchemes: [
    {
      id: "saved-1",
      farmerPhone: "9876543210",
      schemeId: "pm-kisan",
      savedAt: "2026-10-12T10:30:00Z",
    },
    {
      id: "saved-2",
      farmerPhone: "9876543210",
      schemeId: "pm-kusum",
      savedAt: "2026-10-14T15:20:00Z",
    },
    {
      id: "saved-3",
      farmerPhone: "9812345678",
      schemeId: "pm-kisan",
      savedAt: "2026-10-10T11:00:00Z",
    },
    {
      id: "saved-4",
      farmerPhone: "9812345678",
      schemeId: "pmfby",
      savedAt: "2026-10-15T09:30:00Z",
    },
    {
      id: "saved-5",
      farmerPhone: "9823456789",
      schemeId: "pmksy",
      savedAt: "2026-10-16T14:15:00Z",
    },
  ],
  notifications: [
    {
      id: "notif-1",
      farmerPhone: "9876543210",
      kind: "weather",
      title: {
        en: "Scattered Rain Alert in Karnal",
        hi: "करनाल में हल्की बारिश की चेतावनी",
      },
      body: {
        en: "Light rain and gusty winds predicted over the next 48 hours. Postpone foliar spraying of urea.",
        hi: "अगले 48 घंटों में हल्की वर्षा की संभावना है। यूरिया या कीटनाशक का छिड़काव रोक दें।",
      },
      createdAt: "2026-10-25T08:00:00Z",
      read: false,
      link: "/weather",
    },
    {
      id: "notif-2",
      farmerPhone: "9876543210",
      kind: "scheme",
      title: {
        en: "PM-KISAN 19th Installment Credited",
        hi: "पीएम-किसान 19वीं किस्त जारी",
      },
      body: {
        en: "Direct benefit transfer of ₹2,000 processed to linked bank accounts. Check your PFMS status.",
        hi: "आधार लिंक बैंक खाते में ₹2,000 की किस्त भेज दी गई है। स्थिति जाँचें।",
      },
      createdAt: "2026-10-24T12:30:00Z",
      read: false,
      link: "/schemes",
    },
    {
      id: "notif-3",
      farmerPhone: "9876543210",
      kind: "crop",
      title: {
        en: "Mustard Aphid Advisory",
        hi: "सरसों में माहू (चेपा) कीट सलाह",
      },
      body: {
        en: "Inspect crop edges for aphid infestation during cloudy mornings. Spray neem oil (1500 ppm) early.",
        hi: "बादल छाए रहने पर फसल की निगरानी करें। प्रारंभिक अवस्था में नीम का तेल (1500 ppm) छिड़कें।",
      },
      createdAt: "2026-10-22T09:15:00Z",
      read: true,
      link: "/crops",
    },
    // Farmer 2 Notifs
    {
      id: "notif-4",
      farmerPhone: "9812345678",
      kind: "mandi",
      title: {
        en: "Soybean Rates Steady at Ujjain Mandi",
        hi: "उज्जैन मंडी में सोयाबीन भाव स्थिर",
      },
      body: {
        en: "Soybean modal rate recorded at ₹4,450/qtl with steady arrivals of 2,400 bags.",
        hi: "उज्जैन मंडी में सोयाबीन ₹4,450 प्रति क्विंटल पर बिका।",
      },
      createdAt: "2026-10-25T07:30:00Z",
      read: false,
      link: "/market",
    },
    // Farmer 3 Notifs
    {
      id: "notif-5",
      farmerPhone: "9823456789",
      kind: "scheme",
      title: {
        en: "Per Drop More Crop Subsidy Verification",
        hi: "पर ड्रॉप मोर क्रॉप सब्सिडी सत्यापन",
      },
      body: {
        en: "Field inspection scheduled for your micro-irrigation installation in Niphad.",
        hi: "निफाड में ड्रिप सिंचाई प्रणाली का भौतिक सत्यापन निर्धारित किया गया है।",
      },
      createdAt: "2026-10-24T10:00:00Z",
      read: false,
      link: "/schemes",
    },
  ],
  tickets: [
    {
      id: "tkt-101",
      farmerPhone: "9876543210",
      farmerName: "Ramesh Kumar",
      subject: "Drip Irrigation subsidy portal not accepting Aadhaar verification",
      category: "scheme",
      description:
        "When applying for the 70% PM-KUSUM solar drip subsidy, the Haryana Agri portal shows OTP timeout error. Need guidance on manual submission at block office.",
      status: "in_progress",
      createdAt: "2026-10-21T11:45:00Z",
      adminReply:
        "Portal maintenance was scheduled until 23rd Oct. The server is restored. You can also submit the physical copy with Form-B at the Sub-Divisional Agriculture Officer (SDAO) office, Karnal.",
      repliedAt: "2026-10-23T14:10:00Z",
    },
    {
      id: "tkt-102",
      farmerPhone: "9876543210",
      farmerName: "Ramesh Kumar",
      subject: "Yellowing on lower leaves in Wheat PBW 550",
      category: "crop",
      description:
        "Noticed pale yellow tips on lower wheat foliage after first irrigation. Soil is alluvial. Was basal dose of DAP sufficient or is it zinc deficiency?",
      status: "resolved",
      createdAt: "2026-10-18T16:20:00Z",
      adminReply:
        "This is common temporary chlorosis after first irrigation. Spray 0.5% Zinc Sulphate (21%) + 1% Urea solution (1 kg Zinc Sulphate + 2 kg Urea in 200 liters water per acre) on a clear day.",
      repliedAt: "2026-10-19T10:00:00Z",
    },
    {
      id: "tkt-103",
      farmerPhone: "9812345678",
      farmerName: "Sunita Devi",
      subject: "Soil Health Card test request for Ujjain block field",
      category: "crop",
      description:
        "Want to get organic carbon and NPK levels tested before Gram sowing. Where is the nearest KVK mobile soil testing van available this week?",
      status: "resolved",
      createdAt: "2026-10-20T10:15:00Z",
      adminReply:
        "KVK Ujjain mobile testing van will visit Nagda block center on Wednesday 10 AM. Bring 500g composite soil sample taken from V-shaped cuts at 15cm depth.",
      repliedAt: "2026-10-21T16:30:00Z",
    },
    {
      id: "tkt-104",
      farmerPhone: "9823456789",
      farmerName: "Suresh Patil",
      subject: "PMKSY Drip lateral subsidy disbursement timeline",
      category: "scheme",
      description:
        "Physical inspection was completed 15 days ago for 1.5 acre micro-irrigation set in Nashik. When will DBT direct transfer hit bank account?",
      status: "in_progress",
      createdAt: "2026-10-22T14:00:00Z",
      adminReply:
        "Your inspection report has been uploaded to the MahaDBT portal. Treasury sanction is in final batch; funds are scheduled for release within 7 working days.",
      repliedAt: "2026-10-23T11:20:00Z",
    },
  ],
};

function readStore(): StoreState {
  if (typeof window === "undefined") return initialStore;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStore));
      return initialStore;
    }
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    const farmers = parsed.farmers ?? initialStore.farmers;
    // Ensure all 4 default profiles exist
    for (const def of DEFAULT_FARMERS) {
      if (!farmers.some((f) => f.phone === def.phone)) {
        farmers.push(def);
      }
    }

    return {
      farmers,
      crops: parsed.crops && parsed.crops.length > 0 ? parsed.crops : seedCrops,
      plans: parsed.plans && parsed.plans.length > 0 ? parsed.plans : initialStore.plans,
      expenses: parsed.expenses && parsed.expenses.length > 0 ? parsed.expenses : initialStore.expenses,
      sales: parsed.sales && parsed.sales.length > 0 ? parsed.sales : initialStore.sales,
      savedSchemes: parsed.savedSchemes && parsed.savedSchemes.length > 0 ? parsed.savedSchemes : initialStore.savedSchemes,
      notifications: parsed.notifications && parsed.notifications.length > 0 ? parsed.notifications : initialStore.notifications,
      tickets: parsed.tickets && parsed.tickets.length > 0 ? parsed.tickets : initialStore.tickets,
    };
  } catch (e) {
    console.error("Error reading kisanmitra store from localStorage", e);
    return initialStore;
  }
}

function writeStore(store: StoreState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error("Error writing kisanmitra store to localStorage", e);
  }
}

// Global persistent reactive service methods
export const frontendStore = {
  // Profiles & Auth
  getFarmer(phone: string): FarmerProfile | null {
    const store = readStore();
    return store.farmers.find((f) => f.phone === phone) ?? null;
  },

  authenticate(phone: string, password?: string): FarmerProfile | null {
    const store = readStore();
    const cleanPhone = phone.trim();
    const found = store.farmers.find((f) => f.phone === cleanPhone || f.email === cleanPhone);
    if (!found) return null;
    if (password && found.password && found.password !== password) {
      return null;
    }
    return found;
  },

  getDefaultProfiles(): FarmerProfile[] {
    return DEFAULT_FARMERS;
  },

  saveFarmer(profile: FarmerProfile): FarmerProfile {
    const store = readStore();
    const idx = store.farmers.findIndex((f) => f.phone === profile.phone);
    const updated: FarmerProfile = {
      ...profile,
      id: profile.id ?? `farmer-${Date.now()}`,
      createdAt: profile.createdAt ?? new Date().toISOString(),
    };
    if (idx >= 0) {
      store.farmers[idx] = updated;
    } else {
      store.farmers.push(updated);
    }
    writeStore(store);
    return updated;
  },

  getAllFarmers(): FarmerProfile[] {
    return readStore().farmers;
  },

  // Crop Calendar Management (Editable by Admin)
  getCrops(): Crop[] {
    const store = readStore();
    return store.crops && store.crops.length > 0 ? store.crops : seedCrops;
  },

  updateCrop(crop: Crop): Crop {
    const store = readStore();
    const cropsList = store.crops && store.crops.length > 0 ? [...store.crops] : [...seedCrops];
    const idx = cropsList.findIndex((c) => c.id === crop.id);
    if (idx >= 0) {
      cropsList[idx] = crop;
    } else {
      cropsList.push(crop);
    }
    store.crops = cropsList;
    writeStore(store);
    return crop;
  },

  addCrop(crop: Crop): Crop {
    const store = readStore();
    const cropsList = store.crops && store.crops.length > 0 ? [...store.crops] : [...seedCrops];
    cropsList.push(crop);
    store.crops = cropsList;
    writeStore(store);
    return crop;
  },

  deleteCrop(id: string): void {
    const store = readStore();
    const cropsList = store.crops && store.crops.length > 0 ? [...store.crops] : [...seedCrops];
    store.crops = cropsList.filter((c) => c.id !== id);
    writeStore(store);
  },

  // Crop Plans (Isolated per Farmer; Admin gets all)
  getPlans(phone?: string): CropPlan[] {
    const store = readStore();
    if (!phone) return []; // Generic/Logged out platform has NO personal farmer data
    return store.plans.filter((p) => p.farmerPhone === phone);
  },

  getAllPlans(): CropPlan[] {
    const store = readStore();
    return store.plans; // Admin gets all farmers' plans
  },

  addPlan(plan: Omit<CropPlan, "id">, phone: string): CropPlan {
    const store = readStore();
    const farmer = store.farmers.find((f) => f.phone === phone);
    const created: CropPlan = {
      ...plan,
      id: `plan-${Date.now()}`,
      farmerPhone: phone,
      farmerName: farmer?.name || "Farmer",
      stageProgress: plan.status === "harvested" ? 100 : plan.status === "growing" ? 50 : 10,
    };
    store.plans = [created, ...store.plans];
    writeStore(store);
    return created;
  },

  updatePlan(plan: CropPlan): CropPlan {
    const store = readStore();
    store.plans = store.plans.map((p) => (p.id === plan.id ? plan : p));
    writeStore(store);
    return plan;
  },

  deletePlan(id: string): void {
    const store = readStore();
    store.plans = store.plans.filter((p) => p.id !== id);
    writeStore(store);
  },

  // Expenses (Isolated per Farmer; Admin gets all)
  getExpenses(phone?: string): ExpenseEntry[] {
    const store = readStore();
    if (!phone) return []; // Generic/Logged out platform has NO personal farmer expenses
    return store.expenses.filter((e) => e.farmerPhone === phone);
  },

  getAllExpenses(): ExpenseEntry[] {
    const store = readStore();
    return store.expenses; // Admin gets all farmers' expenses
  },

  addExpense(expense: Omit<ExpenseEntry, "id">, phone: string): ExpenseEntry {
    const store = readStore();
    const farmer = store.farmers.find((f) => f.phone === phone);
    const created: ExpenseEntry = {
      ...expense,
      id: `exp-${Date.now()}`,
      farmerPhone: phone,
      farmerName: farmer?.name || "Farmer",
    };
    store.expenses = [created, ...store.expenses];
    writeStore(store);
    return created;
  },

  deleteExpense(id: string): void {
    const store = readStore();
    store.expenses = store.expenses.filter((e) => e.id !== id);
    writeStore(store);
  },

  // Sales (Isolated per Farmer; Admin gets all)
  getSales(phone?: string): SaleEntry[] {
    const store = readStore();
    if (!phone) return []; // Generic/Logged out platform has NO personal farmer sales
    return store.sales.filter((s) => s.farmerPhone === phone);
  },

  getAllSales(): SaleEntry[] {
    const store = readStore();
    return store.sales; // Admin gets all farmers' sales
  },

  addSale(sale: Omit<SaleEntry, "id">, phone: string): SaleEntry {
    const store = readStore();
    const farmer = store.farmers.find((f) => f.phone === phone);
    const created: SaleEntry = {
      ...sale,
      id: `sale-${Date.now()}`,
      farmerPhone: phone,
      farmerName: farmer?.name || "Farmer",
      totalAmount: sale.quantityQuintals * sale.pricePerQuintal,
    };
    store.sales = [created, ...store.sales];
    writeStore(store);
    return created;
  },

  deleteSale(id: string): void {
    const store = readStore();
    store.sales = store.sales.filter((s) => s.id !== id);
    writeStore(store);
  },

  // Authoritative Financial Summary Calculation
  getDashboardSummary(phone?: string): DashboardSummary {
    const plans = this.getPlans(phone);
    const expenses = this.getExpenses(phone);
    const sales = this.getSales(phone);
    const saved = this.getSavedSchemes(phone);
    const notifs = this.getNotifications(phone);

    const totalExpense = expenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount || 0), 0);
    const netProfit = totalRevenue - totalExpense;

    const upcomingHarvests = plans.filter((p) => p.status === "growing").length;

    return {
      savedSchemes: saved.length,
      activePlans: plans.filter((p) => p.status !== "harvested" && p.status !== "cancelled").length,
      totalExpense,
      totalRevenue,
      netProfit,
      unreadNotifications: notifs.filter((n) => !n.read).length,
      upcomingHarvests,
    };
  },

  // Saved Schemes (Isolated per Farmer)
  getSavedSchemes(phone?: string): SavedScheme[] {
    const store = readStore();
    if (!phone) return []; // Generic/Logged out has 0 saved schemes
    return store.savedSchemes.filter((s) => s.farmerPhone === phone);
  },

  isSchemeSaved(schemeId: string, phone?: string): boolean {
    if (!phone) return false;
    const list = this.getSavedSchemes(phone);
    return list.some((s) => s.schemeId === schemeId);
  },

  toggleSaveScheme(schemeId: string, phone: string): boolean {
    const store = readStore();
    const existingIdx = store.savedSchemes.findIndex(
      (s) => s.schemeId === schemeId && s.farmerPhone === phone,
    );
    if (existingIdx >= 0) {
      store.savedSchemes.splice(existingIdx, 1);
      writeStore(store);
      return false; // un-bookmarked
    } else {
      store.savedSchemes.push({
        id: `saved-${Date.now()}`,
        farmerPhone: phone,
        schemeId,
        savedAt: new Date().toISOString(),
      });
      writeStore(store);
      return true; // bookmarked
    }
  },

  // Notifications (Isolated per Farmer)
  getNotifications(phone?: string): AppNotification[] {
    const store = readStore();
    if (!phone) return []; // Generic/Logged out has 0 notifications
    return store.notifications.filter((n) => n.farmerPhone === phone);
  },

  markNotificationRead(id: string): void {
    const store = readStore();
    store.notifications = store.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    writeStore(store);
  },

  markAllNotificationsRead(phone?: string): void {
    const store = readStore();
    store.notifications = store.notifications.map((n) =>
      !phone || n.farmerPhone === phone ? { ...n, read: true } : n,
    );
    writeStore(store);
  },

  // Support Tickets (Isolated per Farmer; Admin gets all)
  getTickets(phone?: string): SupportTicket[] {
    const store = readStore();
    if (!phone) return []; // Generic/Logged out has 0 personal tickets
    return store.tickets.filter((t) => t.farmerPhone === phone);
  },

  getAllTickets(): SupportTicket[] {
    return readStore().tickets;
  },

  submitTicket(
    data: Omit<SupportTicket, "id" | "createdAt" | "status">,
  ): SupportTicket {
    const store = readStore();
    const created: SupportTicket = {
      ...data,
      id: `tkt-${Date.now().toString().slice(-4)}`,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    store.tickets = [created, ...store.tickets];
    writeStore(store);
    return created;
  },

  replyToTicket(ticketId: string, reply: string, status: "in_progress" | "resolved"): SupportTicket | null {
    const store = readStore();
    const idx = store.tickets.findIndex((t) => t.id === ticketId);
    if (idx === -1) return null;
    store.tickets[idx] = {
      ...store.tickets[idx],
      adminReply: reply,
      repliedAt: new Date().toISOString(),
      status,
    };
    writeStore(store);
    return store.tickets[idx];
  },
};
