import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Filter,
  Layers,
  Plus,
  Ruler,
  Sprout,
  Trash2,
  X,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { crops } from "@/data/farm-data";
import { frontendStore } from "@/services/frontend-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section } from "@/components/PageHeader";
import type { CropPlan, CropPlanStatus, Season } from "@/types/domain";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Crop Planner & Lifecycle Tracker — KisanMitra CE2" },
      {
        name: "description",
        content: "Track crop sowing windows, field acreage, growth milestones, and harvest dates with full CRUD lifecycle tracking.",
      },
    ],
  }),
  component: PlannerPage,
});

export function PlannerPage() {
  const { t, tr } = useLanguage();
  const { farmer } = useFarmerSession();

  const phone = farmer?.phone || "9876543210";

  const [plans, setPlans] = useState<CropPlan[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeason, setFilterSeason] = useState<string>("all");

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CropPlan | null>(null);

  const [formCrop, setFormCrop] = useState("Wheat");
  const [formSeason, setFormSeason] = useState<Season>("rabi");
  const [formArea, setFormArea] = useState("2.5");
  const [formSowing, setFormSowing] = useState("2026-11-01");
  const [formHarvest, setFormHarvest] = useState("2027-04-10");
  const [formStatus, setFormStatus] = useState<CropPlanStatus>("planned");
  const [formNotes, setFormNotes] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadPlans = () => {
    const list = frontendStore.getPlans(phone);
    setPlans(list);
  };

  useEffect(() => {
    loadPlans();
  }, [phone]);

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormCrop(farmer?.mainCrop || "Wheat");
    setFormSeason("rabi");
    setFormArea(farmer?.landSize || "2.5");
    setFormSowing(new Date().toISOString().slice(0, 10));
    const hDate = new Date();
    hDate.setDate(hDate.getDate() + 120);
    setFormHarvest(hDate.toISOString().slice(0, 10));
    setFormStatus("planned");
    setFormNotes("");
    setModalOpen(true);
  };

  const handleOpenEdit = (plan: CropPlan) => {
    setEditingPlan(plan);
    setFormCrop(plan.crop);
    setFormSeason(plan.season);
    setFormArea(String(plan.areaAcres));
    setFormSowing(plan.sowingDate);
    setFormHarvest(plan.expectedHarvestDate || "");
    setFormStatus(plan.status);
    setFormNotes(plan.notes || "");
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this crop plan?")) {
      frontendStore.deletePlan(id);
      loadPlans();
      setFeedbackMsg("Crop plan deleted successfully.");
      setTimeout(() => setFeedbackMsg(""), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCrop || !formArea || !formSowing) return;

    if (editingPlan) {
      frontendStore.updatePlan({
        ...editingPlan,
        crop: formCrop,
        season: formSeason,
        areaAcres: Number(formArea),
        sowingDate: formSowing,
        expectedHarvestDate: formHarvest,
        status: formStatus,
        notes: formNotes,
        stageProgress: formStatus === "harvested" ? 100 : formStatus === "growing" ? 65 : 15,
      });
      setFeedbackMsg("Crop plan updated successfully!");
    } else {
      frontendStore.addPlan(
        {
          crop: formCrop,
          season: formSeason,
          areaAcres: Number(formArea),
          sowingDate: formSowing,
          expectedHarvestDate: formHarvest,
          status: formStatus,
          notes: formNotes,
        },
        phone,
      );
      setFeedbackMsg("New crop plan created successfully!");
    }

    setModalOpen(false);
    loadPlans();
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  const filteredPlans = plans.filter((p) => {
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchSeason = filterSeason === "all" || p.season === filterSeason;
    return matchStatus && matchSeason;
  });

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={tr({ en: "Crop Planner & Lifecycle Tracker", hi: "फसल योजना एवं विकास ट्रैकर" })}
        body={tr({
          en: "Organize seasonal sowing windows, track acreage allocation, monitor lifecycle stages, and forecast harvest dates.",
          hi: "मौसमी बुवाई का समय निर्धारित करें, खेत का रकबा आवंटित करें और कटाई की अनुमानित तारीख ट्रैक करें।",
        })}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleOpenAdd}
            className="bg-[#69585F] text-white hover:bg-[#55464D] shadow-sm font-semibold"
          >
            <Plus className="size-4 mr-1.5" />
            <span>{tr({ en: "Create Crop Plan", hi: "नई फसल योजना जोड़ें" })}</span>
          </Button>
        </div>
      </PageHeader>

      <Section>
        {feedbackMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/30 p-4 text-sm font-semibold text-[#43373D]">
            <CheckCircle2 className="size-5 text-[#69585F]" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#DCDFC8] bg-white p-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#69585F]">
              <Filter className="size-3.5" />
              Filter By:
            </span>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 rounded-lg border border-[#DCDFC8] bg-white px-2.5 text-xs font-medium text-[#43373D] focus:outline-none"
            >
              <option value="all">All Statuses ({plans.length})</option>
              <option value="planned">Planned (योजना बनाई)</option>
              <option value="growing">Growing (बढ़ रही है)</option>
              <option value="harvested">Harvested (कटाई पूरी)</option>
              <option value="cancelled">Cancelled (रद्द)</option>
            </select>

            {/* Season Filter */}
            <select
              value={filterSeason}
              onChange={(e) => setFilterSeason(e.target.value)}
              className="h-8 rounded-lg border border-[#DCDFC8] bg-white px-2.5 text-xs font-medium text-[#43373D] focus:outline-none"
            >
              <option value="all">All Seasons</option>
              <option value="kharif">Kharif (खरीफ)</option>
              <option value="rabi">Rabi (रबी)</option>
              <option value="zaid">Zaid (जायद)</option>
            </select>
          </div>

          <div className="text-xs text-[#69585F]">
            Showing <span className="font-bold text-[#43373D]">{filteredPlans.length}</span> of {plans.length} plans
          </div>
        </div>

        {/* Crop Plans Grid */}
        <div className="mt-6">
          {filteredPlans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DCDFC8] bg-white p-12 text-center">
              <Sprout className="mx-auto size-10 text-[#69585F]/50" />
              <h3 className="mt-3 font-display text-lg font-bold text-[#43373D]">
                No crop plans matched your filter
              </h3>
              <p className="mt-1 text-xs text-[#69585F] max-w-sm mx-auto">
                Adjust the status filter or click "Create Crop Plan" to start tracking a new seasonal crop.
              </p>
              <Button onClick={handleOpenAdd} size="sm" className="mt-4 bg-[#69585F] text-white">
                <Plus className="size-3.5 mr-1" />
                Add New Plan
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs transition-hover hover:border-[#B8D8BA]"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#69585F]">
                          {plan.season} Season
                        </span>
                        <h3 className="font-display text-xl font-bold text-[#43373D]">
                          {plan.crop}
                        </h3>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          plan.status === "growing"
                            ? "bg-[#B8D8BA]/50 text-[#382E33]"
                            : plan.status === "harvested"
                              ? "bg-[#D9DBBC] text-[#43373D]"
                              : plan.status === "cancelled"
                                ? "bg-[#EF959D]/40 text-[#43373D]"
                                : "bg-[#FCDDBC] text-[#5B4028]"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>

                    {/* Acreage & Dates */}
                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#F8F9F3] p-3 text-xs border border-[#DCDFC8]">
                      <div>
                        <span className="text-[#69585F] flex items-center gap-1">
                          <Ruler className="size-3" /> Area
                        </span>
                        <span className="font-bold text-[#43373D]">{plan.areaAcres} Acres</span>
                      </div>
                      <div>
                        <span className="text-[#69585F] flex items-center gap-1">
                          <Calendar className="size-3" /> Sown
                        </span>
                        <span className="font-bold text-[#43373D]">{plan.sowingDate}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-[#DCDFC8]/60">
                        <span className="text-[#69585F] flex items-center gap-1">
                          <Clock className="size-3" /> Expected Harvest
                        </span>
                        <span className="font-bold text-[#43373D]">
                          {plan.expectedHarvestDate || "Within 120 days of sowing"}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-[#69585F]">
                        <span>Growth Timeline</span>
                        <span>{plan.stageProgress || 50}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#EBEED8] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#69585F] transition-all"
                          style={{ width: `${plan.stageProgress || 50}%` }}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    {plan.notes && (
                      <p className="mt-3 text-xs text-[#69585F] italic bg-[#F8F9F3] p-2.5 rounded-lg border border-[#DCDFC8]">
                        "{plan.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-[#DCDFC8] flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(plan)}
                      className="border-[#DCDFC8] text-xs hover:bg-[#D9DBBC]/40"
                    >
                      <Edit2 className="size-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(plan.id)}
                      className="border-[#DCDFC8] text-xs text-[#D9534F] hover:bg-[#D9534F] hover:text-white hover:border-[#D9534F]"
                    >
                      <Trash2 className="size-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Add / Edit Crop Plan Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-[#DCDFC8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
              <h3 className="font-display text-lg font-bold text-[#43373D]">
                {editingPlan ? "Edit Crop Plan" : "Create New Crop Plan"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-[#69585F] hover:bg-[#D9DBBC]/40"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="c_crop" className="text-xs font-semibold text-[#43373D]">
                  Crop Name *
                </Label>
                <select
                  id="c_crop"
                  value={formCrop}
                  onChange={(e) => setFormCrop(e.target.value)}
                  className="h-10 w-full rounded-md border border-[#DCDFC8] bg-white px-3 text-sm text-[#43373D]"
                >
                  {crops.map((c) => (
                    <option key={c.id} value={c.name.en}>
                      {c.emoji} {tr(c.name)} ({c.season.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="c_season" className="text-xs font-semibold text-[#43373D]">
                    Season *
                  </Label>
                  <select
                    id="c_season"
                    value={formSeason}
                    onChange={(e) => setFormSeason(e.target.value as Season)}
                    className="h-10 w-full rounded-md border border-[#DCDFC8] bg-white px-3 text-sm text-[#43373D]"
                  >
                    <option value="kharif">Kharif (Monsoon)</option>
                    <option value="rabi">Rabi (Winter)</option>
                    <option value="zaid">Zaid (Summer)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c_area" className="text-xs font-semibold text-[#43373D]">
                    Cultivated Area (Acres) *
                  </Label>
                  <Input
                    id="c_area"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    required
                    placeholder="e.g. 2.5"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="c_sowing" className="text-xs font-semibold text-[#43373D]">
                    Sowing Date *
                  </Label>
                  <Input
                    id="c_sowing"
                    type="date"
                    value={formSowing}
                    onChange={(e) => setFormSowing(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c_harvest" className="text-xs font-semibold text-[#43373D]">
                    Expected Harvest Date
                  </Label>
                  <Input
                    id="c_harvest"
                    type="date"
                    value={formHarvest}
                    onChange={(e) => setFormHarvest(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="c_status" className="text-xs font-semibold text-[#43373D]">
                  Current Status
                </Label>
                <select
                  id="c_status"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as CropPlanStatus)}
                  className="h-10 w-full rounded-md border border-[#DCDFC8] bg-white px-3 text-sm text-[#43373D]"
                >
                  <option value="planned">Planned (तैयारी / बुवाई पूर्व)</option>
                  <option value="growing">Growing / Vegetative (फसल बढ़ रही है)</option>
                  <option value="harvested">Harvested (कटाई पूरी हो चुकी है)</option>
                  <option value="cancelled">Cancelled (रद्द)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="c_notes" className="text-xs font-semibold text-[#43373D]">
                  Field Notes & Observations
                </Label>
                <textarea
                  id="c_notes"
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Seed variety used, fertilizer basal dosage, soil treatment notes..."
                  className="w-full rounded-md border border-[#DCDFC8] bg-white p-2.5 text-xs text-[#43373D] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#DCDFC8]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="border-[#DCDFC8]"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#69585F] text-white">
                  {editingPlan ? "Update Plan" : "Save Crop Plan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
