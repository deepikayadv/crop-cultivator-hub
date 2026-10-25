import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Droplets,
  HelpCircle,
  Layers,
  Scale,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { getRecommendations } from "@/services/farm.service";
import { frontendStore } from "@/services/frontend-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section } from "@/components/PageHeader";
import type { CropRecommendation, Season } from "@/types/domain";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Crop Recommendation & Suitability Advisor — KisanMitra CE2" },
      {
        name: "description",
        content: "Discover optimal crops based on state, soil type, irrigation source, and seasonal climate.",
      },
    ],
  }),
  component: RecommendationsPage,
});

export function RecommendationsPage() {
  const { t, tr } = useLanguage();
  const { farmer } = useFarmerSession();
  const navigate = useNavigate();

  // Input Parameters
  const [state, setState] = useState(farmer?.state || "Haryana");
  const [season, setSeason] = useState<Season>("rabi");
  const [soil, setSoil] = useState(farmer?.soilType || "alluvial");
  const [water, setWater] = useState(farmer?.waterAvailability || "canal");
  const [landAcres, setLandAcres] = useState(farmer?.landSize || "4.5");

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [comparedCrops, setComparedCrops] = useState<CropRecommendation[]>([]);

  const runAdvisor = async () => {
    setLoading(true);
    const recs = await getRecommendations({
      state,
      season,
      soil,
      water,
      landAcres: Number(landAcres || 1),
    });
    setRecommendations(recs);
    setLoading(false);
  };

  useEffect(() => {
    runAdvisor();
  }, [state, season, soil, water]);

  useEffect(() => {
    if (farmer) {
      setState(farmer.state || "Haryana");
      setSoil(farmer.soilType || "alluvial");
      setWater(farmer.waterAvailability || "canal");
      setLandAcres(farmer.landSize || "4.5");
    }
  }, [farmer]);

  const toggleCompare = (rec: CropRecommendation) => {
    if (comparedCrops.some((c) => c.cropId === rec.cropId)) {
      setComparedCrops(comparedCrops.filter((c) => c.cropId !== rec.cropId));
    } else {
      if (comparedCrops.length >= 3) {
        alert("You can compare up to 3 crops at a time. Remove one first.");
        return;
      }
      setComparedCrops([...comparedCrops, rec]);
    }
  };

  const handleStartPlan = (rec: CropRecommendation) => {
    if (!farmer) {
      void navigate({ to: "/login" });
      return;
    }
    frontendStore.addPlan(
      {
        crop: rec.crop.en,
        season,
        areaAcres: Number(landAcres || 2),
        sowingDate: new Date().toISOString().slice(0, 10),
        status: "planned",
        notes: `Adopted from Crop Advisor (${rec.score}% suitability match).`,
      },
      farmer.phone,
    );
    void navigate({ to: "/planner" });
  };

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={tr({ en: "Crop Recommendation & Suitability Advisor", hi: "फसल सुझाव एवं उपयुक्तता सलाहकार" })}
        body={tr({
          en: "Data-driven crop suitability matching your specific state, agro-climatic season, soil profile, and irrigation water capacity.",
          hi: "अपने राज्य, मौसम, मिट्टी की बनावट और पानी की व्यवस्था के आधार पर सर्वाधिक लाभकारी फसलें चुनें।",
        })}
      />

      <Section>
        {/* Input Parameters Matrix */}
        <div className="rounded-2xl border border-[#DCDFC8] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCDFC8] pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#43373D] flex items-center gap-2">
                <Sparkles className="size-5 text-[#B8D8BA]" />
                <span>Agronomic Advisory Input Matrix</span>
              </h2>
              <p className="text-xs text-[#69585F] mt-0.5">
                Adjust criteria to recalculate suitability scores.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#69585F] bg-[#D9DBBC]/40 px-3 py-1 rounded-full">
              Suitability Engine v2.4
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#43373D]">State / Region</Label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-9 w-full rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
              >
                <option value="Haryana">Haryana</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#43373D]">Cropping Season *</Label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as Season)}
                className="h-9 w-full rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
              >
                <option value="rabi">Rabi (Winter: Oct – Mar)</option>
                <option value="kharif">Kharif (Monsoon: Jun – Oct)</option>
                <option value="zaid">Zaid (Summer: Mar – Jun)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#43373D]">Soil Profile *</Label>
              <select
                value={soil}
                onChange={(e) => setSoil(e.target.value)}
                className="h-9 w-full rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
              >
                <option value="alluvial">Alluvial (जलोढ़)</option>
                <option value="black">Black / Regur (काली)</option>
                <option value="red">Red / Sandy Loam (लाल)</option>
                <option value="sandy">Sandy (बलुई)</option>
                <option value="clay">Clay (चिकनी)</option>
                <option value="loamy">Loamy (दोमट)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#43373D]">Irrigation Availability *</Label>
              <select
                value={water}
                onChange={(e) => setWater(e.target.value)}
                className="h-9 w-full rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
              >
                <option value="canal">Canal (High availability)</option>
                <option value="borewell">Tubewell / Borewell</option>
                <option value="drip">Drip / Micro-irrigation</option>
                <option value="rainfed">Rainfed (Low moisture)</option>
                <option value="tank">Farm Pond / Tank</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#43373D]">Field Acreage</Label>
              <Input
                value={landAcres}
                onChange={(e) => setLandAcres(e.target.value)}
                placeholder="4.5"
                className="h-9 text-xs border-[#DCDFC8]"
              />
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Drawer if items selected */}
        {comparedCrops.length > 0 && (
          <div className="mt-8 rounded-2xl border-2 border-[#69585F] bg-white p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
              <h3 className="font-display font-bold text-[#43373D] flex items-center gap-2">
                <Scale className="size-5 text-[#69585F]" />
                <span>Side-by-Side Comparison ({comparedCrops.length}/3 Selected)</span>
              </h3>
              <button
                type="button"
                onClick={() => setComparedCrops([])}
                className="text-xs font-semibold text-[#D9534F] hover:underline cursor-pointer"
              >
                Clear Comparison
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {comparedCrops.map((c) => (
                <div
                  key={c.cropId}
                  className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-4 text-xs space-y-2 relative"
                >
                  <button
                    type="button"
                    onClick={() => toggleCompare(c)}
                    className="absolute top-2.5 right-2.5 text-[#69585F] hover:text-[#D9534F]"
                  >
                    <X className="size-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{c.emoji}</span>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#43373D]">{tr(c.crop)}</h4>
                      <span className="text-[11px] font-bold text-[#69585F]">
                        {c.score}% Match Score
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DCDFC8]/60 space-y-1 text-[11px] text-[#43373D]">
                    <p><strong>Duration:</strong> {tr(c.growingDuration)}</p>
                    <p><strong>Water Need:</strong> {tr(c.waterRequirements)}</p>
                    <p><strong>Soil:</strong> {tr(c.soilRequirements)}</p>
                  </div>

                  <Button
                    onClick={() => handleStartPlan(c)}
                    size="sm"
                    className="w-full mt-2 bg-[#69585F] text-white text-xs h-7"
                  >
                    Adopt in Planner
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Cards Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-bold text-[#43373D]">
              Ranked Suitable Crops ({recommendations.length})
            </h3>
            <span className="text-xs text-[#69585F]">
              Select up to 3 to compare side-by-side
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec) => {
              const isCompared = comparedCrops.some((c) => c.cropId === rec.cropId);
              return (
                <div
                  key={rec.cropId}
                  className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs flex flex-col justify-between transition-hover hover:border-[#B8D8BA]"
                >
                  <div>
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{rec.emoji}</span>
                        <div>
                          <h4 className="font-display text-xl font-bold text-[#43373D]">
                            {tr(rec.crop)}
                          </h4>
                          <span className="text-xs font-semibold text-[#69585F]">
                            {tr(rec.suitableSeason)} Season
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/30 px-2.5 py-1 text-right">
                        <span className="font-display text-lg font-bold text-[#43373D]">
                          {rec.score}%
                        </span>
                        <span className="block text-[9px] uppercase font-bold text-[#69585F]">
                          Match
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-[#43373D] leading-relaxed">
                      {tr(rec.reason)}
                    </p>

                    <div className="mt-4 rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-3 text-xs space-y-1.5 text-[#43373D]">
                      <div className="flex justify-between">
                        <span className="text-[#69585F]">Growing Duration:</span>
                        <span className="font-semibold">{tr(rec.growingDuration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69585F]">Water Needs:</span>
                        <span className="font-semibold">{tr(rec.waterRequirements)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69585F]">Suitable Soil:</span>
                        <span className="font-semibold">{tr(rec.soilRequirements)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-[#DCDFC8] flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCompare(rec)}
                      className={`text-xs h-8 border-[#DCDFC8] ${
                        isCompared ? "bg-[#69585F] text-white" : "hover:bg-[#D9DBBC]/40"
                      }`}
                    >
                      <Scale className="size-3 mr-1" />
                      {isCompared ? "Remove Compare" : "Compare"}
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleStartPlan(rec)}
                      className="bg-[#69585F] text-white hover:bg-[#55464D] text-xs h-8"
                    >
                      <Sprout className="size-3.5 mr-1" />
                      Adopt in Planner
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agricultural Disclaimer */}
        <div className="mt-10 rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-4 text-xs text-[#69585F] text-center">
          <p>
            * Disclaimer: Recommendations are synthesized from ICAR and State Agricultural University agronomic matrices. Micro-climates, seed varieties, and local irrigation schedules can influence yields. Consult your local KVK extension agent before large-scale sowing.
          </p>
        </div>
      </Section>
    </>
  );
}
