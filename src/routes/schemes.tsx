import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { schemeCategories, schemes, type Scheme } from "@/data/farm-data";
import { PageHeader, Section } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Government Schemes for Farmers — KisanMitra" },
      {
        name: "description",
        content:
          "PM-KISAN, Fasal Bima, Kisan Credit Card, solar pump and machinery subsidies — benefits, eligibility and documents explained in Hindi and English.",
      },
      { property: "og:title", content: "Government Schemes for Farmers — KisanMitra" },
      {
        property: "og:description",
        content: "Benefits, eligibility and documents for the main central farm schemes.",
      },
    ],
  }),
  component: SchemesPage,
});

function SchemesPage() {
  const { t, tr } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Scheme["category"] | "all">("all");

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
        body={
          tr({
            en: "Central schemes that put money, insurance or equipment in a farmer's hands. Check what you qualify for before your next visit to the block office.",
            hi: "वे केंद्रीय योजनाएँ जो किसान को पैसा, बीमा या यंत्र देती हैं। ब्लॉक कार्यालय जाने से पहले अपनी पात्रता देख लें।",
          })
        }
      />

      <Section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
              aria-label={t("search")}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
              {t("filterAll")}
            </FilterChip>
            {schemeCategories.map((c) => (
              <FilterChip
                key={c.id}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
              >
                {tr(c.label)}
              </FilterChip>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">{t("noResults")}</p>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {filtered.map((s) => (
              <article key={s.id} className="card-soft flex flex-col p-6">
                <h2 className="font-display text-lg font-semibold">{tr(s.name)}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{tr(s.summary)}</p>

                <dl className="mt-5 space-y-3 text-sm">
                  <Row label={t("benefit")} value={tr(s.benefit)} highlight />
                  <Row label={t("eligibility")} value={tr(s.eligibility)} />
                  <Row label={t("documents")} value={tr(s.documents)} />
                </dl>

                <p className="mt-5 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-primary">
                  <ExternalLink className="size-3.5" aria-hidden />
                  {t("applyAt")}: {s.portal}
                </p>
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className={highlight ? "mt-0.5 font-medium text-primary" : "mt-0.5"}>{value}</dd>
    </div>
  );
}
