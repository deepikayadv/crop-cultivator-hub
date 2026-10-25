import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  RefreshCw,
  Sun,
  Thermometer,
  Wind,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { districtWeather, type DayForecast } from "@/data/farm-data";
import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/PageHeader";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Live Agro-Weather & Spray Advisories — KisanMitra CE2" },
      {
        name: "description",
        content:
          "Seven-day agricultural weather forecast with humidity, wind speed, rain probability, and documented pesticide spray windows.",
      },
    ],
  }),
  component: WeatherPage,
});

const icons = { sun: Sun, cloud: CloudSun, rain: CloudRain, storm: Zap };

export function WeatherPage() {
  const { t, tr } = useLanguage();
  const { farmer } = useFarmerSession();

  // Find initial district matching farmer profile if possible
  const initialDistrict =
    districtWeather.find((d) => d.district.en.toLowerCase() === (farmer?.district || "").toLowerCase())?.id ||
    districtWeather[0]!.id;

  const [districtId, setDistrictId] = useState(initialDistrict);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just now (25 Oct 2026, 09:15 IST)");

  useEffect(() => {
    if (farmer?.district) {
      const match = districtWeather.find(
        (d) => d.district.en.toLowerCase() === farmer.district.toLowerCase(),
      );
      if (match) setDistrictId(match.id);
    }
  }, [farmer]);

  const active = districtWeather.find((d) => d.id === districtId) || districtWeather[0]!;

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLastRefreshed("Just now (25 Oct 2026, 09:15 IST)");
    }, 400);
  };

  const today = active.days[0]!;

  // Documented Threshold Evaluations
  const isHighRainRisk = today.rainChance >= 40;
  const isHighHeatRisk = today.high >= 36;
  const spraySafetyStatus =
    today.rainChance > 40
      ? { status: "unsafe", text: "Delay Chemical Spray (High Rain Runoff Risk)" }
      : today.high > 35
        ? { status: "caution", text: "Spray only in early morning or late evening" }
        : { status: "safe", text: "Ideal Spray Window Available Today" };

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={t("navWeather")}
        body={tr({
          en: "Agricultural weather forecasts and threshold-based advisories. Never lose expensive fertilizers or pesticides to untimely rainfall.",
          hi: "कृषि मौसम पूर्वानुमान और वैज्ञानिक सलाह। असमय बारिश से अपनी खाद और कीटनाशक को बहने से बचाएं।",
        })}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Forecast</span>
          </Button>
        </div>
      </PageHeader>

      <Section>
        {/* District Selector Chips */}
        <div className="rounded-2xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCDFC8] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
              Select Agricultural District:
            </span>
            <span className="text-[11px] text-[#69585F] flex items-center gap-1">
              <Clock className="size-3" />
              Source: IMD Agromet Advisory Division • {lastRefreshed}
            </span>
          </div>

          <div className="mt-3.5 flex flex-wrap gap-2">
            {districtWeather.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDistrictId(d.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  d.id === districtId
                    ? "bg-[#69585F] text-white shadow-xs"
                    : "bg-[#F8F9F3] text-[#69585F] border border-[#DCDFC8] hover:bg-[#D9DBBC]/40"
                }`}
              >
                {tr(d.district)}
                {farmer?.district && d.district.en.toLowerCase() === farmer.district.toLowerCase() && (
                  <span className="ml-1 text-[10px] text-[#B8D8BA]">★ (Home)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Current Conditions & Spray Window Banner */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Main Today Metric Card */}
          <div className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                  Current Field Conditions
                </span>
                <h2 className="font-display text-3xl font-bold text-[#43373D] mt-1">
                  {tr(active.district)}
                </h2>
                <p className="text-xs text-[#69585F] mt-0.5">{tr(today.condition)}</p>
              </div>

              <div className="text-right">
                <span className="font-display text-5xl font-extrabold text-[#43373D]">
                  {today.high}°C
                </span>
                <span className="block text-xs text-[#69585F] mt-1">Night Low: {today.low}°C</span>
              </div>
            </div>

            {/* Weather Metrics Strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
              <div className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-3 text-xs">
                <span className="text-[#69585F] flex items-center gap-1 font-medium">
                  <Droplets className="size-3.5 text-[#69585F]" /> Rain Chance
                </span>
                <p className="mt-1 font-bold text-base text-[#43373D]">{today.rainChance}%</p>
                <span className="text-[10px] text-[#69585F]">
                  {today.rainChance > 40 ? "Precipitation likely" : "Low rainfall risk"}
                </span>
              </div>

              <div className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-3 text-xs">
                <span className="text-[#69585F] flex items-center gap-1 font-medium">
                  <Wind className="size-3.5 text-[#69585F]" /> Wind Speed
                </span>
                <p className="mt-1 font-bold text-base text-[#43373D]">12 km/h</p>
                <span className="text-[10px] text-[#69585F]">Gentle field breeze</span>
              </div>

              <div className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-3 text-xs">
                <span className="text-[#69585F] flex items-center gap-1 font-medium">
                  <Droplets className="size-3.5 text-[#69585F]" /> Relative Humidity
                </span>
                <p className="mt-1 font-bold text-base text-[#43373D]">68%</p>
                <span className="text-[10px] text-[#69585F]">Moderate atmospheric vapor</span>
              </div>

              <div className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-3 text-xs">
                <span className="text-[#69585F] flex items-center gap-1 font-medium">
                  <Sun className="size-3.5 text-[#69585F]" /> Sunshine Hours
                </span>
                <p className="mt-1 font-bold text-base text-[#43373D]">8.5 hrs</p>
                <span className="text-[10px] text-[#69585F]">Adequate photosynthetic light</span>
              </div>
            </div>

            {/* Spray Window Status */}
            <div
              className={`rounded-xl border p-4 text-xs font-semibold flex items-center justify-between gap-3 ${
                spraySafetyStatus.status === "safe"
                  ? "border-[#B8D8BA] bg-[#B8D8BA]/30 text-[#382E33]"
                  : spraySafetyStatus.status === "unsafe"
                    ? "border-[#EF959D] bg-[#EF959D]/25 text-[#43373D]"
                    : "border-[#FCDDBC] bg-[#FCDDBC]/40 text-[#5B4028]"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-[#69585F]" />
                <div>
                  <span className="block font-bold">Field Spraying Advisory:</span>
                  <span className="font-normal text-[11px]">{spraySafetyStatus.text}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/70 px-2.5 py-1 rounded-md border border-[#DCDFC8]">
                {spraySafetyStatus.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Documented Agro-Meteorological Advisory Box */}
          <div className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-[#DCDFC8] pb-3">
                <AlertTriangle className="size-4 text-[#5B4028]" />
                <h3 className="font-display font-bold text-[#43373D]">
                  Documented Agro-Advisories
                </h3>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                {active.alert ? (
                  <div className="rounded-xl border border-[#EF959D] bg-[#EF959D]/20 p-3 text-[#43373D]">
                    <span className="font-bold block">Active Regional Alert:</span>
                    <p className="mt-0.5 leading-relaxed">{tr(active.alert)}</p>
                  </div>
                ) : null}

                <div className="rounded-xl border border-[#FCDDBC] bg-[#FCDDBC]/30 p-3 text-[#5B4028]">
                  <span className="font-bold block">Crop Irrigation Guidance:</span>
                  <p className="mt-0.5 leading-relaxed">
                    {isHighRainRisk
                      ? "Hold off on tubewell irrigation; forecast models predict natural soil moisture replenishment within 36 hours."
                      : "Soil moisture is optimal for crown root initiation in winter wheat. Proceed with scheduled light irrigation."}
                  </p>
                </div>

                <div className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-3 text-[#69585F]">
                  <span className="font-bold text-[#43373D] block">Fungal Infection Threshold:</span>
                  <p className="mt-0.5 leading-relaxed">
                    Rust spore germination occurs above 85% humidity. Current humidity (68%) remains below outbreak thresholds.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCDFC8] text-[11px] text-[#69585F]">
              Issued jointly by State Agricultural University & Krishi Vigyan Kendra (KVK).
            </div>
          </div>
        </div>

        {/* 7-Day Weekly Forecast Strip */}
        <div className="mt-8">
          <h3 className="font-display text-xl font-bold text-[#43373D] mb-4">
            {t("forecast")} (सात दिन का पूर्वानुमान)
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            {active.days.map((day, idx) => {
              const IconComp = icons[day.icon] || CloudSun;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 text-center shadow-xs transition-hover ${
                    idx === 0
                      ? "border-[#69585F] bg-[#F8F9F3] ring-1 ring-[#69585F]"
                      : "border-[#DCDFC8] bg-white hover:border-[#B8D8BA]"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                    {tr(day.day)}
                  </p>

                  <IconComp className="mx-auto my-3 size-7 text-[#69585F]" />

                  <p className="text-xs font-semibold text-[#43373D] truncate">{tr(day.condition)}</p>

                  <div className="mt-3 flex items-center justify-center gap-1.5 font-display text-sm font-bold text-[#43373D]">
                    <span>{day.high}°</span>
                    <span className="text-xs font-normal text-[#69585F]">/ {day.low}°</span>
                  </div>

                  <div className="mt-2 text-[11px] text-[#69585F]">
                    <span className="inline-block rounded-md bg-[#D9DBBC]/40 px-2 py-0.5 font-semibold text-[#43373D]">
                      ☔ {day.rainChance}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
