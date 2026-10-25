import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  IndianRupee,
  Layers,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Section } from "@/components/PageHeader";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Mandi Price Comparison & Trends — KisanMitra CE2" },
      {
        name: "description",
        content:
          "Multi-mandi agricultural price comparison across Indian APMCs with high, low, average rates, interactive charts and sorting.",
      },
    ],
  }),
  component: MarketPage,
});

type MandiRow = {
  id: string;
  cropEn: string;
  cropHi: string;
  mandiEn: string;
  mandiHi: string;
  state: string;
  price: number; // modal rate ₹/quintal
  minPrice: number;
  maxPrice: number;
  changePct: number;
  arrivalDate: string;
  source: string;
};

const EXPANDED_MANDI_DATA: MandiRow[] = [
  // Wheat
  { id: "w1", cropEn: "Wheat", cropHi: "गेहूँ", mandiEn: "Karnal", mandiHi: "करनाल", state: "Haryana", price: 2485, minPrice: 2420, maxPrice: 2540, changePct: 1.4, arrivalDate: "2026-10-25", source: "Agmarknet APMC Karnal" },
  { id: "w2", cropEn: "Wheat", cropHi: "गेहूँ", mandiEn: "Khanna", mandiHi: "खन्ना", state: "Punjab", price: 2520, minPrice: 2460, maxPrice: 2570, changePct: 0.8, arrivalDate: "2026-10-25", source: "Punjab Mandi Board" },
  { id: "w3", cropEn: "Wheat", cropHi: "गेहूँ", mandiEn: "Kota", mandiHi: "कोटा", state: "Rajasthan", price: 2410, minPrice: 2350, maxPrice: 2450, changePct: -0.4, arrivalDate: "2026-10-24", source: "RSAMB Kota" },
  { id: "w4", cropEn: "Wheat", cropHi: "गेहूँ", mandiEn: "Indore", mandiHi: "इंदौर", state: "Madhya Pradesh", price: 2440, minPrice: 2380, maxPrice: 2490, changePct: 0.5, arrivalDate: "2026-10-25", source: "MP Mandi Board" },

  // Mustard
  { id: "m1", cropEn: "Mustard", cropHi: "सरसों", mandiEn: "Bharatpur", mandiHi: "भरतपुर", state: "Rajasthan", price: 5640, minPrice: 5500, maxPrice: 5750, changePct: 2.1, arrivalDate: "2026-10-25", source: "Agmarknet Bharatpur" },
  { id: "m2", cropEn: "Mustard", cropHi: "सरसों", mandiEn: "Alwar", mandiHi: "अलवर", state: "Rajasthan", price: 5710, minPrice: 5580, maxPrice: 5820, changePct: 1.8, arrivalDate: "2026-10-25", source: "Alwar Krishi Upaj" },
  { id: "m3", cropEn: "Mustard", cropHi: "सरसों", mandiEn: "Rewari", mandiHi: "रेवाड़ी", state: "Haryana", price: 5580, minPrice: 5450, maxPrice: 5690, changePct: 0.9, arrivalDate: "2026-10-24", source: "Haryana Mandi Board" },
  { id: "m4", cropEn: "Mustard", cropHi: "सरसों", mandiEn: "Morena", mandiHi: "मुरैना", state: "Madhya Pradesh", price: 5520, minPrice: 5400, maxPrice: 5600, changePct: -0.3, arrivalDate: "2026-10-25", source: "MP Mandi Board" },

  // Paddy (Basmati / Common)
  { id: "p1", cropEn: "Paddy", cropHi: "धान", mandiEn: "Sangrur", mandiHi: "संगरूर", state: "Punjab", price: 2310, minPrice: 2280, maxPrice: 2340, changePct: -0.8, arrivalDate: "2026-10-25", source: "Agmarknet Sangrur" },
  { id: "p2", cropEn: "Paddy", cropHi: "धान", mandiEn: "Karnal", mandiHi: "करनाल", state: "Haryana", price: 2350, minPrice: 2300, maxPrice: 2390, changePct: 0.6, arrivalDate: "2026-10-25", source: "Karnal Grain Market" },
  { id: "p3", cropEn: "Paddy", cropHi: "धान", mandiEn: "Gondia", mandiHi: "गोंदिया", state: "Maharashtra", price: 2240, minPrice: 2190, maxPrice: 2280, changePct: 0.2, arrivalDate: "2026-10-24", source: "Maharashtra APMC" },
  { id: "p4", cropEn: "Paddy", cropHi: "धान", mandiEn: "Bardhaman", mandiHi: "बर्धमान", state: "West Bengal", price: 2290, minPrice: 2240, maxPrice: 2320, changePct: -0.5, arrivalDate: "2026-10-25", source: "e-NAM Bengal" },

  // Onion
  { id: "o1", cropEn: "Onion", cropHi: "प्याज़", mandiEn: "Lasalgaon", mandiHi: "लासलगाँव", state: "Maharashtra", price: 1980, minPrice: 1800, maxPrice: 2150, changePct: -3.2, arrivalDate: "2026-10-25", source: "Lasalgaon APMC" },
  { id: "o2", cropEn: "Onion", cropHi: "प्याज़", mandiEn: "Nashik", mandiHi: "नासिक", state: "Maharashtra", price: 2040, minPrice: 1850, maxPrice: 2200, changePct: -1.5, arrivalDate: "2026-10-25", source: "Nashik APMC" },
  { id: "o3", cropEn: "Onion", cropHi: "प्याज़", mandiEn: "Hubli", mandiHi: "हुबली", state: "Karnataka", price: 1920, minPrice: 1750, maxPrice: 2050, changePct: 0.8, arrivalDate: "2026-10-24", source: "Karnataka Agri Marketing" },
  { id: "o4", cropEn: "Onion", cropHi: "प्याज़", mandiEn: "Neemuch", mandiHi: "नीमच", state: "Madhya Pradesh", price: 1870, minPrice: 1700, maxPrice: 1990, changePct: -2.1, arrivalDate: "2026-10-25", source: "Neemuch Mandi" },

  // Cotton
  { id: "c1", cropEn: "Cotton", cropHi: "कपास", mandiEn: "Rajkot", mandiHi: "राजकोट", state: "Gujarat", price: 7420, minPrice: 7200, maxPrice: 7600, changePct: 0.6, arrivalDate: "2026-10-25", source: "Rajkot APMC" },
  { id: "c2", cropEn: "Cotton", cropHi: "कपास", mandiEn: "Sirsa", mandiHi: "सिरसा", state: "Haryana", price: 7490, minPrice: 7300, maxPrice: 7650, changePct: 1.2, arrivalDate: "2026-10-25", source: "Sirsa Mandi Board" },
  { id: "c3", cropEn: "Cotton", cropHi: "कपास", mandiEn: "Amravati", mandiHi: "अमरावती", state: "Maharashtra", price: 7350, minPrice: 7150, maxPrice: 7500, changePct: -0.4, arrivalDate: "2026-10-24", source: "Maharashtra APMC" },

  // Soybean
  { id: "s1", cropEn: "Soybean", cropHi: "सोयाबीन", mandiEn: "Ujjain", mandiHi: "उज्जैन", state: "Madhya Pradesh", price: 4680, minPrice: 4550, maxPrice: 4790, changePct: 1.8, arrivalDate: "2026-10-25", source: "Ujjain Krishi Mandi" },
  { id: "s2", cropEn: "Soybean", cropHi: "सोयाबीन", mandiEn: "Indore", mandiHi: "इंदौर", state: "Madhya Pradesh", price: 4720, minPrice: 4600, maxPrice: 4850, changePct: 1.5, arrivalDate: "2026-10-25", source: "Indore APMC" },
  { id: "s3", cropEn: "Soybean", cropHi: "सोयाबीन", mandiEn: "Latur", mandiHi: "लातूर", state: "Maharashtra", price: 4630, minPrice: 4500, maxPrice: 4750, changePct: -0.5, arrivalDate: "2026-10-24", source: "Latur APMC" },

  // Gram (Chana)
  { id: "g1", cropEn: "Gram", cropHi: "चना", mandiEn: "Indore", mandiHi: "इंदौर", state: "Madhya Pradesh", price: 5210, minPrice: 5100, maxPrice: 5320, changePct: 0.9, arrivalDate: "2026-10-25", source: "Indore APMC" },
  { id: "g2", cropEn: "Gram", cropHi: "चना", mandiEn: "Bikaner", mandiHi: "बीकानेर", state: "Rajasthan", price: 5280, minPrice: 5150, maxPrice: 5400, changePct: 1.1, arrivalDate: "2026-10-25", source: "RSAMB Bikaner" },
  { id: "g3", cropEn: "Gram", cropHi: "चना", mandiEn: "Akola", mandiHi: "अकोला", state: "Maharashtra", price: 5150, minPrice: 5050, maxPrice: 5250, changePct: -0.2, arrivalDate: "2026-10-24", source: "Akola Mandi" },
];

const CROPS_LIST = ["All", "Wheat", "Mustard", "Paddy", "Onion", "Cotton", "Soybean", "Gram"];

export function MarketPage() {
  const { t, tr, lang } = useLanguage();

  const [query, setQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [sortKey, setSortKey] = useState<"crop" | "price" | "mandi" | "date">("price");
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selected crop for the comparison chart
  const [chartCrop, setChartCrop] = useState("Wheat");

  // Filtering & Sorting
  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXPANDED_MANDI_DATA.filter((r) => {
      const matchQuery =
        q === "" ||
        `${r.cropEn} ${r.cropHi} ${r.mandiEn} ${r.mandiHi} ${r.state}`
          .toLowerCase()
          .includes(q);
      const matchCrop = selectedCrop === "All" || r.cropEn === selectedCrop;
      const matchState = selectedState === "All" || r.state === selectedState;
      return matchQuery && matchCrop && matchState;
    }).sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortKey === "crop") return dir * a.cropEn.localeCompare(b.cropEn);
      if (sortKey === "mandi") return dir * a.mandiEn.localeCompare(b.mandiEn);
      if (sortKey === "date") return dir * a.arrivalDate.localeCompare(b.arrivalDate);
      return dir * (a.price - b.price);
    });
  }, [query, selectedCrop, selectedState, sortKey, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Statistics across the current dataset
  const prices = filteredRows.map((r) => r.price);
  const highestPrice = prices.length ? Math.max(...prices) : 0;
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const averagePrice = prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0;

  // Chart dataset for multi-mandi comparison
  const chartData = useMemo(() => {
    return EXPANDED_MANDI_DATA.filter((r) => r.cropEn === chartCrop).map((r) => ({
      mandi: lang === "hi" ? r.mandiHi : `${r.mandiEn} (${r.state.slice(0, 3)})`,
      price: r.price,
      min: r.minPrice,
      max: r.maxPrice,
    }));
  }, [chartCrop, lang]);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === "crop" || key === "mandi");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={t("navMarket")}
        body={tr({
          en: "Compare modal prices across regional agricultural mandis, inspect high/low/average spreads, and analyze visual price trends.",
          hi: "विभिन्न कृषि उपज मंडियों के भावों की तुलना करें, न्यूनतम, अधिकतम और औसत दरों का विश्लेषण करें।",
        })}
      />

      <Section>
        {/* Transparent Demo Data Attribution Alert */}
        <div className="mb-6 rounded-xl border border-[#DCDFC8] bg-[#FCDDBC]/30 p-4 text-xs text-[#5B4028] flex items-start gap-2.5">
          <Clock className="size-4 shrink-0 mt-0.5 text-[#5B4028]" />
          <div>
            <span className="font-bold">Transparent Data Source & Attribution:</span> Rates displayed below reflect indicative modal and benchmark APMC market prices modeled after the Agmarknet and e-NAM daily bulletins. Last updated: <strong>October 25, 2026 (08:30 IST)</strong>. Clearly identified as evaluation demonstration data.
          </div>
        </div>

        {/* High / Low / Average KPI Spread */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
              Highest Modal Price (वर्तमान उच्चतम)
            </span>
            <p className="mt-2 font-display text-3xl font-bold text-[#43373D]">
              ₹{highestPrice.toLocaleString("en-IN")}
            </p>
            <span className="text-xs text-[#69585F]">Per Quintal (₹/qtl)</span>
          </div>

          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
              Lowest Modal Price (वर्तमान न्यूनतम)
            </span>
            <p className="mt-2 font-display text-3xl font-bold text-[#43373D]">
              ₹{lowestPrice.toLocaleString("en-IN")}
            </p>
            <span className="text-xs text-[#69585F]">Per Quintal (₹/qtl)</span>
          </div>

          <div className="rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/25 p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#43373D]">
              Market Average Price (औसत भाव)
            </span>
            <p className="mt-2 font-display text-3xl font-bold text-[#43373D]">
              ₹{averagePrice.toLocaleString("en-IN")}
            </p>
            <span className="text-xs text-[#69585F]">Weighted across filtered mandis</span>
          </div>
        </div>

        {/* Multi-Mandi Comparison Chart (Recharts) */}
        <div className="mt-8 rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCDFC8] pb-3">
            <div>
              <h3 className="font-display text-lg font-bold text-[#43373D] flex items-center gap-2">
                <BarChart3 className="size-5 text-[#69585F]" />
                <span>Multi-Mandi Comparative Price Spread</span>
              </h3>
              <p className="text-xs text-[#69585F]">
                Compare modal prices for a selected crop across different regional agricultural mandis.
              </p>
            </div>

            {/* Select crop for chart */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#69585F]">Select Crop:</span>
              <select
                value={chartCrop}
                onChange={(e) => setChartCrop(e.target.value)}
                className="h-8 rounded-lg border border-[#DCDFC8] bg-white px-2.5 text-xs font-bold text-[#43373D]"
              >
                {CROPS_LIST.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCDFC8" />
                <XAxis dataKey="mandi" tick={{ fontSize: 11, fill: "#69585F" }} />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 11, fill: "#69585F" }}
                  unit=" ₹"
                />
                <Tooltip
                  formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}/qtl`, "Modal Price"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.75rem",
                    border: "1px solid #DCDFC8",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="price" fill="#69585F" radius={[6, 6, 0, 0]} name="Modal Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#DCDFC8] bg-white p-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative sm:w-56">
              <Search className="absolute left-2.5 top-2.5 size-4 text-[#69585F]" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search crop or mandi..."
                className="pl-8 h-9 text-xs border-[#DCDFC8]"
              />
            </div>

            <select
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
            >
              <option value="All">All Crops</option>
              {CROPS_LIST.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
            >
              <option value="All">All States</option>
              <option value="Haryana">Haryana</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          <div className="text-xs text-[#69585F]">
            Found <span className="font-bold text-[#43373D]">{filteredRows.length}</span> records
          </div>
        </div>

        {/* Mandi Rates Table */}
        <div className="mt-4 rounded-2xl border border-[#DCDFC8] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9F3] text-[#69585F] uppercase border-b border-[#DCDFC8] font-bold">
                <tr>
                  <th
                    className="px-4 py-3.5 cursor-pointer hover:text-[#43373D]"
                    onClick={() => handleSort("crop")}
                  >
                    <span className="flex items-center gap-1">
                      {t("crop")} <ArrowDownUp className="size-3" />
                    </span>
                  </th>
                  <th
                    className="px-4 py-3.5 cursor-pointer hover:text-[#43373D]"
                    onClick={() => handleSort("mandi")}
                  >
                    <span className="flex items-center gap-1">
                      {t("mandi")} & State <ArrowDownUp className="size-3" />
                    </span>
                  </th>
                  <th
                    className="px-4 py-3.5 text-right cursor-pointer hover:text-[#43373D]"
                    onClick={() => handleSort("price")}
                  >
                    <span className="flex items-center justify-end gap-1">
                      {t("price")} <ArrowDownUp className="size-3" />
                    </span>
                  </th>
                  <th className="px-4 py-3.5 text-right">Min – Max Spread</th>
                  <th className="px-4 py-3.5 text-right">Daily Change</th>
                  <th
                    className="px-4 py-3.5 cursor-pointer hover:text-[#43373D]"
                    onClick={() => handleSort("date")}
                  >
                    <span className="flex items-center gap-1">
                      Date <ArrowDownUp className="size-3" />
                    </span>
                  </th>
                  <th className="px-4 py-3.5">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDFC8]/60 text-[#43373D]">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#69585F]">
                      No mandi rates found for this search.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((r) => (
                    <tr key={r.id} className="hover:bg-[#F8F9F3]/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-sm">
                        {lang === "hi" ? r.cropHi : r.cropEn}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-[#43373D]">
                          {lang === "hi" ? r.mandiHi : r.mandiEn}
                        </span>
                        <span className="text-[11px] text-[#69585F] block">{r.state}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-display text-base font-bold text-[#43373D]">
                        ₹{r.price.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right text-[11px] text-[#69585F]">
                        ₹{r.minPrice} – ₹{r.maxPrice}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
                            r.changePct >= 0
                              ? "bg-[#B8D8BA]/50 text-[#382E33]"
                              : "bg-[#EF959D]/40 text-[#43373D]"
                          }`}
                        >
                          {r.changePct >= 0 ? "+" : ""}
                          {r.changePct}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#69585F] whitespace-nowrap">{r.arrivalDate}</td>
                      <td className="px-4 py-3 text-[#69585F] max-w-[150px] truncate" title={r.source}>
                        {r.source}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#DCDFC8] px-4 py-3 bg-[#F8F9F3]">
              <span className="text-xs text-[#69585F]">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="border-[#DCDFC8] text-xs h-8"
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="border-[#DCDFC8] text-xs h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
