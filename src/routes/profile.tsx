import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  CloudSun,
  Droplets,
  Edit3,
  FileText,
  IndianRupee,
  KeyRound,
  Layers,
  MapPin,
  PlusCircle,
  Ruler,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingDown,
  TrendingUp,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { crops, districtWeather, mandiRates, schemes } from "@/data/farm-data";
import { frontendStore, DEFAULT_FARMERS } from "@/services/frontend-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/PageHeader";
import type { CropPlan, ExpenseEntry, SaleEntry } from "@/types/domain";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard & Profile — KisanMitra CE2" },
      {
        name: "description",
        content:
          "Personalized farm dashboard with live KPI stats, active crop plans, net profit and loss, weather snapshot, and farm parameters.",
      },
    ],
  }),
  component: ProfilePage,
});

export function ProfilePage() {
  const { t, tr } = useLanguage();
  const { farmer, ready, signIn, update, signOut, isAdmin } = useFarmerSession();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    village: "",
    district: "",
    state: "",
    landSize: "",
    soilType: "alluvial",
    waterAvailability: "canal",
    mainCrop: "",
  });

  // Local reactive state for dashboard metrics
  const [plans, setPlans] = useState<CropPlan[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sync state from frontend store
  const refreshData = () => {
    if (!farmer) {
      setPlans([]);
      setExpenses([]);
      setSales([]);
      setSavedCount(0);
      setUnreadCount(0);
      return;
    }
    const p = frontendStore.getPlans(farmer.phone);
    const ex = frontendStore.getExpenses(farmer.phone);
    const sl = frontendStore.getSales(farmer.phone);
    const sv = frontendStore.getSavedSchemes(farmer.phone);
    const nt = frontendStore.getNotifications(farmer.phone);

    setPlans(p);
    setExpenses(ex);
    setSales(sl);
    setSavedCount(sv.length);
    setUnreadCount(nt.filter((n) => !n.read).length);
  };

  useEffect(() => {
    if (farmer) {
      setEditForm({
        name: farmer.name || "",
        phone: farmer.phone || "",
        email: farmer.email || "",
        village: farmer.village || "",
        district: farmer.district || "Karnal",
        state: farmer.state || "Haryana",
        landSize: farmer.landSize || "4.5",
        soilType: farmer.soilType || "alluvial",
        waterAvailability: farmer.waterAvailability || "canal",
        mainCrop: farmer.mainCrop || "Wheat",
      });
      refreshData();
    } else {
      setPlans([]);
      setExpenses([]);
      setSales([]);
      setSavedCount(0);
      setUnreadCount(0);
    }
  }, [farmer]);

  if (!ready) {
    return (
      <Section>
        <div className="py-20 text-center text-sm text-[#69585F]">
          Loading portal status...
        </div>
      </Section>
    );
  }

  // ==========================================
  // GUEST MODE VIEW (When logged out / no account active)
  // ==========================================
  if (!farmer) {
    return (
      <>
        {/* Canopy Banner - Generic Guest Mode */}
        <div className="surface-canopy">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:py-12 sm:px-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                <Sprout className="size-3.5 text-[#B8D8BA]" />
                <span>KisanMitra • Generic Platform Overview (Guest Mode)</span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Generic Agricultural Platform
              </h1>
              <p className="mt-2 text-sm text-white/80 max-w-2xl leading-relaxed">
                You are currently exploring KisanMitra in guest mode. No individual farmer account is active, so personal farm records, crop allocations, and financial books are kept blank. Sign in below or pick an evaluation profile to test full personalized capabilities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-[#B8D8BA] text-[#43373D] hover:bg-[#a6cca8]">
                <Link to="/login">
                  <span>Sign In with Credentials</span>
                  <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Section>
          {/* 4 One-Click Demo Accounts to Sign In */}
          <div className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCDFC8] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#43373D] flex items-center gap-2">
                  <KeyRound className="size-5 text-[#69585F]" />
                  <span>Evaluation Accounts (1-Click Instant Activation)</span>
                </h2>
                <p className="text-xs text-[#69585F] mt-0.5">
                  Click any profile to immediately sign in and view their personal dashboard and farm records.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#69585F] bg-[#D9DBBC]/40 px-3 py-1 rounded-full">
                4 Active Profiles Ready
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DEFAULT_FARMERS.map((p) => {
                const isAdminProfile = p.phone === "9999999999" || p.role === "admin";
                return (
                  <div
                    key={p.phone}
                    className={`rounded-xl border p-4 shadow-xs flex flex-col justify-between transition-hover ${
                      isAdminProfile
                        ? "border-[#EF959D] bg-[#EF959D]/10 hover:border-[#EF959D]"
                        : "border-[#DCDFC8] bg-[#F8F9F3] hover:border-[#B8D8BA]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            isAdminProfile
                              ? "bg-[#EF959D] text-white"
                              : "bg-[#B8D8BA]/60 text-[#43373D]"
                          }`}
                        >
                          {isAdminProfile ? "🛡️ Administrator" : "🌾 Farmer"}
                        </span>
                        <span className="text-[11px] font-semibold text-[#69585F]">{p.state}</span>
                      </div>

                      <h3 className="mt-2 font-display text-base font-bold text-[#43373D]">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#69585F]">
                        {isAdminProfile ? "Central Agriculture Dept." : `${p.landSize} Acres • ${p.mainCrop}`}
                      </p>

                      <div className="mt-2.5 rounded-lg border border-[#DCDFC8] bg-white p-2 text-[11px] text-[#43373D]">
                        <div>User: <code className="font-mono font-bold">{p.phone}</code></div>
                        <div>Pass: <code className="font-mono font-bold">{p.password || "farmer123"}</code></div>
                      </div>
                    </div>

                    <Button
                      onClick={() => signIn(p)}
                      size="sm"
                      className="w-full mt-3 bg-[#69585F] text-white hover:bg-[#55464D] text-xs h-8 cursor-pointer"
                    >
                      <UserCheck className="size-3.5 mr-1" />
                      <span>Log in as {p.name.split(" ")[0]}</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generic Agricultural Platform Highlights */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                Major National Crops
              </span>
              <p className="mt-2 font-display text-2xl font-bold text-[#43373D]">10 Staples</p>
              <p className="mt-1 text-xs text-[#69585F]">Paddy, Wheat, Mustard, Gram, Cotton, Sugarcane</p>
              <Link to="/crops" className="mt-3 inline-block text-xs font-semibold text-[#69585F] hover:underline">
                View Crop Calendar →
              </Link>
            </div>

            <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                Welfare Schemes
              </span>
              <p className="mt-2 font-display text-2xl font-bold text-[#43373D]">8 Schemes</p>
              <p className="mt-1 text-xs text-[#69585F]">PM-KISAN, PMFBY, KCC, SMAM, PM-KUSUM</p>
              <Link to="/schemes" className="mt-3 inline-block text-xs font-semibold text-[#69585F] hover:underline">
                Explore Schemes →
              </Link>
            </div>

            <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                Benchmark Mandis
              </span>
              <p className="mt-2 font-display text-2xl font-bold text-[#43373D]">12 APMCs</p>
              <p className="mt-1 text-xs text-[#69585F]">Modal rates, price movements, and spreads</p>
              <Link to="/market" className="mt-3 inline-block text-xs font-semibold text-[#69585F] hover:underline">
                Check Mandi Prices →
              </Link>
            </div>

            <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                Agro-Advisories
              </span>
              <p className="mt-2 font-display text-2xl font-bold text-[#43373D]">7-Day Forecast</p>
              <p className="mt-1 text-xs text-[#69585F]">District spray windows & pest alerts</p>
              <Link to="/weather" className="mt-3 inline-block text-xs font-semibold text-[#69585F] hover:underline">
                View Weather Desk →
              </Link>
            </div>
          </div>
        </Section>
      </>
    );
  }

  // ==========================================
  // LOGGED-IN VIEW (Personalized Farmer or Admin)
  // ==========================================

  // Calculate authoritative financial metrics for logged-in user
  const totalExpense = expenses
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalRevenue = sales.reduce((s, e) => s + Number(e.totalAmount || 0), 0);
  const netProfit = totalRevenue - totalExpense;

  // Weather for farmer's district
  const matchedWeather =
    districtWeather.find((w) => w.district.en.toLowerCase() === (farmer.district || "").toLowerCase()) ||
    districtWeather[0]!;

  // Matched crop details
  const activeCrop = crops.find(
    (c) => c.name.en.toLowerCase() === (farmer.mainCrop || "").toLowerCase(),
  );

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update(editForm);
    setEditOpen(false);
    refreshData();
  };

  return (
    <>
      {/* Canopy Banner */}
      <div className="surface-canopy">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:py-12 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-[#B8D8BA] font-display text-2xl font-bold text-[#43373D] shadow-sm">
              {farmer.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {farmer.name}
                </h1>
                {(isAdmin || farmer.phone === "9999999999" || farmer.role === "admin") && (
                  <span className="rounded-full bg-[#EF959D] px-2.5 py-0.5 text-xs font-semibold text-white">
                    Administrator
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-white/80 sm:text-sm flex flex-wrap items-center gap-2">
                <span>+91 {farmer.phone}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-[#B8D8BA]" />
                  {farmer.village}, {farmer.district || "Karnal"}, {farmer.state || "Haryana"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {(isAdmin || farmer.phone === "9999999999" || farmer.role === "admin") && (
              <Button asChild size="sm" className="bg-[#EF959D] text-white hover:bg-[#d67b83]">
                <Link to="/admin">
                  <Shield className="size-3.5 mr-1.5" />
                  <span>Admin Management Desk</span>
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white cursor-pointer"
            >
              <Edit3 className="size-3.5 mr-1.5" />
              <span>{tr({ en: "Edit Profile", hi: "प्रोफ़ाइल बदलें" })}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                signOut();
                void navigate({ to: "/" });
              }}
              className="border-white/40 bg-white/10 text-white hover:bg-[#D9534F] hover:text-white hover:border-[#D9534F] cursor-pointer"
            >
              <span>{t("signOut")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Evaluation Quick-Switch Bar */}
      <div className="border-b border-[#DCDFC8] bg-[#F8F9F3] py-2.5 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#69585F]">
            <Sparkles className="size-3.5 text-[#69585F]" />
            <span className="font-semibold text-[#43373D]">Evaluation Quick-Switch:</span>
            <span>Switch between 3 Farmer Profiles & Admin</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {DEFAULT_FARMERS.map((p) => {
              const active = farmer.phone === p.phone;
              const isAdminProfile = p.phone === "9999999999" || p.role === "admin";
              return (
                <button
                  key={p.phone}
                  type="button"
                  onClick={() => {
                    signIn(p);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? "bg-[#69585F] text-white shadow-xs font-bold"
                      : isAdminProfile
                      ? "bg-[#EF959D]/20 text-[#69585F] border border-[#EF959D]/40 hover:bg-[#EF959D]/30"
                      : "bg-white text-[#69585F] border border-[#DCDFC8] hover:bg-[#D9DBBC]/50"
                  }`}
                >
                  {isAdminProfile ? "🛡️ " : "🌾 "}
                  {p.name.split(" ")[0]} ({p.state})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Section>
        {/* Authoritative Financial & Dashboard KPI Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Active Crop Plans */}
          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs transition-hover hover:border-[#B8D8BA]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                {tr({ en: "Active Plans", hi: "सक्रिय फसलें" })}
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#B8D8BA]/30 text-[#43373D]">
                <Layers className="size-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-[#43373D]">
              {plans.filter((p) => p.status !== "harvested" && p.status !== "cancelled").length}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-[#69585F]">{plans.length} total planned</span>
              <Link to="/planner" className="font-semibold text-[#69585F] hover:underline">
                View Planner →
              </Link>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs transition-hover hover:border-[#B8D8BA]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                {tr({ en: "Crop Sales Revenue", hi: "कुल फसल बिक्री" })}
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#B8D8BA]/40 text-[#43373D]">
                <TrendingUp className="size-4 text-[#43373D]" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-[#43373D]">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-[#69585F]">{sales.length} sales recorded</span>
              <Link to="/expenses" className="font-semibold text-[#69585F] hover:underline">
                Sales log →
              </Link>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs transition-hover hover:border-[#B8D8BA]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                {tr({ en: "Farm Input Expenses", hi: "कुल इनपुट खर्च" })}
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#FCDDBC]/50 text-[#43373D]">
                <IndianRupee className="size-4 text-[#43373D]" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-[#43373D]">
              ₹{totalExpense.toLocaleString("en-IN")}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-[#69585F]">{expenses.length} expense items</span>
              <Link to="/expenses" className="font-semibold text-[#69585F] hover:underline">
                Expenses →
              </Link>
            </div>
          </div>

          {/* Net Profit / Loss */}
          <div
            className={`rounded-xl border p-5 shadow-xs transition-hover ${
              netProfit >= 0
                ? "border-[#B8D8BA] bg-[#B8D8BA]/20"
                : "border-[#EF959D] bg-[#EF959D]/15"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#43373D]">
                {tr({ en: "Net Farm Margin", hi: "शुद्ध कृषि लाभ/हानि" })}
              </span>
              <span
                className={`flex size-8 items-center justify-center rounded-lg font-bold text-xs ${
                  netProfit >= 0
                    ? "bg-[#69585F] text-white"
                    : "bg-[#D9534F] text-white"
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
            <p className="mt-2 text-xs text-[#69585F]">
              Formula: Total Revenue - Total Expenses
            </p>
          </div>
        </div>

        {/* Farm Parameters Grid & Weather Snapshot */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Farm Parameters Card */}
          <div className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#43373D]">
                  {tr({ en: "Registered Farm Parameters", hi: "पंजीकृत कृषि मापदंड" })}
                </h2>
                <p className="text-xs text-[#69585F]">
                  {tr({
                    en: "Used to determine government scheme eligibility and crop suitability.",
                    hi: "सरकारी योजना पात्रता और फसल उपयुक्तता निर्धारित करने के लिए प्रयुक्त।",
                  })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="border-[#DCDFC8] text-xs hover:bg-[#D9DBBC]/40 cursor-pointer"
              >
                <Edit3 className="size-3 mr-1" />
                Edit
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-4">
                <span className="text-xs text-[#69585F] font-medium flex items-center gap-1.5">
                  <Ruler className="size-3.5 text-[#69585F]" />
                  {t("landSize")}
                </span>
                <p className="mt-1 font-display text-xl font-bold text-[#43373D]">
                  {farmer.landSize} Acres
                </p>
                <span className="mt-1 inline-block text-[11px] font-semibold text-[#69585F]">
                  Category: {Number(farmer.landSize) <= 2.5 ? "Marginal" : Number(farmer.landSize) <= 5 ? "Small" : "Medium/Large"} Farmer
                </span>
              </div>

              <div className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-4">
                <span className="text-xs text-[#69585F] font-medium flex items-center gap-1.5">
                  <Sprout className="size-3.5 text-[#69585F]" />
                  {t("soil")}
                </span>
                <p className="mt-1 font-display text-xl font-bold text-[#43373D] capitalize">
                  {farmer.soilType} Soil
                </p>
                <span className="mt-1 inline-block text-[11px] text-[#69585F]">
                  High fertility index with good organic drainage
                </span>
              </div>

              <div className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-4">
                <span className="text-xs text-[#69585F] font-medium flex items-center gap-1.5">
                  <Droplets className="size-3.5 text-[#69585F]" />
                  {t("water")}
                </span>
                <p className="mt-1 font-display text-xl font-bold text-[#43373D] capitalize">
                  {farmer.waterAvailability}
                </p>
                <span className="mt-1 inline-block text-[11px] text-[#69585F]">
                  Assured seasonal irrigation source
                </span>
              </div>

              <div className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-4">
                <span className="text-xs text-[#69585F] font-medium flex items-center gap-1.5">
                  <Sprout className="size-3.5 text-[#69585F]" />
                  {t("mainCrop")}
                </span>
                <p className="mt-1 font-display text-xl font-bold text-[#43373D]">
                  {activeCrop ? tr(activeCrop.name) : farmer.mainCrop || "Wheat"}
                </p>
                <span className="mt-1 inline-block text-[11px] text-[#69585F]">
                  {activeCrop ? `${tr(activeCrop.sowing)} • ${activeCrop.durationDays} ${tr({ en: "days", hi: "दिन" })}` : "Seasonal staple"}
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Button asChild size="sm" className="bg-[#69585F] text-white hover:bg-[#55464D]">
                <Link to="/planner">
                  <PlusCircle className="size-3.5 mr-1.5" />
                  <span>{tr({ en: "New Crop Plan", hi: "नई फसल जोड़ें" })}</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-[#DCDFC8] hover:bg-[#D9DBBC]/40">
                <Link to="/expenses">
                  <IndianRupee className="size-3.5 mr-1.5" />
                  <span>{tr({ en: "Record Expense", hi: "खर्च दर्ज करें" })}</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-[#DCDFC8] hover:bg-[#D9DBBC]/40">
                <Link to="/schemes">
                  <FileText className="size-3.5 mr-1.5" />
                  <span>{tr({ en: "Check Eligibility", hi: "पात्रता जांचें" })}</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-[#DCDFC8] hover:bg-[#D9DBBC]/40">
                <Link to="/recommendations">
                  <Sparkles className="size-3.5 mr-1.5 text-[#B8D8BA]" />
                  <span>{tr({ en: "Crop Advisor", hi: "फसल सुझाव" })}</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* District Weather & Spray Status Snapshot */}
          <div className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#43373D] flex items-center gap-2">
                  <CloudSun className="size-4 text-[#69585F]" />
                  <span>District Agro-Weather</span>
                </h3>
                <span className="text-xs text-[#69585F] font-semibold">
                  {tr(matchedWeather.district)}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="font-display text-4xl font-bold text-[#43373D]">
                    {matchedWeather.forecast[0]?.tempMax}°C
                  </span>
                  <span className="block text-xs text-[#69585F] mt-1">
                    Min {matchedWeather.forecast[0]?.tempMin}°C • {tr(matchedWeather.forecast[0]?.condition || { en: "Clear", hi: "साफ" })}
                  </span>
                </div>
                <span className="text-4xl">{matchedWeather.forecast[0]?.icon === "rain" ? "🌧️" : "☀️"}</span>
              </div>

              {/* Spray Window Status */}
              <div className="mt-5 rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/20 p-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#43373D]">
                  <CheckCircle2 className="size-4 text-[#69585F]" />
                  <span>Farming & Spray Window: Favorable</span>
                </div>
                <p className="mt-1 text-[11px] text-[#69585F]">
                  Wind speed &lt; 12 km/h. Suitable for foliar nutrition and weedicide application today.
                </p>
              </div>

              {/* Saved Schemes & Notifications Counts */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <Link
                  to="/saved-schemes"
                  className="rounded-lg border border-[#DCDFC8] p-2 hover:bg-[#D9DBBC]/40 transition-colors"
                >
                  <span className="font-bold text-base text-[#43373D]">{savedCount}</span>
                  <span className="block text-[10px] text-[#69585F]">Saved Schemes</span>
                </Link>
                <Link
                  to="/notifications"
                  className="rounded-lg border border-[#DCDFC8] p-2 hover:bg-[#D9DBBC]/40 transition-colors"
                >
                  <span className="font-bold text-base text-[#43373D]">{unreadCount}</span>
                  <span className="block text-[10px] text-[#69585F]">Unread Alerts</span>
                </Link>
              </div>
            </div>

            <Link
              to="/weather"
              className="block text-center text-xs font-semibold text-[#69585F] hover:underline pt-2 border-t border-[#DCDFC8]"
            >
              View 7-Day District Advisory →
            </Link>
          </div>
        </div>

        {/* Active Crop Plans Progress List */}
        <div className="mt-8 rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-[#43373D]">
                {tr({ en: "Active Crop Progress & Milestones", hi: "सक्रिय फसल प्रगति एवं चरण" })}
              </h3>
              <p className="text-xs text-[#69585F]">
                {tr({
                  en: "Growth stage progression from sowing through maturity and harvest.",
                  hi: "बुवाई से लेकर कटाई तक की विकास अवस्थाएं।",
                })}
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="border-[#DCDFC8] text-xs">
              <Link to="/planner">Manage in Planner →</Link>
            </Button>
          </div>

          <div className="mt-4 divide-y divide-[#DCDFC8]/60">
            {plans.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#69585F]">
                No crop plans logged yet. Click "New Crop Plan" above to create one.
              </div>
            ) : (
              plans.map((p) => {
                const pct = p.stageProgress ?? 50;
                return (
                  <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-[#43373D]">
                          {p.crop}
                        </span>
                        <span className="rounded-full bg-[#B8D8BA]/40 px-2 py-0.5 text-[10px] font-bold uppercase text-[#43373D]">
                          {p.season}
                        </span>
                        <span className="text-xs text-[#69585F]">
                          • {p.areaAcres} Acres
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#69585F] capitalize">
                        {p.status} ({pct}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#D9DBBC]/40">
                      <div
                        className="h-full bg-[#B8D8BA] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#69585F]">
                      <span>Sown: {p.sowingDate}</span>
                      <span>Target Harvest: {p.expectedHarvestDate || "April 2027"}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Section>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
              <h3 className="font-display text-lg font-bold text-[#43373D]">
                Edit Registered Profile
              </h3>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="text-[#69585F] hover:text-[#43373D] cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Full Name</Label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Mobile Number</Label>
                  <Input
                    value={editForm.phone}
                    disabled
                    className="mt-1 h-8 text-xs border-[#DCDFC8] bg-[#F8F9F3]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">State</Label>
                  <Input
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">District</Label>
                  <Input
                    value={editForm.district}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Village</Label>
                  <Input
                    value={editForm.village}
                    onChange={(e) => setEditForm({ ...editForm, village: e.target.value })}
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Land (Acres)</Label>
                  <Input
                    value={editForm.landSize}
                    onChange={(e) => setEditForm({ ...editForm, landSize: e.target.value })}
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Soil Type</Label>
                  <select
                    value={editForm.soilType}
                    onChange={(e) => setEditForm({ ...editForm, soilType: e.target.value })}
                    className="mt-1 h-8 w-full rounded-md border border-[#DCDFC8] bg-white px-2 text-xs text-[#43373D]"
                  >
                    <option value="alluvial">Alluvial</option>
                    <option value="black">Black</option>
                    <option value="red">Red</option>
                    <option value="sandy">Sandy</option>
                    <option value="clay">Clay</option>
                    <option value="loamy">Loamy</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Irrigation</Label>
                  <select
                    value={editForm.waterAvailability}
                    onChange={(e) => setEditForm({ ...editForm, waterAvailability: e.target.value })}
                    className="mt-1 h-8 w-full rounded-md border border-[#DCDFC8] bg-white px-2 text-xs text-[#43373D]"
                  >
                    <option value="canal">Canal</option>
                    <option value="borewell">Borewell</option>
                    <option value="drip">Drip</option>
                    <option value="rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCDFC8]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditOpen(false)}
                  className="border-[#DCDFC8] text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#69585F] text-white hover:bg-[#55464D] text-xs h-8"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
