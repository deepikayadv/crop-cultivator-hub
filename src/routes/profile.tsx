import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MapPin, Ruler, Sprout } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { advisories, crops, districtWeather, mandiRates, schemes } from "@/data/farm-data";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/PageHeader";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Farm Profile — KisanMitra" },
      {
        name: "description",
        content:
          "Your saved village, land size and main crop, with the schemes, mandi rates and advisories that match your farm.",
      },
      { property: "og:title", content: "My Farm Profile — KisanMitra" },
      {
        property: "og:description",
        content: "Personalised schemes, mandi rates and advisories for your farm.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t, tr } = useLanguage();
  const { farmer, ready, signOut } = useFarmerSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !farmer) void navigate({ to: "/login", replace: true });
  }, [ready, farmer, navigate]);

  if (!ready || !farmer) {
    return (
      <Section>
        <p className="text-sm text-muted-foreground">…</p>
      </Section>
    );
  }

  const crop = crops.find((c) => c.name.en === farmer.mainCrop);
  const rate = mandiRates.find((r) => r.crop.en === (crop?.name.en ?? ""));
  const weather = districtWeather[0]!;

  return (
    <>
      <div className="surface-canopy">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-4 py-12">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary-foreground/15 font-display text-2xl font-semibold">
            {farmer.name.charAt(0).toUpperCase()}
          </span>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-semibold">{farmer.name}</h1>
            <p className="mt-1 text-sm opacity-85">+91 {farmer.phone}</p>
          </div>
          <Button
            variant="outline"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={() => {
              signOut();
              void navigate({ to: "/", replace: true });
            }}
          >
            {t("signOut")}
          </Button>
        </div>
      </div>

      <Section>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat icon={MapPin} label={t("village")} value={farmer.village} />
          <Stat icon={Ruler} label={t("landSize")} value={farmer.landSize || "—"} />
          <Stat icon={Sprout} label={t("mainCrop")} value={crop ? tr(crop.name) : "—"} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {crop ? (
            <article className="card-soft p-6">
              <h2 className="font-display text-lg font-semibold">
                {tr(crop.name)} · {t("navCrops")}
              </h2>
              <p className="mt-2 text-sm">
                <span className="font-medium">{t("sowing")}:</span> {tr(crop.sowing)}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">{t("harvest")}:</span> {tr(crop.harvest)}
              </p>
              <p className="mt-3 rounded-lg bg-secondary p-3 text-sm">
                <span className="font-semibold">{t("tip")}: </span>
                {tr(crop.tip)}
              </p>
              {rate ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  {t("navMarket")} · {tr(rate.mandi)}:{" "}
                  <span className="font-semibold text-foreground">
                    ₹{rate.price.toLocaleString("en-IN")}
                  </span>
                </p>
              ) : null}
            </article>
          ) : (
            <article className="card-soft p-6">
              <h2 className="font-display text-lg font-semibold">{t("navCrops")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {tr({
                  en: "Pick a main crop while signing in to see a calendar and price tuned to your farm.",
                  hi: "साइन इन करते समय मुख्य फसल चुनें — आपके खेत के अनुसार कैलेंडर और भाव दिखेगा।",
                })}
              </p>
              <Button asChild variant="secondary" className="mt-4">
                <Link to="/crops">{t("viewAll")}</Link>
              </Button>
            </article>
          )}

          <article className="card-soft p-6">
            <h2 className="font-display text-lg font-semibold">{t("navWeather")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{tr(weather.district)}</p>
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {weather.days.slice(0, 4).map((d, i) => (
                <div key={i} className="min-w-24 rounded-lg bg-secondary p-3 text-center">
                  <p className="text-xs font-medium">{tr(d.day)}</p>
                  <p className="mt-1 font-display text-lg font-semibold">{d.high}°</p>
                  <p className="text-xs text-muted-foreground">{d.rainChance}%</p>
                </div>
              ))}
            </div>
            {weather.alert ? (
              <p className="mt-4 rounded-lg bg-harvest/20 p-3 text-sm">{tr(weather.alert)}</p>
            ) : null}
          </article>
        </div>

        <h2 className="mt-12 font-display text-xl font-semibold">{t("sectionAdvisory")}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {advisories.slice(0, 2).map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-4">
              <p className="font-display text-sm font-semibold">{tr(a.title)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tr(a.body)}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-xl font-semibold">{t("navSchemes")}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {schemes.slice(0, 3).map((s) => (
            <Link key={s.id} to="/schemes" className="card-soft block p-5">
              <p className="font-display text-sm font-semibold">{tr(s.name)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tr(s.benefit)}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="card-soft flex items-center gap-3 p-5">
      <span className="surface-sprout flex size-10 items-center justify-center rounded-lg">
        <Icon className="size-5 text-primary" aria-hidden />
      </span>
      <div>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
