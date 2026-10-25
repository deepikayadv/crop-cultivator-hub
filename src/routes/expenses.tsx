import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  Filter,
  IndianRupee,
  Layers,
  PieChart,
  Plus,
  Search,
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { frontendStore } from "@/services/frontend-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section } from "@/components/PageHeader";
import type { ExpenseCategory, ExpenseEntry, SaleEntry } from "@/types/domain";

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "Farm Expense & Profit Tracker — KisanMitra CE2" },
      {
        name: "description",
        content: "Track seeds, fertilizer, labour, irrigation, and transport expenses alongside harvest crop sales to monitor net farm margin.",
      },
    ],
  }),
  component: ExpensesPage,
});

export function ExpensesPage() {
  const { t, tr } = useLanguage();
  const { farmer } = useFarmerSession();
  const phone = farmer?.phone || "9876543210";

  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"expenses" | "sales">("expenses");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Modals
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);

  // Expense form
  const [expCategory, setExpCategory] = useState<ExpenseCategory>("seed");
  const [expCrop, setExpCrop] = useState("Wheat");
  const [expAmount, setExpAmount] = useState("");
  const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));
  const [expNote, setExpNote] = useState("");

  // Sale form
  const [saleCrop, setSaleCrop] = useState("Wheat");
  const [saleQuintals, setSaleQuintals] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [saleBuyer, setSaleBuyer] = useState("");
  const [saleNotes, setSaleNotes] = useState("");

  const reloadData = () => {
    setExpenses(frontendStore.getExpenses(phone));
    setSales(frontendStore.getSales(phone));
  };

  useEffect(() => {
    reloadData();
  }, [phone]);

  // Financial Authoritative Calculations
  const totalExpense = expenses
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + Number(e.amount || 0), 0);

  const totalRevenue = sales.reduce((s, e) => s + Number(e.totalAmount || 0), 0);
  const netProfit = totalRevenue - totalExpense;

  // Category-wise expense grouping
  const categoryTotals: Record<ExpenseCategory, number> = {
    seed: 0,
    fertilizer: 0,
    labour: 0,
    irrigation: 0,
    transportation: 0,
    equipment: 0,
    sale: 0,
    other: 0,
  };

  expenses.forEach((e) => {
    if (e.type === "expense") {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    }
  });

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount || Number(expAmount) <= 0) return;

    frontendStore.addExpense(
      {
        cropName: expCrop,
        category: expCategory,
        amount: Number(expAmount),
        date: expDate,
        type: "expense",
        note: expNote,
      },
      phone,
    );

    setExpenseModalOpen(false);
    setExpAmount("");
    setExpNote("");
    reloadData();
    setFeedbackMsg("Expense recorded successfully!");
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleQuintals || !salePrice) return;

    frontendStore.addSale(
      {
        crop: saleCrop,
        quantityQuintals: Number(saleQuintals),
        pricePerQuintal: Number(salePrice),
        totalAmount: Number(saleQuintals) * Number(salePrice),
        saleDate,
        buyerName: saleBuyer,
        notes: saleNotes,
      },
      phone,
    );

    setSaleModalOpen(false);
    setSaleQuintals("");
    setSalePrice("");
    setSaleBuyer("");
    setSaleNotes("");
    reloadData();
    setFeedbackMsg("Crop harvest sale recorded successfully!");
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Delete this expense record?")) {
      frontendStore.deleteExpense(id);
      reloadData();
    }
  };

  const handleDeleteSale = (id: string) => {
    if (confirm("Delete this sale record?")) {
      frontendStore.deleteSale(id);
      reloadData();
    }
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchCat = categoryFilter === "all" || e.category === categoryFilter;
    const matchSearch =
      searchQuery === "" ||
      (e.cropName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.note || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredSales = sales.filter((s) => {
    return (
      searchQuery === "" ||
      s.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.buyerName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={tr({ en: "Farm Expense & Profit Tracker", hi: "कृषि खर्च एवं लाभ ट्रैकर" })}
        body={tr({
          en: "Manage operational crop expenses, log harvest sales in quintals, and calculate authoritative net farm margin.",
          hi: "बीज, खाद, मजदूरी और सिंचाई के खर्चों का हिसाब रखें और फसल बिक्री से शुद्ध लाभ/हानि की सटीक गणना करें।",
        })}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => setExpenseModalOpen(true)}
            className="bg-[#69585F] text-white hover:bg-[#55464D] shadow-sm font-semibold"
          >
            <Plus className="size-4 mr-1.5" />
            <span>{tr({ en: "Log Expense", hi: "खर्च दर्ज करें" })}</span>
          </Button>
          <Button
            onClick={() => setSaleModalOpen(true)}
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <TrendingUp className="size-4 mr-1.5 text-[#B8D8BA]" />
            <span>{tr({ en: "Log Harvest Sale", hi: "बिक्री दर्ज करें" })}</span>
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

        {/* Financial Summary KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Total Revenue */}
          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                {tr({ en: "Total Harvest Revenue", hi: "कुल फसल बिक्री" })}
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#B8D8BA]/40 text-[#43373D]">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-[#43373D]">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <span className="text-xs text-[#69585F]">{sales.length} harvest sales</span>
          </div>

          {/* Total Expenses */}
          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                {tr({ en: "Total Expenses Incurred", hi: "कुल कृषि खर्च" })}
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#FCDDBC] text-[#5B4028]">
                <ArrowDownRight className="size-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-[#43373D]">
              ₹{totalExpense.toLocaleString("en-IN")}
            </p>
            <span className="text-xs text-[#69585F]">{expenses.length} input transactions</span>
          </div>

          {/* Net Margin */}
          <div
            className={`rounded-xl border p-5 shadow-xs ${
              netProfit >= 0
                ? "border-[#B8D8BA] bg-[#B8D8BA]/20"
                : "border-[#EF959D] bg-[#EF959D]/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#43373D]">
                {tr({ en: "Net Profit / Margin", hi: "शुद्ध लाभ / मार्जिन" })}
              </span>
              <span
                className={`flex size-8 items-center justify-center rounded-lg font-bold text-xs ${
                  netProfit >= 0 ? "bg-[#69585F] text-white" : "bg-[#D9534F] text-white"
                }`}
              >
                ₹
              </span>
            </div>
            <p
              className={`mt-3 font-display text-3xl font-bold ${
                netProfit >= 0 ? "text-[#43373D]" : "text-[#D9534F]"
              }`}
            >
              {netProfit >= 0 ? "+" : "-"}₹{Math.abs(netProfit).toLocaleString("en-IN")}
            </p>
            <span className="text-xs text-[#69585F]">
              Authoritative: Net = Revenue - Expenses
            </span>
          </div>
        </div>

        {/* Category Breakdown Cards */}
        <div className="mt-8 rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs">
          <h3 className="font-display text-base font-bold text-[#43373D] flex items-center gap-2 mb-4">
            <PieChart className="size-4 text-[#69585F]" />
            <span>Category-wise Expense Distribution</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { key: "seed", label: "Seeds (बीज)" },
              { key: "fertilizer", label: "Fertilizer (खाद)" },
              { key: "labour", label: "Labour (मजदूरी)" },
              { key: "irrigation", label: "Irrigation (सिंचाई)" },
              { key: "transportation", label: "Transport (परिवहन)" },
              { key: "other", label: "Other (अन्य)" },
            ].map(({ key, label }) => {
              const amount = categoryTotals[key as ExpenseCategory] || 0;
              const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
              return (
                <div key={key} className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-3 text-xs">
                  <span className="font-semibold text-[#69585F] truncate block">{label}</span>
                  <p className="mt-1 font-bold text-[#43373D] text-sm">₹{amount.toLocaleString("en-IN")}</p>
                  <span className="text-[10px] text-[#69585F]/80">{pct}% of total</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Controls: Expenses vs Harvest Sales */}
        <div className="mt-8">
          <div className="flex border-b border-[#DCDFC8] gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("expenses")}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === "expenses"
                  ? "border-b-2 border-[#69585F] text-[#43373D]"
                  : "text-[#69585F] hover:text-[#43373D]"
              }`}
            >
              Farm Expenses ({expenses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sales")}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === "sales"
                  ? "border-b-2 border-[#69585F] text-[#43373D]"
                  : "text-[#69585F] hover:text-[#43373D]"
              }`}
            >
              Harvest Sales ({sales.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "expenses" ? (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-2.5 size-4 text-[#69585F]" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search expenses by crop or notes..."
                      className="pl-9 h-9 border-[#DCDFC8] bg-white text-xs"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-9 rounded-md border border-[#DCDFC8] bg-white px-3 text-xs text-[#43373D]"
                  >
                    <option value="all">All Categories</option>
                    <option value="seed">Seeds</option>
                    <option value="fertilizer">Fertilizers</option>
                    <option value="labour">Labour</option>
                    <option value="irrigation">Irrigation</option>
                    <option value="transportation">Transport</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Expenses Table */}
                <div className="rounded-2xl border border-[#DCDFC8] bg-white overflow-hidden shadow-xs">
                  {filteredExpenses.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#69585F]">
                      No expense records found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8F9F3] text-[#69585F] uppercase border-b border-[#DCDFC8] font-bold">
                          <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Crop / Field</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Notes</th>
                            <th className="px-4 py-3 text-right">Amount (₹)</th>
                            <th className="px-4 py-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCDFC8]/60 text-[#43373D]">
                          {filteredExpenses.map((exp) => (
                            <tr key={exp.id} className="hover:bg-[#F8F9F3]/60 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap">{exp.date}</td>
                              <td className="px-4 py-3 font-semibold">{exp.cropName || "General Farm"}</td>
                              <td className="px-4 py-3 capitalize">
                                <span className="inline-flex rounded-md bg-[#D9DBBC]/50 px-2 py-0.5 text-[11px] font-semibold text-[#43373D]">
                                  {exp.category}
                                </span>
                              </td>
                              <td className="px-4 py-3 max-w-xs truncate text-[#69585F]">{exp.note || "—"}</td>
                              <td className="px-4 py-3 text-right font-bold text-[#43373D]">
                                ₹{Number(exp.amount).toLocaleString("en-IN")}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteExpense(exp.id)}
                                  className="text-[#D9534F] hover:underline"
                                  title="Delete expense"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Sales Table */}
                <div className="rounded-2xl border border-[#DCDFC8] bg-white overflow-hidden shadow-xs">
                  {filteredSales.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#69585F]">
                      No harvest sales recorded yet. Click "Log Harvest Sale" to record revenue.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8F9F3] text-[#69585F] uppercase border-b border-[#DCDFC8] font-bold">
                          <tr>
                            <th className="px-4 py-3">Sale Date</th>
                            <th className="px-4 py-3">Crop Sold</th>
                            <th className="px-4 py-3">Quantity (Quintals)</th>
                            <th className="px-4 py-3">Rate (₹/Quintal)</th>
                            <th className="px-4 py-3">Buyer / Mandi</th>
                            <th className="px-4 py-3 text-right">Total Revenue (₹)</th>
                            <th className="px-4 py-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCDFC8]/60 text-[#43373D]">
                          {filteredSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-[#F8F9F3]/60 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap">{sale.saleDate}</td>
                              <td className="px-4 py-3 font-semibold">{sale.crop}</td>
                              <td className="px-4 py-3">{sale.quantityQuintals} qtl</td>
                              <td className="px-4 py-3">₹{Number(sale.pricePerQuintal).toLocaleString("en-IN")}</td>
                              <td className="px-4 py-3 text-[#69585F]">{sale.buyerName || "Mandi Trader"}</td>
                              <td className="px-4 py-3 text-right font-bold text-[#43373D]">
                                ₹{Number(sale.totalAmount).toLocaleString("en-IN")}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSale(sale.id)}
                                  className="text-[#D9534F] hover:underline"
                                  title="Delete sale"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Add Expense Modal */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#DCDFC8]">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
              <h3 className="font-display font-bold text-[#43373D]">Log New Farm Expense</h3>
              <button
                type="button"
                onClick={() => setExpenseModalOpen(false)}
                className="text-[#69585F] hover:bg-[#D9DBBC]/40 p-1 rounded-md"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="mt-4 space-y-3.5">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Crop / Field</Label>
                <Input
                  value={expCrop}
                  onChange={(e) => setExpCrop(e.target.value)}
                  placeholder="e.g. Wheat, Mustard, Paddy"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#43373D]">Category *</Label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                    className="h-9 w-full rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
                  >
                    <option value="seed">Seeds (बीज)</option>
                    <option value="fertilizer">Fertilizer (खाद)</option>
                    <option value="labour">Labour (मजदूरी)</option>
                    <option value="irrigation">Irrigation (सिंचाई)</option>
                    <option value="transportation">Transport (भाड़ा)</option>
                    <option value="equipment">Equipment (यंत्र)</option>
                    <option value="other">Other (अन्य)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#43373D]">Amount (INR ₹) *</Label>
                  <Input
                    type="number"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    placeholder="e.g. 4500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Expense Date *</Label>
                <Input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Optional Notes</Label>
                <Input
                  value={expNote}
                  onChange={(e) => setExpNote(e.target.value)}
                  placeholder="e.g. 2 bags of DAP from cooperative society"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCDFC8]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setExpenseModalOpen(false)}
                  className="border-[#DCDFC8]"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#69585F] text-white">
                  Save Expense
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Harvest Sale Modal */}
      {saleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#DCDFC8]">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
              <h3 className="font-display font-bold text-[#43373D]">Log Crop Harvest Sale</h3>
              <button
                type="button"
                onClick={() => setSaleModalOpen(false)}
                className="text-[#69585F] hover:bg-[#D9DBBC]/40 p-1 rounded-md"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaleSubmit} className="mt-4 space-y-3.5">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Crop Sold *</Label>
                <Input
                  value={saleCrop}
                  onChange={(e) => setSaleCrop(e.target.value)}
                  placeholder="e.g. Wheat, Basmati Rice"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#43373D]">Quantity (Quintals) *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={saleQuintals}
                    onChange={(e) => setSaleQuintals(e.target.value)}
                    placeholder="e.g. 35"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#43373D]">Rate (₹ / Quintal) *</Label>
                  <Input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="e.g. 2275"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Total Revenue</Label>
                <div className="h-9 flex items-center px-3 rounded-md bg-[#F8F9F3] border border-[#DCDFC8] text-sm font-bold text-[#43373D]">
                  ₹
                  {(
                    Number(saleQuintals || 0) * Number(salePrice || 0)
                  ).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Sale Date *</Label>
                <Input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Buyer / Mandi Trader</Label>
                <Input
                  value={saleBuyer}
                  onChange={(e) => setSaleBuyer(e.target.value)}
                  placeholder="e.g. Karnal Grain Market Arhtiya"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCDFC8]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSaleModalOpen(false)}
                  className="border-[#DCDFC8]"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#69585F] text-white">
                  Save Harvest Sale
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
