import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownUp, Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { mandiRates } from "@/data/farm-data";
import { PageHeader, Section } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Mandi Prices Today — Crop Rates by Market | KisanMitra" },
      {
        name: "description",
        content:
          "Indicative modal rates per quintal for wheat, paddy, mustard, cotton, onion and more across major Indian mandis, with the day's price movement.",
      },
      { property: "og:title", content: "Mandi Prices Today — Crop Rates by Market" },
      {
        property: "og:description",
        content: "Sort and search modal crop rates across major Indian mandis.",
      },
    ],
  }),
  component: MarketPage,
});

type SortKey = "crop" | "price" | "changePct";

function MarketPage() {
  const { t, tr } = useLanguage();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = mandiRates.filter((r) =>
      q === ""
        ? true
        : `${r.crop.en} ${r.crop.hi} ${r.mandi.en} ${r.mandi.hi} ${r.state.en} ${r.state.hi}`
            .toLowerCase()
            .includes(q),
    );
    return [...filtered].sort((a, b) => {
      const dir = asc ? 1 : -1;
      if (sortKey === "crop") return dir * a.crop.en.localeCompare(b.crop.en);
      return dir * (a[sortKey] - b[sortKey]);
    });
  }, [query, sortKey, asc]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(key === "crop");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={t("navMarket")}
        body={tr({
          en: "Know the going rate before the trader quotes one. Modal prices per quintal from major mandis, updated every morning.",
          hi: "व्यापारी के भाव बताने से पहले बाज़ार का भाव जानें। प्रमुख मंडियों के प्रति क्विंटल मॉडल भाव, हर सुबह अपडेट।",
        })}
      />

      <Section>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${t("search")} — ${t("crop")} / ${t("mandi")}`}
              aria-label={t("search")}
              className="pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t("updated")}</p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-soft">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/60 text-left">
                <Th onClick={() => toggleSort("crop")}>{t("crop")}</Th>
                <th className="px-4 py-3 font-semibold">{t("mandi")}</th>
                <Th onClick={() => toggleSort("price")} align="right">
                  {t("price")}
                </Th>
                <Th onClick={() => toggleSort("changePct")} align="right">
                  {t("change")}
                </Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{tr(r.crop)}</td>
                  <td className="px-4 py-3">
                    <span>{tr(r.mandi)}</span>
                    <span className="block text-xs text-muted-foreground">{tr(r.state)}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    ₹{r.price.toLocaleString("en-IN")}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      r.changePct > 0
                        ? "text-primary"
                        : r.changePct < 0
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  >
                    {r.changePct > 0 ? "▲" : r.changePct < 0 ? "▼" : "—"}{" "}
                    {Math.abs(r.changePct).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">{t("noResults")}</p>
        ) : null}
      </Section>
    </>
  );
}

function Th({
  children,
  onClick,
  align = "left",
}: {
  children: React.ReactNode;
  onClick: () => void;
  align?: "left" | "right";
}) {
  return (
    <th className={`px-4 py-3 font-semibold ${align === "right" ? "text-right" : ""}`}>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 hover:text-primary ${
          align === "right" ? "flex-row-reverse" : ""
        }`}
      >
        {children}
        <ArrowDownUp className="size-3.5 opacity-60" aria-hidden />
      </button>
    </th>
  );
}
