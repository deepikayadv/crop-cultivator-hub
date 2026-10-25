import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  Filter,
  IndianRupee,
  KeyRound,
  Layers,
  PieChart,
  Plus,
  Search,
  Shield,
  Sprout,
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { frontendStore, DEFAULT_FARMERS } from "@/services/frontend-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section } from "@/components/PageHeader";
import type { ExpenseCategory, ExpenseEntry, SaleEntry } from "@/types/domain";

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "Farm Expense & Profit Tracker — KisanMitra CE2" },
      {
        name: "description",
        content:
          "Track seeds, fertilizer, labour, irrigation, and transport expenses alongside harvest crop sales to monitor net farm margin.",
      },
    ],
  }),
  component: ExpensesPage,
});

export function ExpensesPage() {
  const { t, tr } = useLanguage();
  const { farmer, isAdmin, signIn } = useFarmerSession();

  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"expenses" | "sales">("expenses");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [adminFarmerFilter, setAdminFarmerFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Modals
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);

  // Expense form
  const [expFarmerPhone, setExpFarmerPhone] = useState("9876543210");
  const [expCategory, setExpCategory] = useState<ExpenseCategory>("seed");
  const [expCrop, setExpCrop] = useState("Wheat");
  const [expAmount, setExpAmount] = useState("");
  const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));
  const [expNote, setExpNote] = useState("");

  // Sale form
  const [saleFarmerPhone, setSaleFarmerPhone] = useState("9876543210");
  const [saleCrop, setSaleCrop] = useState("Wheat");
  const [saleQuintals, setSaleQuintals] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [saleBuyer, setSaleBuyer] = useState("");
  const [saleNotes, setSaleNotes] = useState("");

  const reloadData = () => {
    if (isAdmin) {
      setExpenses(frontendStore.getAllExpenses());
      setSales(frontendStore.getAllSales());
    } else if (farmer) {
      setExpenses(frontendStore.getExpenses(farmer.phone));
      setSales(frontendStore.getSales(farmer.phone));
    } else {
      setExpenses([]);
      setSales([]);
    }
  };

  useEffect(() => {
    reloadData();
  }, [farmer?.phone, isAdmin]);

  // Handle adding expense
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount || Number(expAmount) <= 0) return;

    const targetPhone = isAdmin ? expFarmerPhone : farmer?.phone || "9876543210";

    frontendStore.addExpense(
      {
        cropName: expCrop,
        category: expCategory,
        amount: Number(expAmount),
        date: expDate,
        type: "expense",
        note: expNote,
      },
      targetPhone,
    );

    setExpenseModalOpen(false);
    setExpAmount("");
    setExpNote("");
    reloadData();
    setFeedbackMsg("Expense recorded successfully!");
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  // Handle adding sale
  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleQuintals || !salePrice) return;

    const targetPhone = isAdmin ? saleFarmerPhone : farmer?.phone || "9876543210";

    frontendStore.addSale(
      {
        crop: saleCrop,
        quantityQuintals: Number(saleQuintals),
        pricePerQuintal: Number(salePrice),
        totalAmount: Number(saleQuintals) * Number(salePrice),
        saleDate,
        buyerName: saleBuyer,
        notes: saleNotes,
      },
      targetPhone,
    );

    setSaleModalOpen(false);
    setSaleQuintals("");
    setSalePrice("");
    setSaleBuyer("");
    setSaleNotes("");
    reloadData();
    setFeedbackMsg("Crop harvest sale recorded successfully!");
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Delete this expense record?")) {
      frontendStore.deleteExpense(id);
      reloadData();
    }
  };

  const handleDeleteSale = (id: string) => {
    if (confirm("Delete this sale record?")) {
      frontendStore.deleteSale(id);
      reloadData();
    }
  };

  // Filtered entries according to search, category, and admin farmer filter
  const displayedExpenses = expenses.filter((e) => {
    const matchFarmer =
      !isAdmin || adminFarmerFilter === "all" || e.farmerPhone === adminFarmerFilter;
    const matchCat = categoryFilter === "all" || e.category === categoryFilter;
    const matchSearch =
      searchQuery === "" ||
      (e.cropName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.note || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchFarmer && matchCat && matchSearch;
  });

  const displayedSales = sales.filter((s) => {
    const matchFarmer =
      !isAdmin || adminFarmerFilter === "all" || s.farmerPhone === adminFarmerFilter;
    const matchSearch =
      searchQuery === "" ||
      s.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.buyerName || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchFarmer && matchSearch;
  });

  // Financial Authoritative Calculations for displayed records
  const totalExpense = displayedExpenses
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + Number(e.amount || 0), 0);

  const totalRevenue = displayedSales.reduce((s, e) => s + Number(e.totalAmount || 0), 0);
  const netProfit = totalRevenue - totalExpense;

  // Category-wise expense grouping
  const categoryTotals: Record<ExpenseCategory, number> = {
    seed: 0,
    fertilizer: 0,
    labour: 0,
    irrigation: 0,
    transportation: 0,
    equipment: 0,
    sale: 0,
    other: 0,
  };

  displayedExpenses.forEach((e) => {
    if (e.type === "expense") {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    }
  });

  // ==========================================
  // GUEST MODE (When logged out / no account active)
  // ==========================================
  if (!farmer && !isAdmin) {
    return (
      <>
        <PageHeader
          eyebrow={t("appName")}
          title={tr({ en: "Farm Expense & Revenue Ledger", hi: "कृषि खर्च एवं लाभ मार्गदर्शिका" })}
          body={tr({
            en: "Understand agricultural cost structures, input breakdown benchmarks, and net farm margin calculations. Sign in or pick an evaluation profile to manage personal books.",
            hi: "कृषि लागत संरचना, इनपुट खर्च अनुपात और शुद्ध लाभ गणना समझें। व्यक्तिगत हिसाब-किताब के लिए साइन इन करें।",
          })}
        />

        <Section>
          {/* Guest Explanation & 1-Click Profile Bar */}
          <div className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCDFC8] pb-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#B8D8BA]/40 px-3 py-1 text-xs font-semibold text-[#43373D]">
                  <IndianRupee className="size-3.5 text-[#69585F]" />
                  <span>Generic Guest Mode • Generic Agricultural Platform</span>
                </div>
                <h2 className="mt-2 font-display text-xl font-bold text-[#43373D]">
                  No Farmer Financial Ledger Active
                </h2>
                <p className="mt-1 text-xs text-[#69585F] max-w-2xl leading-relaxed">
                  Financial books, sales receipts, and input costs are private and isolated per farmer. Sign in below or choose one of the preloaded evaluation profiles to test financial tracking and net profit calculations.
                </p>
              </div>

              <Button asChild className="bg-[#69585F] text-white hover:bg-[#52444a]">
                <Link to="/login">
                  <span>Sign In with Phone</span>
                  <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
            </div>

            {/* 1-Click Evaluation Accounts */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#69585F] mb-3 flex items-center gap-2">
                <KeyRound className="size-4" />
                <span>One-Click Instant Evaluation Logins:</span>
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {DEFAULT_FARMERS.map((p) => {
                  const isAdminProfile = p.phone === "9999999999" || p.role === "admin";
                  return (
                    <button
                      key={p.phone}
                      type="button"
                      onClick={() => signIn(p)}
                      className={`text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                        isAdminProfile
                          ? "border-[#EF959D] bg-[#EF959D]/15 hover:bg-[#EF959D]/25"
                          : "border-[#DCDFC8] bg-[#F8F9F3] hover:border-[#B8D8BA]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#43373D]">{p.name}</span>
                        <span className="text-[10px] font-semibold text-[#69585F]">
                          {isAdminProfile ? "🛡️ Admin" : `🌾 ${p.landSize} Ac`}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#69585F] mt-1">
                        {p.district}, {p.state} • Main: {p.mainCrop}
                      </p>
                      <span className="mt-2 inline-block text-[10px] font-semibold text-[#69585F] underline">
                        Activate this profile →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* National Cost of Cultivation Standards */}
          <div className="mt-8 rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs">
            <h3 className="font-display text-base font-bold text-[#43373D] flex items-center gap-2 mb-4">
              <PieChart className="size-4 text-[#69585F]" />
              <span>Standard Cost-of-Cultivation Distribution (CACP Agricultural Benchmarks)</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { title: "Fertilizer & Nutrition", pct: "28%", desc: "DAP, Urea, MOP & Potash application" },
                { title: "Labour & Harvesting", pct: "24%", desc: "Weeding, spraying & combined harvesting" },
                { title: "Machinery & Fuel", pct: "18%", desc: "Tractor tilling, rotavator & threshing" },
                { title: "Quality Seeds", pct: "14%", desc: "Certified high-germination seed bags" },
                { title: "Irrigation & Power", pct: "10%", desc: "Tube-well electricity & canal charges" },
                { title: "Transport & Mandi", pct: "6%", desc: "Trolley freight & loading expenses" },
              ].map((c) => (
                <div key={c.title} className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-4 text-xs">
                  <span className="font-semibold text-[#69585F] block">{c.title}</span>
                  <p className="mt-1 font-display text-2xl font-bold text-[#43373D]">{c.pct}</p>
                  <span className="text-[10px] text-[#69585F]/80 mt-1 block">{c.desc}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/20 p-4 text-xs">
              <span className="font-bold text-[#43373D] block">
                Authoritative Net Farm Margin Formula:
              </span>
              <p className="text-[#69585F] mt-1">
                Net Profit = Total Harvest Sales (Harvested Quintals × Realized Mandi Price per Quintal) – Total Input Operational Expenses (Seed + Nutrients + Labour + Irrigation + Logistics).
              </p>
            </div>
          </div>
        </Section>
      </>
    );
  }

  // ==========================================
  // LOGGED-IN / ADMIN EXPENSES VIEW
  // ==========================================
  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={tr({ en: "Farm Expense & Profit Tracker", hi: "कृषि खर्च एवं लाभ ट्रैकर" })}
        body={tr({
          en: "Manage operational crop expenses, log harvest sales in quintals, and calculate authoritative net farm margin.",
          hi: "बीज, खाद, मजदूरी और सिंचाई के खर्चों का हिसाब रखें और फसल बिक्री से शुद्ध लाभ/हानि की सटीक गणना करें।",
        })}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => setExpenseModalOpen(true)}
            className="bg-[#69585F] text-white hover:bg-[#55464D] shadow-sm font-semibold cursor-pointer"
          >
            <Plus className="size-4 mr-1.5" />
            <span>{isAdmin ? "Log Expense (Admin)" : tr({ en: "Log Expense", hi: "खर्च दर्ज करें" })}</span>
          </Button>
          <Button
            onClick={() => setSaleModalOpen(true)}
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white cursor-pointer"
          >
            <TrendingUp className="size-4 mr-1.5 text-[#B8D8BA]" />
            <span>{isAdmin ? "Log Sale (Admin)" : tr({ en: "Log Harvest Sale", hi: "बिक्री दर्ज करें" })}</span>
          </Button>
        </div>
      </PageHeader>

      <Section>
        {feedbackMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/30 p-4 text-sm font-semibold text-[#43373D]">
            <CheckCircle2 className="size-5 text-[#69585F]" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Admin Operational Mode Banner */}
        {isAdmin && (
          <div className="mb-6 rounded-2xl border border-[#EF959D] bg-[#EF959D]/15 p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#EF959D] text-white shadow-xs">
                  <Shield className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-sm font-bold text-[#43373D]">
                      Administrator Mode — Cross-Farmer Financial Ledger & Profit Audit
                    </h2>
                    <span className="rounded-full bg-[#EF959D] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Full Ledger Access
                    </span>
                  </div>
                  <p className="text-xs text-[#69585F] mt-0.5">
                    As Krishi Adhikari, you can view and audit financial books across all farms, log subsidized fertilizer/seed costs, or record harvest mandi sales on behalf of farmers.
                  </p>
                </div>
              </div>

              {/* Farmer Switcher for Admin */}
              <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-xl border border-[#EF959D]/40 text-xs">
                <span className="font-semibold text-[#43373D] pl-2">Filter Farm:</span>
                <select
                  value={adminFarmerFilter}
                  onChange={(e) => setAdminFarmerFilter(e.target.value)}
                  className="rounded-lg border border-[#DCDFC8] bg-white px-2 py-1 text-xs font-semibold text-[#43373D]"
                >
                  <option value="all">All Registered Farms (3)</option>
                  {DEFAULT_FARMERS.filter((f) => f.role !== "admin").map((f) => (
                    <option key={f.phone} value={f.phone}>
                      {f.name} ({f.district}, {f.state})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Financial Summary KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Total Revenue */}
          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                {tr({ en: "Total Harvest Revenue", hi: "कुल फसल बिक्री" })}
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#B8D8BA]/40 text-[#43373D]">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-[#43373D]">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <span className="text-xs text-[#69585F]">{displayedSales.length} harvest sales</span>
          </div>

          {/* Total Expenses */}
          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                {tr({ en: "Total Expenses Incurred", hi: "कुल कृषि खर्च" })}
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#FCDDBC] text-[#5B4028]">
                <ArrowDownRight className="size-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-[#43373D]">
              ₹{totalExpense.toLocaleString("en-IN")}
            </p>
            <span className="text-xs text-[#69585F]">{displayedExpenses.length} input transactions</span>
          </div>

          {/* Net Margin */}
          <div
            className={`rounded-xl border p-5 shadow-xs ${
              netProfit >= 0
                ? "border-[#B8D8BA] bg-[#B8D8BA]/20"
                : "border-[#EF959D] bg-[#EF959D]/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#43373D]">
                {tr({ en: "Net Profit / Margin", hi: "शुद्ध लाभ / मार्जिन" })}
              </span>
              <span
                className={`flex size-8 items-center justify-center rounded-lg font-bold text-xs ${
                  netProfit >= 0 ? "bg-[#69585F] text-white" : "bg-[#D9534F] text-white"
                }`}
              >
                ₹
              </span>
            </div>
            <p
              className={`mt-3 font-display text-3xl font-bold ${
                netProfit >= 0 ? "text-[#43373D]" : "text-[#D9534F]"
              }`}
            >
              {netProfit >= 0 ? "+" : "-"}₹{Math.abs(netProfit).toLocaleString("en-IN")}
            </p>
            <span className="text-xs text-[#69585F]">
              Authoritative: Net = Revenue - Expenses
            </span>
          </div>
        </div>

        {/* Category Breakdown Cards */}
        <div className="mt-8 rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs">
          <h3 className="font-display text-base font-bold text-[#43373D] flex items-center gap-2 mb-4">
            <PieChart className="size-4 text-[#69585F]" />
            <span>Category-wise Expense Distribution</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { key: "seed", label: "Seeds (बीज)" },
              { key: "fertilizer", label: "Fertilizer (खाद)" },
              { key: "labour", label: "Labour (मजदूरी)" },
              { key: "irrigation", label: "Irrigation (सिंचाई)" },
              { key: "transportation", label: "Transport (परिवहन)" },
              { key: "other", label: "Other (अन्य)" },
            ].map(({ key, label }) => {
              const amount = categoryTotals[key as ExpenseCategory] || 0;
              const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
              return (
                <div key={key} className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-3 text-xs">
                  <span className="font-semibold text-[#69585F] truncate block">{label}</span>
                  <p className="mt-1 font-bold text-[#43373D] text-sm">₹{amount.toLocaleString("en-IN")}</p>
                  <span className="text-[10px] text-[#69585F]/80">{pct}% of total</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Controls: Expenses vs Harvest Sales */}
        <div className="mt-8">
          <div className="flex border-b border-[#DCDFC8] gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("expenses")}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === "expenses"
                  ? "border-b-2 border-[#69585F] text-[#43373D]"
                  : "text-[#69585F] hover:text-[#43373D]"
              }`}
            >
              Farm Expenses ({displayedExpenses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sales")}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === "sales"
                  ? "border-b-2 border-[#69585F] text-[#43373D]"
                  : "text-[#69585F] hover:text-[#43373D]"
              }`}
            >
              Harvest Sales ({displayedSales.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "expenses" ? (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-2.5 size-4 text-[#69585F]" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search expenses by crop or notes..."
                      className="pl-9 h-9 border-[#DCDFC8] bg-white text-xs"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-9 rounded-md border border-[#DCDFC8] bg-white px-3 text-xs text-[#43373D]"
                  >
                    <option value="all">All Categories</option>
                    <option value="seed">Seeds</option>
                    <option value="fertilizer">Fertilizers</option>
                    <option value="labour">Labour</option>
                    <option value="irrigation">Irrigation</option>
                    <option value="transportation">Transport</option>
                    <option value="equipment">Equipment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Expenses Table */}
                <div className="rounded-2xl border border-[#DCDFC8] bg-white overflow-hidden shadow-xs">
                  {displayedExpenses.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#69585F]">
                      No expense records found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8F9F3] text-[#69585F] uppercase border-b border-[#DCDFC8] font-bold">
                          <tr>
                            {isAdmin && <th className="px-4 py-3">Farmer</th>}
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Crop / Field</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Notes</th>
                            <th className="px-4 py-3 text-right">Amount (₹)</th>
                            <th className="px-4 py-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCDFC8]/60 text-[#43373D]">
                          {displayedExpenses.map((exp) => {
                            const expFarmer = DEFAULT_FARMERS.find((f) => f.phone === exp.farmerPhone);
                            return (
                              <tr key={exp.id} className="hover:bg-[#F8F9F3]/60 transition-colors">
                                {isAdmin && (
                                  <td className="px-4 py-3 whitespace-nowrap font-medium text-[#43373D]">
                                    <div className="flex items-center gap-1.5">
                                      <User className="size-3 text-[#69585F]" />
                                      <span>{expFarmer?.name || exp.farmerPhone}</span>
                                    </div>
                                    <span className="text-[10px] text-[#69585F] block">
                                      {expFarmer?.district || ""}
                                    </span>
                                  </td>
                                )}
                                <td className="px-4 py-3 whitespace-nowrap">{exp.date}</td>
                                <td className="px-4 py-3 font-semibold">{exp.cropName || "General Farm"}</td>
                                <td className="px-4 py-3 capitalize">
                                  <span className="inline-flex rounded-md bg-[#D9DBBC]/50 px-2 py-0.5 text-[11px] font-semibold text-[#43373D]">
                                    {exp.category}
                                  </span>
                                </td>
                                <td className="px-4 py-3 max-w-xs truncate text-[#69585F]">{exp.note || "—"}</td>
                                <td className="px-4 py-3 text-right font-bold text-[#43373D]">
                                  ₹{Number(exp.amount).toLocaleString("en-IN")}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteExpense(exp.id)}
                                    className="text-[#D9534F] hover:underline cursor-pointer"
                                    title="Delete expense"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Sales Table */}
                <div className="rounded-2xl border border-[#DCDFC8] bg-white overflow-hidden shadow-xs">
                  {displayedSales.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#69585F]">
                      No harvest sales recorded yet. Click "Log Harvest Sale" to record revenue.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8F9F3] text-[#69585F] uppercase border-b border-[#DCDFC8] font-bold">
                          <tr>
                            {isAdmin && <th className="px-4 py-3">Farmer</th>}
                            <th className="px-4 py-3">Sale Date</th>
                            <th className="px-4 py-3">Crop Sold</th>
                            <th className="px-4 py-3">Quantity (Quintals)</th>
                            <th className="px-4 py-3">Rate (₹/Quintal)</th>
                            <th className="px-4 py-3">Buyer / Mandi</th>
                            <th className="px-4 py-3 text-right">Total Revenue (₹)</th>
                            <th className="px-4 py-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCDFC8]/60 text-[#43373D]">
                          {displayedSales.map((sale) => {
                            const saleFarmer = DEFAULT_FARMERS.find((f) => f.phone === sale.farmerPhone);
                            return (
                              <tr key={sale.id} className="hover:bg-[#F8F9F3]/60 transition-colors">
                                {isAdmin && (
                                  <td className="px-4 py-3 whitespace-nowrap font-medium text-[#43373D]">
                                    <div className="flex items-center gap-1.5">
                                      <User className="size-3 text-[#69585F]" />
                                      <span>{saleFarmer?.name || sale.farmerPhone}</span>
                                    </div>
                                    <span className="text-[10px] text-[#69585F] block">
                                      {saleFarmer?.district || ""}
                                    </span>
                                  </td>
                                )}
                                <td className="px-4 py-3 whitespace-nowrap">{sale.saleDate}</td>
                                <td className="px-4 py-3 font-semibold">{sale.crop}</td>
                                <td className="px-4 py-3">{sale.quantityQuintals} qtl</td>
                                <td className="px-4 py-3">₹{Number(sale.pricePerQuintal).toLocaleString("en-IN")}</td>
                                <td className="px-4 py-3 text-[#69585F]">{sale.buyerName || "Mandi Trader"}</td>
                                <td className="px-4 py-3 text-right font-bold text-[#43373D]">
                                  ₹{Number(sale.totalAmount).toLocaleString("en-IN")}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSale(sale.id)}
                                    className="text-[#D9534F] hover:underline cursor-pointer"
                                    title="Delete sale"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Add Expense Modal */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#DCDFC8]">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
              <div className="flex items-center gap-2">
                {isAdmin && <Shield className="size-4 text-[#EF959D]" />}
                <h3 className="font-display font-bold text-[#43373D]">
                  {isAdmin ? "Log Farm Expense for Farmer (Admin)" : "Log New Farm Expense"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setExpenseModalOpen(false)}
                className="text-[#69585F] hover:bg-[#D9DBBC]/40 p-1 rounded-md cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="mt-4 space-y-3.5">
              {/* Admin Farmer selector */}
              {isAdmin && (
                <div className="space-y-1 bg-[#EF959D]/10 p-2.5 rounded-lg border border-[#EF959D]/30">
                  <Label className="text-xs font-bold text-[#43373D]">Assign to Farmer *</Label>
                  <select
                    value={expFarmerPhone}
                    onChange={(e) => setExpFarmerPhone(e.target.value)}
                    className="h-8 w-full rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
                  >
                    {DEFAULT_FARMERS.filter((f) => f.role !== "admin").map((f) => (
                      <option key={f.phone} value={f.phone}>
                        {f.name} ({f.district}, {f.state})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Crop / Field</Label>
                <Input
                  value={expCrop}
                  onChange={(e) => setExpCrop(e.target.value)}
                  placeholder="e.g. Wheat, Mustard, Paddy"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#43373D]">Category *</Label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                    className="h-9 w-full rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
                  >
                    <option value="seed">Seeds (बीज)</option>
                    <option value="fertilizer">Fertilizer (खाद)</option>
                    <option value="labour">Labour (मजदूरी)</option>
                    <option value="irrigation">Irrigation (सिंचाई)</option>
                    <option value="transportation">Transport (भाड़ा)</option>
                    <option value="equipment">Equipment (यंत्र)</option>
                    <option value="other">Other (अन्य)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#43373D]">Amount (INR ₹) *</Label>
                  <Input
                    type="number"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    placeholder="e.g. 4500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Expense Date *</Label>
                <Input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Optional Notes</Label>
                <Input
                  value={expNote}
                  onChange={(e) => setExpNote(e.target.value)}
                  placeholder="e.g. 2 bags of DAP from cooperative society"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCDFC8]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setExpenseModalOpen(false)}
                  className="border-[#DCDFC8] cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#69585F] text-white cursor-pointer">
                  Save Expense
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Harvest Sale Modal */}
      {saleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#DCDFC8]">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
              <div className="flex items-center gap-2">
                {isAdmin && <Shield className="size-4 text-[#EF959D]" />}
                <h3 className="font-display font-bold text-[#43373D]">
                  {isAdmin ? "Log Harvest Sale for Farmer (Admin)" : "Log Crop Harvest Sale"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSaleModalOpen(false)}
                className="text-[#69585F] hover:bg-[#D9DBBC]/40 p-1 rounded-md cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaleSubmit} className="mt-4 space-y-3.5">
              {/* Admin Farmer selector */}
              {isAdmin && (
                <div className="space-y-1 bg-[#EF959D]/10 p-2.5 rounded-lg border border-[#EF959D]/30">
                  <Label className="text-xs font-bold text-[#43373D]">Assign to Farmer *</Label>
                  <select
                    value={saleFarmerPhone}
                    onChange={(e) => setSaleFarmerPhone(e.target.value)}
                    className="h-8 w-full rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
                  >
                    {DEFAULT_FARMERS.filter((f) => f.role !== "admin").map((f) => (
                      <option key={f.phone} value={f.phone}>
                        {f.name} ({f.district}, {f.state})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Crop Sold *</Label>
                <Input
                  value={saleCrop}
                  onChange={(e) => setSaleCrop(e.target.value)}
                  placeholder="e.g. Wheat, Basmati Rice"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#43373D]">Quantity (Quintals) *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={saleQuintals}
                    onChange={(e) => setSaleQuintals(e.target.value)}
                    placeholder="e.g. 35"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#43373D]">Rate (₹ / Quintal) *</Label>
                  <Input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="e.g. 2275"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Total Revenue</Label>
                <div className="h-9 flex items-center px-3 rounded-md bg-[#F8F9F3] border border-[#DCDFC8] text-sm font-bold text-[#43373D]">
                  ₹
                  {(
                    Number(saleQuintals || 0) * Number(salePrice || 0)
                  ).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Sale Date *</Label>
                <Input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Buyer / Mandi Trader</Label>
                <Input
                  value={saleBuyer}
                  onChange={(e) => setSaleBuyer(e.target.value)}
                  placeholder="e.g. Karnal Grain Market Arhtiya"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCDFC8]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSaleModalOpen(false)}
                  className="border-[#DCDFC8] cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#69585F] text-white cursor-pointer">
                  Save Harvest Sale
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
