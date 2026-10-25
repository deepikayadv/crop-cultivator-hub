import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Lock,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  User,
  UserCheck,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { frontendStore, DEFAULT_FARMERS } from "@/services/frontend-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/PageHeader";
import type { FarmerProfile } from "@/types/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Farmer & Admin Login — KisanMitra CE2" },
      {
        name: "description",
        content: "Sign in with Farmer or Administrator credentials to access personalized agricultural services.",
      },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters").max(60),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number starting with 6-9"),
  email: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
  village: z.string().trim().min(2, "Enter your village name").max(80),
  district: z.string().trim().min(2, "Enter your district").max(80),
  state: z.string().trim().min(2, "Enter your state").max(80),
  landSize: z
    .string()
    .trim()
    .min(1, "Enter land area in acres")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid number of acres (e.g., 4.5)"),
  soilType: z.string().min(1, "Select soil type"),
  waterAvailability: z.string().min(1, "Select water availability source"),
  mainCrop: z.string().optional().or(z.literal("")),
});

export function LoginPage() {
  const { t, tr } = useLanguage();
  const { signIn } = useFarmerSession();
  const navigate = useNavigate();

  // Mode: "credentials" for fast credentials login, "register" for creating full profile
  const [activeTab, setActiveTab] = useState<"credentials" | "register">("credentials");

  // Credentials input
  const [loginPhone, setLoginPhone] = useState("9876543210");
  const [loginPassword, setLoginPassword] = useState("farmer123");
  const [authError, setAuthError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Detailed registration form
  const [formData, setFormData] = useState({
    name: "Ramesh Kumar",
    phone: "9876543210",
    email: "ramesh.kumar@example.in",
    village: "Khairpur",
    district: "Karnal",
    state: "Haryana",
    landSize: "5.5",
    soilType: "alluvial",
    waterAvailability: "canal",
    mainCrop: "Wheat",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectPreset = (profile: FarmerProfile) => {
    setLoginPhone(profile.phone);
    setLoginPassword(profile.password || "farmer123");
    setAuthError("");
    setSuccessMsg("");
  };

  const handleDirectLogin = (profile: FarmerProfile) => {
    signIn(profile);
    const isAdmin = profile.phone === "9999999999" || profile.role === "admin";
    setSuccessMsg(
      isAdmin
        ? `Logged in as Administrator (${profile.name}). Redirecting to Admin Desk...`
        : `Logged in as ${profile.name}. Redirecting to Farmer Dashboard...`,
    );
    setTimeout(() => {
      void navigate({ to: isAdmin ? "/admin" : "/profile" });
    }, 450);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const authenticated = frontendStore.authenticate(loginPhone, loginPassword);
    if (!authenticated) {
      setAuthError("Invalid mobile number or password. Check the credentials below.");
      return;
    }

    signIn(authenticated);
    const isAdmin = authenticated.phone === "9999999999" || authenticated.role === "admin";
    setSuccessMsg(
      isAdmin
        ? `Welcome, Administrator (${authenticated.name})! Redirecting to Admin Desk...`
        : `Welcome back, ${authenticated.name}! Redirecting to Dashboard...`,
    );

    setTimeout(() => {
      void navigate({ to: isAdmin ? "/admin" : "/profile" });
    }, 450);
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[e.target.name];
        return copy;
      });
    }
  };

  const onRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = schema.safeParse(formData);

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0])] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    const newProfile: FarmerProfile = {
      phone: parsed.data.phone,
      name: parsed.data.name,
      email: parsed.data.email,
      village: parsed.data.village,
      district: parsed.data.district,
      state: parsed.data.state,
      landSize: parsed.data.landSize,
      soilType: parsed.data.soilType,
      waterAvailability: parsed.data.waterAvailability,
      mainCrop: parsed.data.mainCrop ?? "",
      role: parsed.data.phone === "9999999999" ? "admin" : "farmer",
      password: "farmer123",
    };

    signIn(newProfile);
    setSuccessMsg("Farmer profile saved successfully! Redirecting to Dashboard...");
    setTimeout(() => {
      void navigate({ to: "/profile" });
    }, 450);
  };

  return (
    <Section>
      <div className="mx-auto max-w-4xl">
        {/* Header Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#B8D8BA]/40 px-3.5 py-1 text-xs font-semibold text-[#43373D] border border-[#B8D8BA]">
            <Sprout className="size-3.5 text-[#69585F]" />
            <span>KisanMitra Continuous Evaluation 2 (CE2) Access</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#43373D] sm:text-4xl">
            {t("signInTitle")}
          </h1>
          <p className="mt-2 text-sm text-[#69585F] max-w-xl mx-auto">
            {tr({
              en: "Access personalized farmer services or the centralized admin portal with ready-to-test credentials below.",
              hi: "नीचे दिए गए 3 किसान और व्यवस्थापक क्रेडेंशियल्स के साथ साइन इन करें।",
            })}
          </p>
        </div>

        {/* 4 Official Profile & Credential Cards */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#43373D] flex items-center gap-2">
              <KeyRound className="size-4 text-[#69585F]" />
              <span>Available Evaluation Accounts & Credentials</span>
            </h2>
            <span className="text-xs text-[#69585F]">Click any card to log in instantly</span>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {DEFAULT_FARMERS.map((profile) => {
              const isAdmin = profile.phone === "9999999999" || profile.role === "admin";
              const isSelected = loginPhone === profile.phone;

              return (
                <div
                  key={profile.phone}
                  className={`relative rounded-2xl border p-4 text-left shadow-xs transition-all flex flex-col justify-between ${
                    isAdmin
                      ? "border-[#EF959D] bg-[#EF959D]/10 hover:border-[#EF959D]"
                      : isSelected
                      ? "border-[#69585F] bg-white ring-2 ring-[#B8D8BA]"
                      : "border-[#DCDFC8] bg-white hover:border-[#B8D8BA]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          isAdmin
                            ? "bg-[#EF959D] text-white"
                            : "bg-[#B8D8BA]/50 text-[#43373D]"
                        }`}
                      >
                        {isAdmin ? <ShieldCheck className="size-3" /> : <User className="size-3" />}
                        {isAdmin ? "Admin Portal" : "Farmer Profile"}
                      </span>
                      <span className="text-[11px] font-bold text-[#69585F]">
                        {profile.state}
                      </span>
                    </div>

                    <h3 className="mt-2.5 font-display text-base font-bold text-[#43373D]">
                      {profile.name}
                    </h3>
                    <p className="text-xs text-[#69585F]">
                      {isAdmin
                        ? "Central Agriculture Dept."
                        : `${profile.landSize} Acres • ${profile.mainCrop}`}
                    </p>

                    {/* Credential Box */}
                    <div className="mt-3 rounded-lg border border-[#DCDFC8] bg-[#F8F9F3] p-2.5 text-[11px] space-y-1 text-[#43373D]">
                      <div className="flex justify-between">
                        <span className="text-[#69585F]">User / Mobile:</span>
                        <code className="font-mono font-bold text-[#43373D]">{profile.phone}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69585F]">Password:</span>
                        <code className="font-mono font-bold text-[#43373D]">
                          {profile.password || "farmer123"}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#DCDFC8]/60 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleDirectLogin(profile)}
                      className={`w-full text-xs font-semibold h-8 cursor-pointer ${
                        isAdmin
                          ? "bg-[#69585F] text-white hover:bg-[#55464D]"
                          : "bg-[#69585F] text-white hover:bg-[#55464D]"
                      }`}
                    >
                      <UserCheck className="size-3.5 mr-1" />
                      1-Click Login
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Success or Error Messages */}
        {successMsg && (
          <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/30 p-3.5 text-sm font-semibold text-[#43373D]">
            <CheckCircle2 className="size-5 text-[#69585F]" />
            <span>{successMsg}</span>
          </div>
        )}

        {authError && (
          <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-[#EF959D] bg-[#EF959D]/20 p-3.5 text-sm font-semibold text-[#D9534F]">
            <ShieldAlert className="size-5 text-[#D9534F]" />
            <span>{authError}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="mt-8 flex justify-center border-b border-[#DCDFC8]">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("credentials")}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === "credentials"
                  ? "border-[#69585F] text-[#43373D]"
                  : "border-transparent text-[#69585F] hover:text-[#43373D]"
              }`}
            >
              <Lock className="size-4" />
              <span>Standard Login with Credentials</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === "register"
                  ? "border-[#69585F] text-[#43373D]"
                  : "border-transparent text-[#69585F] hover:text-[#43373D]"
              }`}
            >
              <Sprout className="size-4" />
              <span>Register New Farm Profile</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Standard Login Form */}
        {activeTab === "credentials" && (
          <form
            onSubmit={handleCredentialsSubmit}
            className="mt-6 mx-auto max-w-md rounded-2xl border border-[#DCDFC8] bg-white p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div>
              <Label className="text-xs font-semibold text-[#43373D] flex items-center gap-1.5">
                <Phone className="size-3.5 text-[#69585F]" />
                <span>Mobile Number / Username</span>
              </Label>
              <Input
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                placeholder="e.g. 9876543210 or 9999999999"
                className="mt-1 border-[#DCDFC8] h-10"
                required
              />
              <span className="text-[11px] text-[#69585F] mt-1 block">
                Use 9876543210, 9812345678, 9823456789 (Farmers) or 9999999999 (Admin)
              </span>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#43373D] flex items-center gap-1.5">
                <Lock className="size-3.5 text-[#69585F]" />
                <span>Password</span>
              </Label>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="e.g. farmer123 or admin123"
                className="mt-1 border-[#DCDFC8] h-10"
                required
              />
              <span className="text-[11px] text-[#69585F] mt-1 block">
                Demo passwords: <code>farmer123</code> for farmers, <code>admin123</code> for admin
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#69585F] text-white hover:bg-[#55464D] mt-2 cursor-pointer"
            >
              <span>Sign In with Credentials</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </form>
        )}

        {/* TAB 2: Register New Farm Profile Form */}
        {activeTab === "register" && (
          <form
            onSubmit={onRegisterSubmit}
            className="mt-6 rounded-2xl border border-[#DCDFC8] bg-white p-6 sm:p-8 shadow-xs space-y-5"
            noValidate
          >
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#69585F]/80 pb-2 border-b border-[#DCDFC8]">
                {tr({ en: "1. Personal Information", hi: "१. व्यक्तिगत जानकारी" })}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-xs font-semibold text-[#43373D]">
                    {t("name")} *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleRegisterChange}
                    className="mt-1 border-[#DCDFC8]"
                  />
                  {errors.name && <p className="text-xs text-[#D9534F] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-xs font-semibold text-[#43373D]">
                    {t("phone")} *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleRegisterChange}
                    className="mt-1 border-[#DCDFC8]"
                  />
                  {errors.phone && <p className="text-xs text-[#D9534F] mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#69585F]/80 pb-2 border-b border-[#DCDFC8]">
                {tr({ en: "2. Location & Farm Parameters", hi: "२. स्थान एवं खेत का विवरण" })}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="state" className="text-xs font-semibold text-[#43373D]">
                    State *
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleRegisterChange}
                    className="mt-1 border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label htmlFor="district" className="text-xs font-semibold text-[#43373D]">
                    District *
                  </Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleRegisterChange}
                    className="mt-1 border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label htmlFor="village" className="text-xs font-semibold text-[#43373D]">
                    Village *
                  </Label>
                  <Input
                    id="village"
                    name="village"
                    value={formData.village}
                    onChange={handleRegisterChange}
                    className="mt-1 border-[#DCDFC8]"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="landSize" className="text-xs font-semibold text-[#43373D]">
                    {t("landSize")} *
                  </Label>
                  <Input
                    id="landSize"
                    name="landSize"
                    value={formData.landSize}
                    onChange={handleRegisterChange}
                    className="mt-1 border-[#DCDFC8]"
                  />
                </div>

                <div>
                  <Label htmlFor="soilType" className="text-xs font-semibold text-[#43373D]">
                    Soil Type *
                  </Label>
                  <select
                    id="soilType"
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleRegisterChange}
                    className="mt-1 h-9 w-full rounded-md border border-[#DCDFC8] bg-white px-3 text-sm text-[#43373D]"
                  >
                    <option value="alluvial">Alluvial (जलोढ़)</option>
                    <option value="black">Black / Regur (काली)</option>
                    <option value="red">Red / Sandy Loam (लाल)</option>
                    <option value="sandy">Sandy (बलुई)</option>
                    <option value="clay">Clay (चिकनी)</option>
                    <option value="loamy">Loamy (दोमट)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="waterAvailability" className="text-xs font-semibold text-[#43373D]">
                    Irrigation Source *
                  </Label>
                  <select
                    id="waterAvailability"
                    name="waterAvailability"
                    value={formData.waterAvailability}
                    onChange={handleRegisterChange}
                    className="mt-1 h-9 w-full rounded-md border border-[#DCDFC8] bg-white px-3 text-sm text-[#43373D]"
                  >
                    <option value="canal">Canal (नहरी)</option>
                    <option value="borewell">Tubewell / Borewell</option>
                    <option value="drip">Drip / Micro-irrigation</option>
                    <option value="rainfed">Rainfed (वर्षा आधारित)</option>
                  </select>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#69585F] text-white hover:bg-[#55464D] mt-2 cursor-pointer"
            >
              <span>Save Profile & Open Dashboard</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </form>
        )}
      </div>
    </Section>
  );
}
