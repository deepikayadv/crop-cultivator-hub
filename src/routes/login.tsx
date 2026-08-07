import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { crops } from "@/data/farm-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/PageHeader";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — KisanMitra Farmer Account" },
      {
        name: "description",
        content:
          "Sign in with your mobile number to get a personalised feed of schemes, mandi prices and weather alerts for your village and crop.",
      },
      { property: "og:title", content: "Sign in — KisanMitra Farmer Account" },
      {
        property: "og:description",
        content: "Create your farmer profile for personalised schemes, prices and alerts.",
      },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  name: z.string().trim().min(2, "Enter your name").max(60),
  village: z.string().trim().min(2, "Enter your village or district").max(80),
  landSize: z.string().trim().max(10).optional().or(z.literal("")),
  mainCrop: z.string().trim().max(40).optional().or(z.literal("")),
});

function LoginPage() {
  const { t, tr } = useLanguage();
  const { signIn } = useFarmerSession();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const raw = {
      phone: String(form.get("phone") ?? ""),
      name: String(form.get("name") ?? ""),
      village: String(form.get("village") ?? ""),
      landSize: String(form.get("landSize") ?? ""),
      mainCrop: String(form.get("mainCrop") ?? ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    signIn({
      phone: parsed.data.phone,
      name: parsed.data.name,
      village: parsed.data.village,
      landSize: parsed.data.landSize ?? "",
      mainCrop: parsed.data.mainCrop ?? "",
    });
    void navigate({ to: "/profile" });
  };

  return (
    <Section>
      <div className="mx-auto max-w-lg">
        <h1 className="font-display text-3xl font-semibold">{t("signInTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("signInBody")}</p>

        <form onSubmit={onSubmit} className="card-soft mt-8 space-y-5 p-6" noValidate>
          <Field id="phone" label={t("phone")} error={errors["phone"]}>
            <Input id="phone" name="phone" inputMode="numeric" maxLength={10} placeholder="98XXXXXXXX" />
          </Field>
          <Field id="name" label={t("name")} error={errors["name"]}>
            <Input id="name" name="name" maxLength={60} />
          </Field>
          <Field id="village" label={t("village")} error={errors["village"]}>
            <Input id="village" name="village" maxLength={80} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="landSize" label={t("landSize")} error={errors["landSize"]}>
              <Input id="landSize" name="landSize" inputMode="decimal" maxLength={10} />
            </Field>
            <Field id="mainCrop" label={t("mainCrop")} error={errors["mainCrop"]}>
              <select
                id="mainCrop"
                name="mainCrop"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                defaultValue=""
              >
                <option value="">—</option>
                {crops.map((c) => (
                  <option key={c.id} value={c.name.en}>
                    {tr(c.name)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Button type="submit" className="w-full" size="lg">
            {t("continueBtn")}
          </Button>
          <p className="text-xs text-muted-foreground">{t("demoNote")}</p>
        </form>
      </div>
    </Section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
