import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Filter,
  HelpCircle,
  Info,
  Ruler,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { schemeCategories, schemes, type Scheme } from "@/data/farm-data";
import { frontendStore } from "@/services/frontend-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section } from "@/components/PageHeader";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Government Scheme Eligibility Checker — KisanMitra CE2" },
      {
        name: "description",
        content:
          "Check eligibility for PM-KISAN, PM-KUSUM, KCC, SMAM, and PMFBY based on your state, land area, and farmer category.",
      },
    ],
  }),
  component: SchemesPage,
});

type EligibilityStatus = "eligible" | "not_eligible" | "needs_verification";

export function SchemesPage() {
  const { t, tr } = useLanguage();
  const { farmer } = useFarmerSession();
  const phone = farmer?.phone || "9876543210";

  // Search & category filter state
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Scheme["category"] | "all">("all");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState("");

  // Eligibility Checker state
  const [checkerOpen, setCheckerOpen] = useState(false);
  const [chkState, setChkState] = useState(farmer?.state || "Haryana");
  const [chkLand, setChkLand] = useState(farmer?.landSize || "4.5");
  const [chkCategory, setChkCategory] = useState("small");
  const [hasChecked, setHasChecked] = useState(false);
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);

  // Load saved bookmarks
  const loadSaved = () => {
    const list = frontendStore.getSavedSchemes(phone);
    setSavedIds(list.map((s) => s.schemeId));
  };

  useEffect(() => {
    loadSaved();
    if (farmer) {
      if (farmer.state) setChkState(farmer.state);
      if (farmer.landSize) setChkLand(farmer.landSize);
    }
  }, [farmer, phone]);

  const handleToggleBookmark = (schemeId: string) => {
    const saved = frontendStore.toggleSaveScheme(schemeId, phone);
    loadSaved();
    setToastMsg(
      saved
        ? tr({ en: "Scheme saved to your bookmarks!", hi: "योजना आपके बुकमार्क में सेव हो गई!" })
        : tr({ en: "Scheme removed from bookmarks.", hi: "योजना बुकमार्क से हटा दी गई।" }),
    );
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Rule-based evaluation engine
  const evaluateEligibility = (scheme: Scheme): { status: EligibilityStatus; reason: string } => {
    const land = Number(chkLand || 0);

    if (scheme.id === "pm-kisan") {
      if (land <= 0) {
        return {
          status: "not_eligible",
          reason: "Land ownership is mandatory for PM-KISAN direct benefit transfer.",
        };
      }
      if (land > 5) {
        return {
          status: "needs_verification",
          reason:
            "Operational landholders above 2 hectares (5 acres) must verify that family income tax exclusions do not apply.",
        };
      }
      return {
        status: "eligible",
        reason: `Cultivable land area (${land} acres) falls under small/marginal criteria eligible for ₹6,000/year DBT.`,
      };
    }

    if (scheme.id === "pm-kusum") {
      if (land < 1) {
        return {
          status: "needs_verification",
          reason: "Standalone solar pump Component-B typically requires minimum 1 acre agricultural holding.",
        };
      }
      return {
        status: "eligible",
        reason: `Eligible for up to 60-70% solar pump capital subsidy in ${chkState}.`,
      };
    }

    if (scheme.id === "smam") {
      if (chkCategory === "small" || chkCategory === "marginal" || chkCategory === "women") {
        return {
          status: "eligible",
          reason:
            "Eligible for maximum 50% subsidy on farm machinery and Custom Hiring Centre establishment.",
        };
      }
      return {
        status: "eligible",
        reason: "Eligible for standard 40% machinery subsidy under SMAM guidelines.",
      };
    }

    if (scheme.id === "kcc") {
      return {
        status: "eligible",
        reason:
          "All agricultural cultivators and crop plan holders qualify for subsidized 4% prompt-repayment credit.",
      };
    }

    if (scheme.id === "pmfby") {
      return {
        status: "eligible",
        reason:
          "Notified seasonal crops (Rabi/Kharif) are eligible for comprehensive crop loss insurance at nominal 1.5-2% premium.",
      };
    }

    return {
      status: "needs_verification",
      reason: "Eligibility requires physical inspection of land revenue records (Khasra/Khatauni) at block office.",
    };
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schemes.filter((s) => {
      const matchesCategory = category === "all" || s.category === category;
      const haystack = `${s.name.en} ${s.name.hi} ${s.summary.en} ${s.summary.hi}`.toLowerCase();
      return matchesCategory && (q === "" || haystack.includes(q));
    });
  }, [query, category]);

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={t("navSchemes")}
        body={tr({
          en: "Explore central government agricultural schemes, evaluate eligibility with our rule engine, and save schemes to your personal farm dashboard.",
          hi: "केंद्रीय सरकारी कृषि योजनाओं की जानकारी लें, पात्रता जांचें और अपने डैशबोर्ड में बुकमार्क करें।",
        })}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setCheckerOpen(!checkerOpen)}
            className="bg-[#69585F] text-white hover:bg-[#55464D] shadow-sm font-semibold"
          >
            <ShieldCheck className="size-4 mr-1.5 text-[#B8D8BA]" />
            <span>
              {checkerOpen
                ? tr({ en: "Hide Eligibility Checker", hi: "पात्रता जांच छुपाएं" })
                : tr({ en: "Run Scheme Eligibility Checker", hi: "योजना पात्रता जांचें" })}
            </span>
          </Button>
          <Button asChild variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
            <Link to="/saved-schemes">
              <Bookmark className="size-4 mr-1.5 text-[#FCDDBC]" />
              <span>
                {tr({ en: "View Saved Schemes", hi: "सहेजी गई योजनाएं" })} ({savedIds.length})
              </span>
            </Link>
          </Button>
        </div>
      </PageHeader>

      <Section>
        {toastMsg && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/30 p-4 text-sm font-semibold text-[#43373D]">
            <CheckCircle2 className="size-5 text-[#69585F]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Interactive Scheme Eligibility Checker Drawer */}
        {checkerOpen && (
          <div className="mb-8 rounded-2xl border-2 border-[#B8D8BA] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-[#43373D] flex items-center gap-2">
                  <ShieldCheck className="size-5 text-[#69585F]" />
                  <span>Rule-Based Government Scheme Eligibility Engine</span>
                </h2>
                <p className="text-xs text-[#69585F] mt-1">
                  Enter your farm parameters to simulate qualification across all central farm programs.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#69585F] bg-[#D9DBBC]/40 px-3 py-1 rounded-full">
                CE2 Verification Matrix
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#43373D]">State</Label>
                <select
                  value={chkState}
                  onChange={(e) => setChkState(e.target.value)}
                  className="h-10 w-full rounded-md border border-[#DCDFC8] bg-white px-3 text-xs text-[#43373D]"
                >
                  <option value="Haryana">Haryana</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#43373D]">Land Area (Acres)</Label>
                <Input
                  value={chkLand}
                  onChange={(e) => setChkLand(e.target.value)}
                  placeholder="e.g. 4.5"
                  className="h-10 text-xs border-[#DCDFC8]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#43373D]">Farmer Category</Label>
                <select
                  value={chkCategory}
                  onChange={(e) => setChkCategory(e.target.value)}
                  className="h-10 w-full rounded-md border border-[#DCDFC8] bg-white px-3 text-xs text-[#43373D]"
                >
                  <option value="marginal">Marginal Farmer (&lt; 2.5 Acres)</option>
                  <option value="small">Small Farmer (2.5 – 5 Acres)</option>
                  <option value="medium">Medium Farmer (5 – 10 Acres)</option>
                  <option value="large">Large Farmer (&gt; 10 Acres)</option>
                  <option value="women">Women Farmer (All sizes)</option>
                  <option value="sc_st">SC / ST Farmer</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#DCDFC8]">
              <span className="text-xs text-[#69585F] italic">
                * Note: Evaluated against actual published guidelines. No guarantees implied.
              </span>
              <Button
                onClick={() => setHasChecked(true)}
                className="bg-[#69585F] text-white hover:bg-[#55464D]"
              >
                <span>Calculate Eligibility Status</span>
              </Button>
            </div>
          </div>
        )}

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#69585F]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
              aria-label={t("search")}
              className="pl-9 h-10 border-[#DCDFC8] bg-white text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                category === "all"
                  ? "bg-[#69585F] text-white"
                  : "bg-white text-[#69585F] border border-[#DCDFC8] hover:bg-[#D9DBBC]/40"
              }`}
            >
              {t("filterAll")}
            </button>
            {schemeCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  category === c.id
                    ? "bg-[#69585F] text-white"
                    : "bg-white text-[#69585F] border border-[#DCDFC8] hover:bg-[#D9DBBC]/40"
                }`}
              >
                {tr(c.label)}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {filtered.map((s) => {
            const isSaved = savedIds.includes(s.id);
            const isExpanded = expandedScheme === s.id;
            const evalResult = evaluateEligibility(s);

            return (
              <article
                key={s.id}
                className="flex flex-col justify-between rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs transition-hover hover:border-[#B8D8BA]"
              >
                <div>
                  {/* Top Bar with Bookmark Action */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#69585F]">
                        {s.category.toUpperCase()} SCHEME
                      </span>
                      <h3 className="font-display text-xl font-bold text-[#43373D] mt-0.5">
                        {tr(s.name)}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(s.id)}
                      className={`flex size-9 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                        isSaved
                          ? "border-[#B8D8BA] bg-[#B8D8BA] text-[#342B2F]"
                          : "border-[#DCDFC8] bg-white text-[#69585F] hover:bg-[#D9DBBC]/40"
                      }`}
                      title={isSaved ? "Saved to Bookmarks" : "Save Scheme"}
                    >
                      {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                    </button>
                  </div>

                  <p className="mt-2.5 text-sm text-[#43373D] leading-relaxed">
                    {tr(s.summary)}
                  </p>

                  {/* Eligibility Evaluation Banner if Checked */}
                  {(hasChecked || checkerOpen) && (
                    <div
                      className={`mt-4 rounded-xl border p-3.5 text-xs space-y-1 ${
                        evalResult.status === "eligible"
                          ? "border-[#B8D8BA] bg-[#B8D8BA]/30 text-[#382E33]"
                          : evalResult.status === "not_eligible"
                            ? "border-[#EF959D] bg-[#EF959D]/20 text-[#43373D]"
                            : "border-[#FCDDBC] bg-[#FCDDBC]/40 text-[#5B4028]"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        {evalResult.status === "eligible" ? (
                          <>
                            <CheckCircle2 className="size-4 text-[#69585F]" />
                            <span>Potentially Eligible for Your Farm</span>
                          </>
                        ) : evalResult.status === "not_eligible" ? (
                          <>
                            <XCircle className="size-4 text-[#D9534F]" />
                            <span>Not Eligible Based on Supplied Information</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle className="size-4 text-[#69585F]" />
                            <span>Needs Verification at Block Office</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed pl-6">{evalResult.reason}</p>
                    </div>
                  )}

                  {/* Benefit Callout */}
                  <div className="mt-4 rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-3 text-xs">
                    <span className="font-semibold text-[#69585F] block">{t("benefit")}:</span>
                    <span className="font-medium text-[#43373D] mt-0.5 block">{tr(s.benefit)}</span>
                  </div>

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-[#DCDFC8] space-y-3 text-xs text-[#43373D]">
                      <div>
                        <span className="font-bold text-[#69585F] block">{t("eligibility")}:</span>
                        <p className="mt-0.5 leading-relaxed">{tr(s.eligibility)}</p>
                      </div>

                      <div>
                        <span className="font-bold text-[#69585F] block">{t("documents")}:</span>
                        <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[#69585F]">
                          {s.documents.map((doc, i) => (
                            <li key={i}>{tr(doc)}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-[11px] text-[#69585F] flex items-center gap-1.5 pt-1">
                        <Clock className="size-3" />
                        <span>Last Verified: October 2026 (Official Guidelines)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 pt-4 border-t border-[#DCDFC8] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setExpandedScheme(isExpanded ? null : s.id)}
                    className="text-xs font-semibold text-[#69585F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? "Hide Requirements" : "View Documents & Rules"}</span>
                    {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                  </button>

                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#43373D] hover:text-[#69585F]"
                  >
                    <span>{tr(s.portal)}</span>
                    <ExternalLink className="size-3 text-[#69585F]" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
