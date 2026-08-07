import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Cloud, CloudRain, CloudSun, Droplets, Sun, Zap } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { districtWeather, type DayForecast } from "@/data/farm-data";
import { PageHeader, Section } from "@/components/PageHeader";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Farm Weather Forecast & Spray Alerts — KisanMitra" },
      {
        name: "description",
        content:
          "Seven-day district weather for farmers with rain chance, temperature range and advisories on when to delay spraying or irrigation.",
      },
      { property: "og:title", content: "Farm Weather Forecast & Spray Alerts" },
      {
        property: "og:description",
        content: "Seven-day district forecast with rain chance and field advisories.",
      },
    ],
  }),
  component: WeatherPage,
});

const icons = { sun: Sun, cloud: CloudSun, rain: CloudRain, storm: Zap };

function WeatherPage() {
  const { t, tr } = useLanguage();
  const [districtId, setDistrictId] = useState(districtWeather[0]!.id);
  const active = districtWeather.find((d) => d.id === districtId)!;

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={t("navWeather")}
        body={tr({
          en: "Rain within 24 hours washes away your spray. Check the week before you plan irrigation, spraying or harvest.",
          hi: "24 घंटे में बारिश आपका छिड़काव बहा देती है। सिंचाई, छिड़काव या कटाई से पहले पूरे हफ़्ते का हाल देखें।",
        })}
      />

      <Section>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">{t("district")}:</span>
          {districtWeather.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDistrictId(d.id)}
              aria-pressed={d.id === districtId}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                d.id === districtId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {tr(d.district)}
            </button>
          ))}
        </div>

        {active.alert ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-harvest/50 bg-harvest/15 p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-harvest-foreground" aria-hidden />
            <div>
              <p className="font-display text-sm font-semibold">{t("alerts")}</p>
              <p className="mt-0.5 text-sm">{tr(active.alert)}</p>
            </div>
          </div>
        ) : null}

        <h2 className="mt-10 font-display text-xl font-semibold">{t("forecast")}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {active.days.map((day, i) => (
            <DayCard key={i} day={day} />
          ))}
        </div>
      </Section>
    </>
  );
}

function DayCard({ day }: { day: DayForecast }) {
  const { tr } = useLanguage();
  const Icon = icons[day.icon] ?? Cloud;

  return (
    <article className="card-soft p-4">
      <p className="font-display text-sm font-semibold">{tr(day.day)}</p>
      <Icon className="mt-3 size-8 text-primary" aria-hidden />
      <p className="mt-3 text-sm text-muted-foreground">{tr(day.condition)}</p>
      <p className="mt-2 font-display text-xl font-semibold">
        {day.high}° <span className="text-base font-normal text-muted-foreground">/ {day.low}°</span>
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Droplets className="size-3.5" aria-hidden />
        {day.rainChance}%
      </p>
    </article>
  );
}
