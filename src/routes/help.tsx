import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { faqs, helplines } from "@/data/farm-data";
import { PageHeader, Section } from "@/components/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Farmer Helplines & Common Questions — KisanMitra" },
      {
        name: "description",
        content:
          "Toll-free numbers for the Kisan Call Centre, PM-KISAN helpdesk and crop insurance, plus answers to the questions farmers ask most.",
      },
      { property: "og:title", content: "Farmer Helplines & Common Questions" },
      {
        property: "og:description",
        content: "Toll-free farm helplines and answers to common scheme and insurance questions.",
      },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const { t, tr } = useLanguage();

  return (
    <>
      <PageHeader eyebrow={t("appName")} title={t("navHelp")} body={t("helpBody")} />

      <Section>
        <h2 className="font-display text-xl font-semibold">{t("helplines")}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {helplines.map((h) => (
            <a
              key={h.id}
              href={`tel:${h.number.replace(/-/g, "")}`}
              className="card-soft flex items-center gap-4 p-5"
            >
              <span className="surface-sprout flex size-11 shrink-0 items-center justify-center rounded-lg">
                <Phone className="size-5 text-primary" aria-hidden />
              </span>
              <div>
                <p className="font-display text-base font-semibold">{tr(h.label)}</p>
                <p className="text-sm font-medium text-primary">{h.number}</p>
                <p className="text-xs text-muted-foreground">{tr(h.note)}</p>
              </div>
            </a>
          ))}
        </div>

        <h2 className="mt-12 font-display text-xl font-semibold">{t("faq")}</h2>
        <Accordion type="single" collapsible className="mt-3">
          {faqs.map((f) => (
            <AccordionItem key={f.id} value={f.id}>
              <AccordionTrigger className="text-left">{tr(f.q)}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{tr(f.a)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  );
}
