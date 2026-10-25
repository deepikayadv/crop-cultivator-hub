import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bookmark,
  ExternalLink,
  FileText,
  Search,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { schemes, type Scheme } from "@/data/farm-data";
import { frontendStore } from "@/services/frontend-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Section } from "@/components/PageHeader";

export const Route = createFileRoute("/saved-schemes")({
  head: () => ({
    meta: [
      { title: "Saved Schemes & Bookmarks — KisanMitra CE2" },
      { name: "description", content: "Access your bookmarked government agricultural subsidies and credit programs." },
    ],
  }),
  component: SavedSchemesPage,
});

export function SavedSchemesPage() {
  const { t, tr } = useLanguage();
  const { farmer } = useFarmerSession();
  const phone = farmer?.phone;

  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([]);
  const [query, setQuery] = useState("");

  const reloadSaved = () => {
    if (!phone) {
      setSavedSchemes([]);
      return;
    }
    const list = frontendStore.getSavedSchemes(phone);
    const matched = schemes.filter((s) => list.some((item) => item.schemeId === s.id));
    setSavedSchemes(matched);
  };

  useEffect(() => {
    reloadSaved();
  }, [phone]);

  const handleRemove = (schemeId: string) => {
    if (!phone) return;
    frontendStore.toggleSaveScheme(schemeId, phone);
    reloadSaved();
  };

  const filtered = savedSchemes.filter((s) => {
    const q = query.trim().toLowerCase();
    const haystack = `${s.name.en} ${s.name.hi} ${s.summary.en}`.toLowerCase();
    return q === "" || haystack.includes(q);
  });

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={tr({ en: "Saved Schemes & Subsidies", hi: "सहेजी गई सरकारी योजनाएँ" })}
        body={tr({
          en: "Your personally bookmarked central and state agricultural support programs, loan schemes, and solar equipment subsidies.",
          hi: "आपके द्वारा बुकमार्क की गई केंद्रीय और राज्य कृषि सहायता योजनाएं और ऋण विवरण।",
        })}
      >
        <Button asChild className="bg-[#69585F] text-white hover:bg-[#55464D]">
          <Link to="/schemes">
            <span>Explore All Schemes</span>
          </Link>
        </Button>
      </PageHeader>

      <Section>
        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 size-4 text-[#69585F]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search saved schemes..."
              className="pl-9 h-9 border-[#DCDFC8] bg-white text-xs"
            />
          </div>
          <span className="text-xs text-[#69585F]">
            Saved: <span className="font-bold text-[#43373D]">{filtered.length}</span> schemes
          </span>
        </div>

        {/* Content */}
        <div className="mt-6">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DCDFC8] bg-white p-12 text-center">
              <Bookmark className="mx-auto size-10 text-[#69585F]/50" />
              <h3 className="mt-3 font-display text-lg font-bold text-[#43373D]">
                {!farmer ? "Guest Mode — No Saved Schemes" : "No saved schemes found"}
              </h3>
              <p className="mt-1 text-xs text-[#69585F] max-w-sm mx-auto">
                {!farmer
                  ? "Sign in to save and access your bookmarked government agricultural subsidies and credit programs."
                  : "Browse government schemes and click the bookmark icon on any card to save it here for fast reference."}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                {!farmer && (
                  <Button asChild size="sm" className="bg-[#69585F] text-white">
                    <Link to="/login">Sign In with Phone</Link>
                  </Button>
                )}
                <Button asChild size="sm" variant="outline" className="border-[#DCDFC8]">
                  <Link to="/schemes">Browse Government Schemes</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {filtered.map((s) => (
                <article
                  key={s.id}
                  className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#69585F]">
                          {s.category.toUpperCase()}
                        </span>
                        <h3 className="font-display text-xl font-bold text-[#43373D] mt-0.5">
                          {tr(s.name)}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(s.id)}
                        className="text-[#D9534F] hover:bg-[#D9534F]/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-[#43373D]">{tr(s.summary)}</p>

                    <div className="mt-4 rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-3 text-xs">
                      <span className="font-semibold text-[#69585F] block">{t("benefit")}:</span>
                      <span className="font-medium text-[#43373D] mt-0.5 block">{tr(s.benefit)}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#DCDFC8] flex items-center justify-between">
                    <Link
                      to="/schemes"
                      className="text-xs font-semibold text-[#69585F] hover:underline"
                    >
                      Check Eligibility Rules →
                    </Link>

                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#43373D] hover:text-[#69585F]"
                    >
                      <span>{tr(s.portal)}</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
