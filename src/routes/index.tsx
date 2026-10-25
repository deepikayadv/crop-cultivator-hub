import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  CloudSun,
  IndianRupee,
  LifeBuoy,
  Landmark,
  Sprout,
} from "lucide-react";
import heroField from "@/assets/hero-field.jpg";
import { useLanguage } from "@/lib/i18n";
import { advisories, crops, mandiRates, techUpdates } from "@/data/farm-data";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KisanMitra — Schemes, Crop Calendar & Mandi Prices for Farmers" },
      {
        name: "description",
        content:
          "One place for Indian farmers: government schemes, sowing windows, live mandi rates, weather alerts and new farm technology, in Hindi and English.",
      },
      { property: "og:title", content: "KisanMitra — Everything a farmer needs, in one place" },
      {
        property: "og:description",
        content:
          "Government schemes, crop calendar, mandi prices and weather advisories for Indian farmers, in Hindi and English.",
      },
    ],
  }),
  component: Home,
});

const services = [
  { to: "/schemes", icon: Landmark, key: "navSchemes" },
  { to: "/planner", icon: CalendarDays, key: "navPlanner" },
  { to: "/recommendations", icon: Sprout, key: "navRecommendation" },
  { to: "/market", icon: IndianRupee, key: "navMarket" },
  { to: "/expenses", icon: IndianRupee, key: "navFinance" },
  { to: "/weather", icon: CloudSun, key: "navWeather" },
  { to: "/help", icon: LifeBuoy, key: "navHelp" },
] as const;

const serviceBlurbs = {
  "/schemes": {
    en: "Rule-based eligibility checker, benefit amounts, bookmarking, and official application portals.",
    hi: "नियम-आधारित पात्रता जांच, लाभ राशि, योजना बुकमार्क और आधिकारिक आवेदन पोर्टल।",
  },
  "/planner": {
    en: "Seasonal planning, field area allocation, growth stage progress tracking, and harvest targets.",
    hi: "मौसमी योजना, खेत क्षेत्रफल आवंटन, विकास चरण प्रगति ट्रैकिंग और कटाई लक्ष्य।",
  },
  "/recommendations": {
    en: "Agro-climatic suitability engine matching soil, irrigation, budget, and season to high-yield crops.",
    hi: "मिट्टी, सिंचाई, बजट और मौसम के आधार पर उपयुक्त फसलों की सिफारिश और तुलना।",
  },
  "/market": {
    en: "Real-time modal rates across APMC mandis, high/low spread comparisons, and price movements.",
    hi: "प्रमुख मंडियों के मॉडल भाव, अधिकतम/न्यूनतम स्प्रेड तुलना और दिन का उतार-चढ़ाव।",
  },
  "/expenses": {
    en: "Input cost logging, harvest sales records in quintals, category breakdowns, and net profit tracking.",
    hi: "इनपुट लागत, क्विंटल में फसल बिक्री, श्रेणीवार खर्च और शुद्ध मुनाफ़ा गणना।",
  },
  "/weather": {
    en: "District-level 7-day forecast with spray safety windows and actionable farming advisories.",
    hi: "सात दिन का ज़िला पूर्वानुमान, छिड़काव अनुकूलता और खेत की सुरक्षा सलाह।",
  },
  "/help": {
    en: "File support tickets, receive official replies, view FAQs, and access 24/7 toll-free helplines.",
    hi: "सहायता टिकट दर्ज करें, आधिकारिक जवाब पाएं और टोल-फ़्री किसान हेल्पलाइन देखें।",
  },
} as const;

function Home() {
  const { t, tr } = useLanguage();
  const month = new Date().getMonth() + 1;
  const sowNow = crops.filter((c) => c.sowingMonths.includes(month)).slice(0, 3);
  const topMovers = [...mandiRates].sort((a, b) => b.changePct - a.changePct).slice(0, 4);

  return (
    <>
      <section className="surface-canopy relative overflow-hidden">
        <img
          src={heroField}
          alt="Farmer standing in a green paddy field at sunrise"
          width={1600}
          height={912}
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase opacity-80">
              {t("appName")} · {t("tagline")}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight font-semibold sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-base opacity-90">{t("heroBody")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/schemes">
                  {t("heroCta")} <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/market">{t("heroCta2")}</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-primary-foreground/20 bg-background/95 p-5 text-foreground shadow-lift">
            <div className="flex items-center gap-2">
              <Sprout className="size-4 text-primary" aria-hidden />
              <h2 className="font-display text-sm font-semibold">{t("bestNow")}</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {(sowNow.length ? sowNow : crops.slice(0, 3)).map((c) => (
                <li key={c.id} className="flex items-start gap-3 rounded-lg bg-secondary/70 p-3">
                  <span className="text-xl" aria-hidden>
                    {c.emoji}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{tr(c.name)}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("sowing")}: {tr(c.sowing)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/crops"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t("viewAll")} <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <Section>
        <h2 className="font-display text-2xl font-semibold">{t("sectionServices")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.to} to={s.to} className="card-soft block p-5">
                <span className="surface-sprout flex size-10 items-center justify-center rounded-lg">
                  <Icon className="size-5 text-primary" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{t(s.key)}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{tr(serviceBlurbs[s.to])}</p>
              </Link>
            );
          })}
        </div>
      </Section>

      <div className="surface-sprout">
        <Section>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold">{t("sectionAdvisory")}</h2>
              <ul className="mt-6 space-y-3">
                {advisories.map((a) => (
                  <li key={a.id} className="rounded-xl border border-border bg-card p-4">
                    <p className="font-display text-sm font-semibold">{tr(a.title)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{tr(a.body)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-2xl font-semibold">{t("navMarket")}</h2>
                <Link to="/market" className="text-sm font-medium text-primary hover:underline">
                  {t("viewAll")}
                </Link>
              </div>
              <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
                {topMovers.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between border-b border-border px-4 py-3 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{tr(r.crop)}</p>
                      <p className="text-xs text-muted-foreground">{tr(r.mandi)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">₹{r.price.toLocaleString("en-IN")}</p>
                      <p
                        className={`text-xs ${r.changePct >= 0 ? "text-primary" : "text-destructive"}`}
                      >
                        {r.changePct >= 0 ? "▲" : "▼"} {Math.abs(r.changePct).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Section>
        <h2 className="font-display text-2xl font-semibold">{t("sectionTech")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {techUpdates.map((u) => (
            <article key={u.id} className="card-soft p-5">
              <span className="inline-flex rounded-full bg-harvest/25 px-2.5 py-1 text-xs font-medium text-harvest-foreground">
                {tr(u.tag)}
              </span>
              <h3 className="mt-3 font-display text-base font-semibold">{tr(u.title)}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{tr(u.body)}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
