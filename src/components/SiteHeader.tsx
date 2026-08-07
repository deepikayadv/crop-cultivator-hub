import { Link } from "@tanstack/react-router";
import { Menu, Sprout, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", key: "navHome" },
  { to: "/schemes", key: "navSchemes" },
  { to: "/crops", key: "navCrops" },
  { to: "/market", key: "navMarket" },
  { to: "/weather", key: "navWeather" },
  { to: "/help", key: "navHelp" },
] as const;

export function SiteHeader() {
  const { t, lang, setLang } = useLanguage();
  const { farmer } = useFarmerSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="surface-canopy flex size-9 items-center justify-center rounded-lg">
            <Sprout className="size-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">{t("appName")}</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground font-medium" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <div
            className="flex items-center rounded-full border border-border bg-card p-0.5"
            role="group"
            aria-label="Language"
          >
            {(["en", "hi"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  lang === code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {code === "en" ? "EN" : "हिं"}
              </button>
            ))}
          </div>

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to={farmer ? "/profile" : "/login"}>
              {farmer ? t("navProfile") : t("navLogin")}
            </Link>
          </Button>

          <button
            type="button"
            className="rounded-md p-2 text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-card px-4 py-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground"
              activeProps={{ className: "bg-secondary text-foreground font-medium" }}
            >
              {t(l.key)}
            </Link>
          ))}
          <Link
            to={farmer ? "/profile" : "/login"}
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-primary"
          >
            {farmer ? t("navProfile") : t("navLogin")}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
