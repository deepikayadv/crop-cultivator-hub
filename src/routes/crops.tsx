import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Droplets, Layers, Sprout, Timer } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { crops, seasons, type Crop } from "@/data/farm-data";
import { PageHeader, Section } from "@/components/PageHeader";

export const Route = createFileRoute("/crops")({
  head: () => ({
    meta: [
      { title: "Crop Calendar — Best Time to Sow Each Crop | KisanMitra" },
      {
        name: "description",
        content:
          "Kharif, rabi and zaid sowing and harvest windows for paddy, wheat, mustard, cotton, gram and more, with water needs, soil type and field tips.",
      },
      { property: "og:title", content: "Crop Calendar — Best Time to Sow Each Crop" },
      {
        property: "og:description",
        content: "Sowing and harvest windows, water need, soil type and field tips for 10 crops.",
      },
    ],
  }),
  component: CropsPage,
});

function CropsPage() {
  const { t, tr } = useLanguage();
  const [season, setSeason] = useState<Crop["season"] | "all">("all");
  const month = new Date().getMonth() + 1;

  const list = useMemo(
    () => crops.filter((c) => season === "all" || c.season === season),
    [season],
  );

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={t("navCrops")}
        body={tr({
          en: "Sowing a week late can cost a fifth of your yield. Here is the window, water need and one field tip that matters most for each crop.",
          hi: "एक हफ़्ते की देरी से बुवाई उपज का पाँचवाँ हिस्सा घटा सकती है। हर फसल की अवधि, पानी की ज़रूरत और सबसे ज़रूरी सलाह यहाँ है।",
        })}
      />

      <Section>
        <div className="flex flex-wrap gap-2">
          <SeasonChip active={season === "all"} onClick={() => setSeason("all")}>
            {t("filterAll")}
          </SeasonChip>
          {seasons.map((s) => (
            <SeasonChip key={s.id} active={season === s.id} onClick={() => setSeason(s.id)}>
              {tr(s.label)} · {tr(s.window)}
            </SeasonChip>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {list.map((c) => {
            const sowNow = c.sowingMonths.includes(month);
            return (
              <article key={c.id} className="card-soft p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden>
                    {c.emoji}
                  </span>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-semibold">{tr(c.name)}</h2>
                    <p className="text-xs text-muted-foreground">
                      {t("season")}: {tr(seasons.find((s) => s.id === c.season)!.label)}
                    </p>
                  </div>
                  {sowNow ? (
                    <span className="rounded-full bg-harvest/25 px-2.5 py-1 text-xs font-medium text-harvest-foreground">
                      {t("bestNow")}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Fact icon={Sprout} label={t("sowing")} value={tr(c.sowing)} />
                  <Fact icon={Timer} label={t("harvest")} value={tr(c.harvest)} />
                  <Fact icon={Droplets} label={t("water")} value={tr(c.water)} />
                  <Fact icon={Layers} label={t("soil")} value={tr(c.soil)} />
                </div>

                <p className="mt-5 rounded-lg bg-secondary p-3 text-sm">
                  <span className="font-semibold">{t("tip")}: </span>
                  {tr(c.tip)}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t("duration")}: {c.durationDays} {tr({ en: "days", hi: "दिन" })}
                </p>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}

function SeasonChip({
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

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <div>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
