import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Filter,
  IndianRupee,
  Layers,
  MessageSquare,
  MessageSquareReply,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  Users,
  X,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { crops, schemes } from "@/data/farm-data";
import { frontendStore } from "@/services/frontend-store";
import { getAdminStats, listAdminUsers } from "@/services/farm.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section } from "@/components/PageHeader";
import type { AdminStats, AdminUser, SupportTicket } from "@/types/domain";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administrator Control Panel — KisanMitra CE2" },
      {
        name: "description",
        content: "Manage agricultural schemes, crop catalogs, APMC mandi rates, and respond to farmer grievance tickets.",
      },
    ],
  }),
  component: AdminPage,
});

export function AdminPage() {
  const { t, tr } = useLanguage();
  const { farmer } = useFarmerSession();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTab, setActiveTab] = useState<"tickets" | "farmers" | "schemes" | "crops">("tickets");

  // Search & filter for tickets
  const [ticketSearch, setTicketSearch] = useState("");
  const [ticketFilter, setTicketFilter] = useState("all");

  // Reply Modal
  const [replyTicket, setReplyTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<"in_progress" | "resolved">("resolved");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadAdminData = async () => {
    const s = await getAdminStats();
    const u = await listAdminUsers();
    const t = frontendStore.getAllTickets();
    setStats(s);
    setUsers(u);
    setTickets(t);
  };

  useEffect(() => {
    void loadAdminData();
  }, []);

  const handleOpenReply = (ticket: SupportTicket) => {
    setReplyTicket(ticket);
    setReplyText(ticket.adminReply || "");
    setReplyStatus(ticket.status === "resolved" ? "resolved" : "in_progress");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTicket || !replyText.trim()) return;

    frontendStore.replyToTicket(replyTicket.id, replyText.trim(), replyStatus);
    setReplyTicket(null);
    setReplyText("");
    void loadAdminData();
    setFeedbackMsg("Response dispatched to farmer ticket successfully!");
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  const filteredTickets = tickets.filter((tkt) => {
    const matchStatus = ticketFilter === "all" || tkt.status === ticketFilter;
    const matchQuery =
      ticketSearch === "" ||
      tkt.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      tkt.farmerName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      tkt.farmerPhone.includes(ticketSearch);
    return matchStatus && matchQuery;
  });

  return (
    <>
      <PageHeader
        eyebrow="KisanMitra CE2 Back-Office"
        title={tr({ en: "Administrator Control Portal", hi: "व्यवस्थापक नियंत्रण पोर्टल" })}
        body={tr({
          en: "Authorized administrative interface to oversee registered farmers, respond to extension support tickets, and review scheme catalogs.",
          hi: "पंजीकृत किसानों का प्रबंधन, किसान सहायता टिकटों का उत्तर और सरकारी योजनाओं की निगरानी।",
        })}
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-white/90 bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/20">
          <ShieldCheck className="size-4 text-[#B8D8BA]" />
          <span>Role: Agriculture Extension Administrator (Verified)</span>
        </div>
      </PageHeader>

      <Section>
        {feedbackMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/30 p-4 text-sm font-semibold text-[#43373D]">
            <CheckCircle2 className="size-5 text-[#69585F]" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Global Admin KPI Metrics Strip */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                Registered Farmers
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#B8D8BA]/40 text-[#43373D]">
                <Users className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-[#43373D]">
              {stats?.farmers || 2}
            </p>
            <span className="text-xs text-[#69585F]">Active user accounts</span>
          </div>

          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                Pending Support Tickets
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#EF959D]/30 text-[#43373D]">
                <MessageSquare className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-[#43373D]">
              {tickets.filter((t) => t.status === "open" || t.status === "in_progress").length}
            </p>
            <span className="text-xs text-[#69585F]">Requires officer response</span>
          </div>

          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                Active Crop Plans
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#D9DBBC]/50 text-[#43373D]">
                <Layers className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-[#43373D]">
              {stats?.activeCropPlans || 2}
            </p>
            <span className="text-xs text-[#69585F]">Currently in vegetative/growing stage</span>
          </div>

          <div className="rounded-xl border border-[#DCDFC8] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#69585F]">
                Active Schemes
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#FCDDBC] text-[#5B4028]">
                <FileText className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-[#43373D]">
              {schemes.length}
            </p>
            <span className="text-xs text-[#69585F]">Central subsidies published</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8">
          <div className="flex border-b border-[#DCDFC8] gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("tickets")}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === "tickets"
                  ? "border-b-2 border-[#69585F] text-[#43373D]"
                  : "text-[#69585F] hover:text-[#43373D]"
              }`}
            >
              Support Tickets Desk ({tickets.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("farmers")}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === "farmers"
                  ? "border-b-2 border-[#69585F] text-[#43373D]"
                  : "text-[#69585F] hover:text-[#43373D]"
              }`}
            >
              Registered Farmers ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schemes")}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === "schemes"
                  ? "border-b-2 border-[#69585F] text-[#43373D]"
                  : "text-[#69585F] hover:text-[#43373D]"
              }`}
            >
              Schemes Directory ({schemes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("crops")}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === "crops"
                  ? "border-b-2 border-[#69585F] text-[#43373D]"
                  : "text-[#69585F] hover:text-[#43373D]"
              }`}
            >
              Crop Catalog ({crops.length})
            </button>
          </div>

          {/* Tab 1: Support Tickets Desk */}
          {activeTab === "tickets" && (
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-[#69585F]" />
                  <Input
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    placeholder="Search by subject or farmer..."
                    className="pl-8 h-9 text-xs border-[#DCDFC8]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#69585F] font-semibold">Status:</span>
                  <select
                    value={ticketFilter}
                    onChange={(e) => setTicketFilter(e.target.value)}
                    className="h-9 rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
                  >
                    <option value="all">All Tickets</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-[#DCDFC8] bg-white overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F9F3] text-[#69585F] uppercase border-b border-[#DCDFC8] font-bold">
                    <tr>
                      <th className="px-4 py-3">Ticket ID</th>
                      <th className="px-4 py-3">Farmer</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Subject & Problem</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCDFC8]/60 text-[#43373D]">
                    {filteredTickets.map((tkt) => (
                      <tr key={tkt.id} className="hover:bg-[#F8F9F3]/60 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold">#{tkt.id}</td>
                        <td className="px-4 py-3">
                          <span className="font-semibold block">{tkt.farmerName}</span>
                          <span className="text-[11px] text-[#69585F]">{tkt.farmerPhone}</span>
                        </td>
                        <td className="px-4 py-3 capitalize">
                          <span className="inline-block rounded-md bg-[#D9DBBC]/40 px-2 py-0.5 text-[11px] font-semibold">
                            {tkt.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-sm">
                          <span className="font-semibold block text-[#43373D]">{tkt.subject}</span>
                          <span className="text-[11px] text-[#69585F] line-clamp-1">
                            {tkt.description}
                          </span>
                          {tkt.adminReply && (
                            <span className="mt-1 block text-[10px] text-[#69585F] italic">
                              Replied: "{tkt.adminReply.slice(0, 50)}..."
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                              tkt.status === "resolved"
                                ? "bg-[#B8D8BA]/60 text-[#382E33]"
                                : tkt.status === "in_progress"
                                  ? "bg-[#FCDDBC] text-[#5B4028]"
                                  : "bg-[#EF959D]/30 text-[#43373D]"
                            }`}
                          >
                            {tkt.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenReply(tkt)}
                            className="border-[#DCDFC8] text-xs h-7 hover:bg-[#D9DBBC]/40"
                          >
                            <MessageSquareReply className="size-3 mr-1" />
                            {tkt.adminReply ? "Edit Reply" : "Reply"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Registered Farmers */}
          {activeTab === "farmers" && (
            <div className="mt-6 rounded-2xl border border-[#DCDFC8] bg-white overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9F3] text-[#69585F] uppercase border-b border-[#DCDFC8] font-bold">
                  <tr>
                    <th className="px-4 py-3">Farmer Name</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Account Role</th>
                    <th className="px-4 py-3">Registered Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDFC8]/60 text-[#43373D]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F8F9F3]/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-sm">{u.name}</td>
                      <td className="px-4 py-3 font-mono">{u.phone}</td>
                      <td className="px-4 py-3 text-[#69585F]">{u.email || "—"}</td>
                      <td className="px-4 py-3">
                        {u.village}, {u.district}, {u.state}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            u.role === "admin"
                              ? "bg-[#EF959D] text-white"
                              : "bg-[#B8D8BA]/50 text-[#382E33]"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#69585F]">{u.joinedAt.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Schemes Master */}
          {activeTab === "schemes" && (
            <div className="mt-6 rounded-2xl border border-[#DCDFC8] bg-white overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9F3] text-[#69585F] uppercase border-b border-[#DCDFC8] font-bold">
                  <tr>
                    <th className="px-4 py-3">Scheme Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Summary</th>
                    <th className="px-4 py-3">Official Portal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDFC8]/60 text-[#43373D]">
                  {schemes.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F8F9F3]/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-sm">{tr(s.name)}</td>
                      <td className="px-4 py-3 capitalize">
                        <span className="rounded-md bg-[#D9DBBC]/40 px-2 py-0.5 text-[10px] font-bold">
                          {s.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-sm text-[#69585F]">{tr(s.summary)}</td>
                      <td className="px-4 py-3">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#69585F] hover:underline flex items-center gap-1"
                        >
                          <span>{tr(s.portal)}</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 4: Crop Catalog */}
          {activeTab === "crops" && (
            <div className="mt-6 rounded-2xl border border-[#DCDFC8] bg-white overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9F3] text-[#69585F] uppercase border-b border-[#DCDFC8] font-bold">
                  <tr>
                    <th className="px-4 py-3">Crop</th>
                    <th className="px-4 py-3">Season</th>
                    <th className="px-4 py-3">Sowing Window</th>
                    <th className="px-4 py-3">Harvest Window</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Water Need</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDFC8]/60 text-[#43373D]">
                  {crops.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F8F9F3]/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-sm">
                        {c.emoji} {tr(c.name)}
                      </td>
                      <td className="px-4 py-3 uppercase font-bold text-[#69585F]">{c.season}</td>
                      <td className="px-4 py-3">{tr(c.sowing)}</td>
                      <td className="px-4 py-3">{tr(c.harvest)}</td>
                      <td className="px-4 py-3">{c.durationDays} {tr({ en: "days", hi: "दिन" })}</td>
                      <td className="px-4 py-3">{tr(c.water)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Section>

      {/* Reply Modal Dialog */}
      {replyTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-[#DCDFC8]">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-[#43373D]">
                  Respond to Support Ticket #{replyTicket.id}
                </h3>
                <p className="text-xs text-[#69585F]">
                  Farmer: {replyTicket.farmerName} ({replyTicket.farmerPhone})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyTicket(null)}
                className="text-[#69585F] hover:bg-[#D9DBBC]/40 p-1 rounded-md"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="my-4 rounded-xl bg-[#F8F9F3] p-3 text-xs border border-[#DCDFC8]">
              <span className="font-bold text-[#43373D] block">{replyTicket.subject}</span>
              <p className="mt-1 text-[#69585F] leading-relaxed">{replyTicket.description}</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">
                  Extension Officer Advisory Response *
                </Label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Provide technical guidance, spray dosage, or scheme office procedures..."
                  required
                  className="w-full rounded-md border border-[#DCDFC8] bg-white p-2.5 text-xs text-[#43373D] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#43373D]">Update Status</Label>
                <select
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value as "in_progress" | "resolved")}
                  className="h-9 w-full rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
                >
                  <option value="resolved">Mark as Resolved (समाधान हो गया)</option>
                  <option value="in_progress">Keep In Progress (जांच जारी है)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCDFC8]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReplyTicket(null)}
                  className="border-[#DCDFC8]"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#69585F] text-white">
                  <Send className="size-3.5 mr-1.5" />
                  Dispatch Response
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
