import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  KeyRound,
  MessageSquare,
  MessageSquarePlus,
  Phone,
  Send,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { faqs, helplines } from "@/data/farm-data";
import { frontendStore, DEFAULT_FARMERS } from "@/services/frontend-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section } from "@/components/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { SupportTicket, SupportTicketCategory } from "@/types/domain";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Farmer Help Desk & Support Ticket System — KisanMitra CE2" },
      {
        name: "description",
        content:
          "Submit farming, pest, or scheme queries directly to agricultural extension officers, track ticket status, and view toll-free helplines.",
      },
    ],
  }),
  component: HelpPage,
});

export function HelpPage() {
  const { t, tr } = useLanguage();
  const { farmer, isAdmin, signIn } = useFarmerSession();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [formSubject, setFormSubject] = useState("");
  const [formCategory, setFormCategory] = useState<SupportTicketCategory>("crop");
  const [formDescription, setFormDescription] = useState("");
  const [feedback, setFeedback] = useState("");

  // Admin reply states
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const reloadTickets = () => {
    if (isAdmin) {
      setTickets(frontendStore.getAllTickets());
    } else if (farmer) {
      setTickets(frontendStore.getTickets(farmer.phone));
    } else {
      setTickets([]);
    }
  };

  useEffect(() => {
    reloadTickets();
  }, [farmer?.phone, isAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmer || !formSubject.trim() || !formDescription.trim()) return;

    frontendStore.submitTicket({
      farmerPhone: farmer.phone,
      farmerName: farmer.name,
      subject: formSubject.trim(),
      category: formCategory,
      description: formDescription.trim(),
    });

    setFormSubject("");
    setFormDescription("");
    reloadTickets();
    setFeedback("Your support ticket has been submitted! An agriculture officer will reply shortly.");
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleAdminReply = (ticketId: string, status: "in_progress" | "resolved") => {
    if (!replyText.trim()) return;
    frontendStore.replyToTicket(ticketId, replyText.trim(), status);
    setReplyTicketId(null);
    setReplyText("");
    reloadTickets();
    setFeedback(`Replied to ticket #${ticketId} and marked as ${status}.`);
    setTimeout(() => setFeedback(""), 4000);
  };

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={tr({ en: "Farmer Help & Grievance Desk", hi: "किसान सहायता एवं समाधान केंद्र" })}
        body={tr({
          en: "Submit specific queries to block agriculture officers, monitor ticket resolution, or call national toll-free farmer helplines.",
          hi: "कृषि अधिकारियों से सीधे प्रश्न पूछें, सहायता टिकट की स्थिति देखें या राष्ट्रीय किसान हेल्पलाइन से संपर्क करें।",
        })}
      />

      <Section>
        {feedback && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/30 p-4 text-xs font-semibold text-[#43373D]">
            <CheckCircle2 className="size-4 text-[#43373D]" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Admin Banner */}
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
                      Administrator Mode — Grievance & Technical Advisory Desk
                    </h2>
                    <span className="rounded-full bg-[#EF959D] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Advisory Authority
                    </span>
                  </div>
                  <p className="text-xs text-[#69585F] mt-0.5">
                    As Krishi Adhikari, review farmer grievance queries, diagnose crop symptoms, and post official extension advisories.
                  </p>
                </div>
              </div>

              <div className="text-xs font-semibold text-[#43373D] bg-white/70 px-3 py-1.5 rounded-lg border border-[#EF959D]/50">
                Pending Farmer Inquiries: {tickets.filter((t) => t.status === "open").length}
              </div>
            </div>
          </div>
        )}

        {/* Emergency Helplines Strip */}
        <div className="grid gap-4 sm:grid-cols-3">
          {helplines.map((h) => (
            <div
              key={h.number}
              className="rounded-2xl border border-[#DCDFC8] bg-white p-5 shadow-xs flex items-center gap-4"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#69585F] text-white shadow-xs">
                <Phone className="size-5 text-[#B8D8BA]" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#69585F]">
                  {tr(h.hours)}
                </span>
                <h3 className="font-display text-lg font-bold text-[#43373D]">{h.number}</h3>
                <p className="text-xs text-[#69585F]">{tr(h.title)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Ticket System Section */}
        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Submit New Query Card (or Guest Sign-in prompt) */}
          <div className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs lg:col-span-2">
            <div className="flex items-center gap-2 border-b border-[#DCDFC8] pb-3">
              <MessageSquarePlus className="size-5 text-[#69585F]" />
              <h3 className="font-display text-base font-bold text-[#43373D]">
                Submit Grievance / Advisory Request
              </h3>
            </div>

            {!farmer ? (
              <div className="mt-6 space-y-4 text-xs">
                <div className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-4 text-[#69585F] leading-relaxed">
                  You are currently browsing the help desk in guest mode. To file an inquiry, receive expert responses from Krishi Vigyan Kendras, and track resolution history, please sign in.
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#69585F]">
                    Quick Sign-in to Submit:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEFAULT_FARMERS.filter((f) => f.role !== "admin").slice(0, 2).map((p) => (
                      <button
                        key={p.phone}
                        type="button"
                        onClick={() => signIn(p)}
                        className="rounded-lg border border-[#DCDFC8] bg-white p-2.5 text-left text-xs font-semibold text-[#43373D] hover:border-[#B8D8BA] cursor-pointer"
                      >
                        {p.name.split(" ")[0]} ({p.state})
                      </button>
                    ))}
                  </div>
                  <Button asChild size="sm" className="w-full bg-[#69585F] text-white mt-2">
                    <Link to="/login">Sign In with Credentials</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="rounded-lg bg-[#F8F9F3] p-2.5 text-[11px] text-[#69585F] border border-[#DCDFC8]">
                  Submitting as: <strong className="text-[#43373D]">{farmer.name}</strong> (+91 {farmer.phone})
                </div>

                <div className="space-y-1">
                  <Label htmlFor="t_subject" className="text-xs font-semibold text-[#43373D]">
                    Subject / Problem Summary *
                  </Label>
                  <Input
                    id="t_subject"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="e.g. Yellow rust observed on Wheat PBW 550"
                    required
                    className="text-xs border-[#DCDFC8]"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="t_category" className="text-xs font-semibold text-[#43373D]">
                    Category *
                  </Label>
                  <select
                    id="t_category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as SupportTicketCategory)}
                    className="h-9 w-full rounded-md border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
                  >
                    <option value="crop">Crop Advisory (फसल सलाह)</option>
                    <option value="pest">Pest & Disease Diagnosis (कीट व रोग)</option>
                    <option value="irrigation">Irrigation / Water (सिंचाई)</option>
                    <option value="scheme">Government Scheme Issues (सरकारी योजना)</option>
                    <option value="market">Mandi & Price Query (मंडी भाव)</option>
                    <option value="other">Other Inquiries (अन्य)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="t_desc" className="text-xs font-semibold text-[#43373D]">
                    Detailed Description & Crop Stage *
                  </Label>
                  <textarea
                    id="t_desc"
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe soil type, symptoms, date of sowing, fertilizers applied..."
                    required
                    className="w-full rounded-md border border-[#DCDFC8] bg-white p-2.5 text-xs text-[#43373D] focus:outline-none"
                  />
                </div>

                <Button type="submit" className="w-full bg-[#69585F] text-white hover:bg-[#55464D] cursor-pointer">
                  <Send className="size-3.5 mr-1.5" />
                  <span>Submit Query to Extension Officer</span>
                </Button>
              </form>
            )}
          </div>

          {/* Submitted Tickets & Admin Responses */}
          <div className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-[#43373D]">
                  {isAdmin ? `All Farmer Support Inquiries (${tickets.length})` : `My Submitted Support Tickets (${tickets.length})`}
                </h3>
                <p className="text-xs text-[#69585F]">
                  {isAdmin
                    ? "Review and provide official agricultural extension advisories to farmers."
                    : "View responses from agricultural extension officers and Krishi Vigyan Kendras."}
                </p>
              </div>
            </div>

            {tickets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#DCDFC8] p-8 text-center text-xs text-[#69585F]">
                {!farmer && !isAdmin
                  ? "Sign in to view and track your submitted grievance tickets."
                  : "No queries submitted yet. Use the form on the left to ask a question."}
              </div>
            ) : (
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                {tickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-4 text-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#69585F]">
                            Ticket #{tkt.id} • {tkt.category.toUpperCase()}
                          </span>
                          {isAdmin && (
                            <span className="text-[10px] font-semibold text-[#43373D] bg-[#D9DBBC]/60 px-2 py-0.5 rounded">
                              Farmer: {tkt.farmerName || tkt.farmerPhone} (+91 {tkt.farmerPhone})
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-sm font-bold text-[#43373D] mt-1">
                          {tkt.subject}
                        </h4>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                          tkt.status === "resolved"
                            ? "bg-[#B8D8BA]/60 text-[#382E33]"
                            : tkt.status === "in_progress"
                              ? "bg-[#FCDDBC] text-[#5B4028]"
                              : "bg-[#D9DBBC] text-[#43373D]"
                        }`}
                      >
                        {tkt.status === "in_progress" ? "In Progress" : tkt.status}
                      </span>
                    </div>

                    <p className="text-[#43373D] leading-relaxed">{tkt.description}</p>

                    <div className="text-[10px] text-[#69585F] flex items-center gap-1">
                      <Clock className="size-3" />
                      Submitted on: {new Date(tkt.createdAt).toLocaleString("en-IN")}
                    </div>

                    {/* Official Admin Response Box */}
                    {tkt.adminReply ? (
                      <div className="rounded-lg border border-[#B8D8BA] bg-white p-3 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#43373D]">
                          <ShieldCheck className="size-3.5 text-[#69585F]" />
                          <span>Official Agriculture Officer Advisory Response:</span>
                        </div>
                        <p className="text-xs text-[#43373D] leading-relaxed pl-5">
                          {tkt.adminReply}
                        </p>
                        {tkt.repliedAt && (
                          <span className="text-[10px] text-[#69585F] pl-5 block">
                            Replied on: {new Date(tkt.repliedAt).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-[#DCDFC8] bg-white/70 p-2 text-[11px] text-[#69585F] italic flex items-center gap-1.5">
                        <Clock className="size-3" />
                        <span>Awaiting extension officer review. Average response time: 24–48 hours.</span>
                      </div>
                    )}

                    {/* Admin Reply Action Form */}
                    {isAdmin && (
                      <div className="pt-2 border-t border-[#DCDFC8]">
                        {replyTicketId === tkt.id ? (
                          <div className="space-y-2 bg-white p-3 rounded-lg border border-[#EF959D]/40">
                            <Label className="text-xs font-bold text-[#43373D]">
                              Write Extension Advisory Reply:
                            </Label>
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type expert advice / solution for this farmer..."
                              className="w-full rounded border border-[#DCDFC8] p-2 text-xs"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setReplyTicketId(null)}
                                className="text-xs h-7 border-[#DCDFC8]"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleAdminReply(tkt.id, "in_progress")}
                                className="text-xs h-7 bg-[#FCDDBC] text-[#5B4028] hover:bg-[#f5cca3]"
                              >
                                Reply (In Progress)
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleAdminReply(tkt.id, "resolved")}
                                className="text-xs h-7 bg-[#69585F] text-white hover:bg-[#52444a]"
                              >
                                Reply & Resolve
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReplyTicketId(tkt.id);
                              setReplyText(tkt.adminReply || "");
                            }}
                            className="text-xs border-[#EF959D] text-[#43373D] hover:bg-[#EF959D]/20 cursor-pointer"
                          >
                            <Shield className="size-3 mr-1 text-[#EF959D]" />
                            {tkt.adminReply ? "Edit Officer Advisory Reply" : "Post Officer Advisory Reply"}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mt-14">
          <h2 className="font-display text-xl font-bold text-[#43373D]">{t("faq")}</h2>
          <p className="text-xs text-[#69585F] mt-0.5">
            Answers to common questions regarding scheme DBT credits, soil cards, and crop insurance claims.
          </p>

          <div className="mt-5 rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-[#DCDFC8]/60">
                  <AccordionTrigger className="text-left font-display font-semibold text-[#43373D] hover:text-[#69585F] py-3 text-sm">
                    {tr(f.q)}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-[#69585F] leading-relaxed pb-3">
                    {tr(f.a)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Section>
    </>
  );
}
