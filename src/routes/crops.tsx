import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Droplets,
  Edit2,
  Layers,
  Plus,
  Shield,
  Sparkles,
  Sprout,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { seasons, type Crop } from "@/data/farm-data";
import { frontendStore } from "@/services/frontend-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const { isAdmin } = useFarmerSession();
  const [season, setSeason] = useState<Crop["season"] | "all">("all");
  const month = new Date().getMonth() + 1;

  const [cropList, setCropList] = useState<Crop[]>(() => frontendStore.getCrops());
  const [feedback, setFeedback] = useState("");

  // Admin Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  // Form State
  const [formNameEn, setFormNameEn] = useState("");
  const [formNameHi, setFormNameHi] = useState("");
  const [formSeason, setFormSeason] = useState<Crop["season"]>("rabi");
  const [formSowingEn, setFormSowingEn] = useState("");
  const [formSowingHi, setFormSowingHi] = useState("");
  const [formHarvestEn, setFormHarvestEn] = useState("");
  const [formHarvestHi, setFormHarvestHi] = useState("");
  const [formSowingMonths, setFormSowingMonths] = useState("10, 11");
  const [formDurationDays, setFormDurationDays] = useState("120–140");
  const [formWaterEn, setFormWaterEn] = useState("");
  const [formWaterHi, setFormWaterHi] = useState("");
  const [formSoilEn, setFormSoilEn] = useState("");
  const [formSoilHi, setFormSoilHi] = useState("");
  const [formTipEn, setFormTipEn] = useState("");
  const [formTipHi, setFormTipHi] = useState("");
  const [formEmoji, setFormEmoji] = useState("🌾");

  const refreshCrops = () => {
    setCropList(frontendStore.getCrops());
  };

  useEffect(() => {
    refreshCrops();
  }, []);

  const list = useMemo(
    () => cropList.filter((c) => season === "all" || c.season === season),
    [cropList, season],
  );

  const handleOpenAdd = () => {
    setEditingCrop(null);
    setFormNameEn("");
    setFormNameHi("");
    setFormSeason("rabi");
    setFormSowingEn("October – November");
    setFormSowingHi("अक्टूबर – नवंबर");
    setFormHarvestEn("March – April");
    setFormHarvestHi("मार्च – अप्रैल");
    setFormSowingMonths("10, 11");
    setFormDurationDays("120–140");
    setFormWaterEn("Medium — 4 to 5 irrigations");
    setFormWaterHi("मध्यम — 4 से 5 सिंचाई");
    setFormSoilEn("Well-drained fertile loam");
    setFormSoilHi("अच्छी जल निकासी वाली उपजाऊ दोमट");
    setFormTipEn("Ensure seed treatment before sowing.");
    setFormTipHi("बुवाई से पहले बीज उपचार अवश्य करें।");
    setFormEmoji("🌱");
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Crop) => {
    setEditingCrop(c);
    setFormNameEn(c.name.en);
    setFormNameHi(c.name.hi);
    setFormSeason(c.season);
    setFormSowingEn(c.sowing.en);
    setFormSowingHi(c.sowing.hi);
    setFormHarvestEn(c.harvest.en);
    setFormHarvestHi(c.harvest.hi);
    setFormSowingMonths(c.sowingMonths.join(", "));
    setFormDurationDays(c.durationDays);
    setFormWaterEn(c.water.en);
    setFormWaterHi(c.water.hi);
    setFormSoilEn(c.soil.en);
    setFormSoilHi(c.soil.hi);
    setFormTipEn(c.tip.en);
    setFormTipHi(c.tip.hi);
    setFormEmoji(c.emoji);
    setModalOpen(true);
  };

  const handleDeleteCrop = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the crop calendar?`)) {
      frontendStore.deleteCrop(id);
      refreshCrops();
      setFeedback(`Crop "${name}" removed from calendar.`);
      setTimeout(() => setFeedback(""), 4000);
    }
  };

  const handleSaveCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameEn.trim()) return;

    const parsedMonths = formSowingMonths
      .split(",")
      .map((m) => parseInt(m.trim(), 10))
      .filter((m) => !isNaN(m) && m >= 1 && m <= 12);

    const cropObj: Crop = {
      id: editingCrop ? editingCrop.id : `crop-${Date.now()}`,
      name: { en: formNameEn.trim(), hi: formNameHi.trim() || formNameEn.trim() },
      season: formSeason,
      sowing: { en: formSowingEn.trim(), hi: formSowingHi.trim() || formSowingEn.trim() },
      sowingMonths: parsedMonths.length > 0 ? parsedMonths : [10, 11],
      harvest: { en: formHarvestEn.trim(), hi: formHarvestHi.trim() || formHarvestEn.trim() },
      durationDays: formDurationDays.trim() || "120",
      water: { en: formWaterEn.trim(), hi: formWaterHi.trim() || formWaterEn.trim() },
      soil: { en: formSoilEn.trim(), hi: formSoilHi.trim() || formSoilEn.trim() },
      tip: { en: formTipEn.trim(), hi: formTipHi.trim() || formTipEn.trim() },
      emoji: formEmoji.trim() || "🌾",
    };

    if (editingCrop) {
      frontendStore.updateCrop(cropObj);
      setFeedback(`Crop "${cropObj.name.en}" successfully updated.`);
    } else {
      frontendStore.addCrop(cropObj);
      setFeedback(`New crop "${cropObj.name.en}" added to calendar.`);
    }

    refreshCrops();
    setModalOpen(false);
    setTimeout(() => setFeedback(""), 4000);
  };

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
        {feedback && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/30 p-4 text-xs font-semibold text-[#43373D]">
            <CheckCircle2 className="size-4 text-[#43373D]" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Admin Operational Banner */}
        {isAdmin && (
          <div className="mb-6 rounded-2xl border border-[#EF959D] bg-[#EF959D]/15 p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#EF959D] text-white shadow-xs">
                  <Shield className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-sm font-bold text-[#43373D]">
                      Administrator Mode — Crop Calendar Repository Management
                    </h2>
                    <span className="rounded-full bg-[#EF959D] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Full Admin Privileges
                    </span>
                  </div>
                  <p className="text-xs text-[#69585F] mt-0.5">
                    As Krishi Adhikari, you have full authority to edit sowing/harvest windows, agronomic tips, water & soil profiles, or add new crop cultivars.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleOpenAdd}
                className="bg-[#69585F] text-white hover:bg-[#52444a] shadow-xs text-xs cursor-pointer"
              >
                <Plus className="size-4 mr-1.5" />
                <span>Add New Crop to Calendar</span>
              </Button>
            </div>
          </div>
        )}

        {/* Season Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
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

          <div className="text-xs text-[#69585F]">
            Showing <strong className="text-[#43373D]">{list.length}</strong> crop cultivars in directory
          </div>
        </div>

        {/* Crop Grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {list.map((c) => {
            const sowNow = c.sowingMonths.includes(month);
            return (
              <article
                key={c.id}
                className="card-soft p-6 relative flex flex-col justify-between border border-[#DCDFC8] hover:border-[#B8D8BA] transition-all"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl" aria-hidden>
                      {c.emoji}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-lg font-bold text-[#43373D]">
                          {tr(c.name)}
                        </h2>
                        {isAdmin && (
                          <span className="text-[10px] font-mono text-[#69585F] bg-[#D9DBBC]/50 px-1.5 py-0.5 rounded">
                            ID: {c.id}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("season")}: {tr(seasons.find((s) => s.id === c.season)?.label || { en: c.season, hi: c.season })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {sowNow ? (
                        <span className="rounded-full bg-harvest/25 px-2.5 py-1 text-xs font-semibold text-harvest-foreground">
                          {t("bestNow")}
                        </span>
                      ) : null}

                      {isAdmin && (
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(c)}
                            title="Edit crop details (Admin)"
                            className="rounded-lg p-1.5 text-[#69585F] hover:bg-[#D9DBBC]/60 hover:text-[#43373D] border border-[#DCDFC8] cursor-pointer"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCrop(c.id, c.name.en)}
                            title="Delete crop from calendar (Admin)"
                            className="rounded-lg p-1.5 text-[#EF959D] hover:bg-[#EF959D]/20 border border-[#EF959D]/40 cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Fact icon={Sprout} label={t("sowing")} value={tr(c.sowing)} />
                    <Fact icon={Timer} label={t("harvest")} value={tr(c.harvest)} />
                    <Fact icon={Droplets} label={t("water")} value={tr(c.water)} />
                    <Fact icon={Layers} label={t("soil")} value={tr(c.soil)} />
                  </div>

                  <p className="mt-5 rounded-lg bg-secondary/50 p-3 text-sm">
                    <span className="font-semibold">{t("tip")}: </span>
                    {tr(c.tip)}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {t("duration")}: {c.durationDays} {tr({ en: "days", hi: "दिन" })}
                  </span>
                  <a
                    href={`/planner`}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <span>Plan this crop →</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Admin Add / Edit Crop Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-[#EF959D]" />
                <h3 className="font-display text-lg font-bold text-[#43373D]">
                  {editingCrop ? `Edit Crop: ${editingCrop.name.en}` : "Add New Crop to Calendar"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#69585F] hover:text-[#43373D] cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCrop} className="space-y-4 text-xs">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Crop Name (English)*</Label>
                  <Input
                    required
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="e.g. Barley"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Crop Name (Hindi)</Label>
                  <Input
                    value={formNameHi}
                    onChange={(e) => setFormNameHi(e.target.value)}
                    placeholder="उदा. जौ"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Emoji Icon</Label>
                  <Input
                    value={formEmoji}
                    onChange={(e) => setFormEmoji(e.target.value)}
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Season*</Label>
                  <select
                    value={formSeason}
                    onChange={(e) => setFormSeason(e.target.value as Crop["season"])}
                    className="mt-1 h-8 w-full rounded-md border border-[#DCDFC8] bg-white px-2 text-xs text-[#43373D]"
                  >
                    <option value="kharif">Kharif (Monsoon)</option>
                    <option value="rabi">Rabi (Winter)</option>
                    <option value="zaid">Zaid (Summer)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Duration (Days)*</Label>
                  <Input
                    required
                    value={formDurationDays}
                    onChange={(e) => setFormDurationDays(e.target.value)}
                    placeholder="e.g. 110–130"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Sowing Months (1-12)</Label>
                  <Input
                    value={formSowingMonths}
                    onChange={(e) => setFormSowingMonths(e.target.value)}
                    placeholder="e.g. 10, 11"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Sowing Window (EN)</Label>
                  <Input
                    value={formSowingEn}
                    onChange={(e) => setFormSowingEn(e.target.value)}
                    placeholder="e.g. October – November"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Sowing Window (HI)</Label>
                  <Input
                    value={formSowingHi}
                    onChange={(e) => setFormSowingHi(e.target.value)}
                    placeholder="उदा. अक्टूबर – नवंबर"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Harvest Window (EN)</Label>
                  <Input
                    value={formHarvestEn}
                    onChange={(e) => setFormHarvestEn(e.target.value)}
                    placeholder="e.g. March – April"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Harvest Window (HI)</Label>
                  <Input
                    value={formHarvestHi}
                    onChange={(e) => setFormHarvestHi(e.target.value)}
                    placeholder="उदा. मार्च – अप्रैल"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Water Requirement (EN)</Label>
                  <Input
                    value={formWaterEn}
                    onChange={(e) => setFormWaterEn(e.target.value)}
                    placeholder="e.g. Medium — 3 irrigations"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Water Requirement (HI)</Label>
                  <Input
                    value={formWaterHi}
                    onChange={(e) => setFormWaterHi(e.target.value)}
                    placeholder="उदा. मध्यम — 3 सिंचाई"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Soil Profile (EN)</Label>
                  <Input
                    value={formSoilEn}
                    onChange={(e) => setFormSoilEn(e.target.value)}
                    placeholder="e.g. Well-drained sandy loam"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Soil Profile (HI)</Label>
                  <Input
                    value={formSoilHi}
                    onChange={(e) => setFormSoilHi(e.target.value)}
                    placeholder="उदा. बलुई दोमट"
                    className="mt-1 h-8 text-xs border-[#DCDFC8]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Field & Agronomic Tip (EN)</Label>
                  <textarea
                    rows={2}
                    value={formTipEn}
                    onChange={(e) => setFormTipEn(e.target.value)}
                    placeholder="Key field recommendation..."
                    className="mt-1 w-full rounded-md border border-[#DCDFC8] bg-white p-2 text-xs text-[#43373D]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#43373D]">Field & Agronomic Tip (HI)</Label>
                  <textarea
                    rows={2}
                    value={formTipHi}
                    onChange={(e) => setFormTipHi(e.target.value)}
                    placeholder="महत्वपूर्ण कृषि सलाह..."
                    className="mt-1 w-full rounded-md border border-[#DCDFC8] bg-white p-2 text-xs text-[#43373D]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCDFC8]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  className="border-[#DCDFC8] text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#69585F] text-white hover:bg-[#52444a] text-xs h-8"
                >
                  {editingCrop ? "Update Crop" : "Add Crop to Directory"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
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
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors cursor-pointer ${
        active
          ? "border-primary bg-primary text-primary-foreground font-semibold"
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
