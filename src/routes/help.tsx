import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageSquare,
  MessageSquarePlus,
  Phone,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { faqs, helplines } from "@/data/farm-data";
import { frontendStore } from "@/services/frontend-store";
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
  const { farmer } = useFarmerSession();
  const phone = farmer?.phone || "9876543210";
  const name = farmer?.name || "Ramesh Kumar";

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [formSubject, setFormSubject] = useState("");
  const [formCategory, setFormCategory] = useState<SupportTicketCategory>("crop");
  const [formDescription, setFormDescription] = useState("");
  const [feedback, setFeedback] = useState("");

  const reloadTickets = () => {
    setTickets(frontendStore.getTickets(phone));
  };

  useEffect(() => {
    reloadTickets();
  }, [phone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formDescription.trim()) return;

    frontendStore.submitTicket({
      farmerPhone: phone,
      farmerName: name,
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

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={tr({ en: "Farmer Help & Grievance Desk", hi: "किसान सहायता एवं समाधान केंद्र" })}
        body={tr({
          en: "Submit specific queries to block agriculture officers, monitor ticket resolution, or call national toll-free farmer helplines.",
          hi: "कृषि अधिकारियों से सीधे सवाल पूछें, टिकट की स्थिति देखें या राष्ट्रीय टोल-फ़्री किसान हेल्पलाइन पर बात करें।",
        })}
      />

      <Section>
        {/* Helplines Strip */}
        <div>
          <h2 className="font-display text-xl font-bold text-[#43373D]">{t("helplines")}</h2>
          <p className="text-xs text-[#69585F] mt-0.5">
            Free national telephone assistance for immediate crop, weather, and insurance advice.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {helplines.map((h) => (
              <a
                key={h.id}
                href={`tel:${h.number.replace(/-/g, "")}`}
                className="rounded-2xl border border-[#DCDFC8] bg-white p-5 shadow-xs transition-hover hover:border-[#B8D8BA] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-[#B8D8BA]/40 text-[#43373D]">
                      <Phone className="size-4" />
                    </span>
                    <span className="font-display text-sm font-bold text-[#43373D]">
                      {tr(h.label)}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-lg font-bold text-[#69585F]">{h.number}</p>
                </div>
                <p className="mt-2 text-xs text-[#69585F]">{tr(h.note)}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Support Query Ticket System */}
        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Submit Query Form */}
          <div className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs lg:col-span-2">
            <div className="flex items-center gap-2 border-b border-[#DCDFC8] pb-3">
              <MessageSquarePlus className="size-5 text-[#69585F]" />
              <div>
                <h3 className="font-display text-base font-bold text-[#43373D]">
                  Submit Agricultural Query
                </h3>
                <p className="text-xs text-[#69585F]">
                  Logged as: <span className="font-semibold">{name}</span> ({phone})
                </p>
              </div>
            </div>

            {feedback && (
              <div className="mt-4 rounded-xl border border-[#B8D8BA] bg-[#B8D8BA]/30 p-3 text-xs font-semibold text-[#43373D] flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#69585F] shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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

              <Button type="submit" className="w-full bg-[#69585F] text-white hover:bg-[#55464D]">
                <Send className="size-3.5 mr-1.5" />
                <span>Submit Query to Extension Officer</span>
              </Button>
            </form>
          </div>

          {/* Submitted Tickets & Admin Responses */}
          <div className="rounded-2xl border border-[#DCDFC8] bg-white p-6 shadow-xs lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCDFC8] pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-[#43373D]">
                  My Submitted Support Tickets ({tickets.length})
                </h3>
                <p className="text-xs text-[#69585F]">
                  View responses from agricultural extension officers and Krishi Vigyan Kendras.
                </p>
              </div>
            </div>

            {tickets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#DCDFC8] p-8 text-center text-xs text-[#69585F]">
                No queries submitted yet. Use the form on the left to ask a question.
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {tickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className="rounded-xl border border-[#DCDFC8] bg-[#F8F9F3] p-4 text-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#69585F]">
                          Ticket #{tkt.id} • {tkt.category.toUpperCase()}
                        </span>
                        <h4 className="font-display text-sm font-bold text-[#43373D] mt-0.5">
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
