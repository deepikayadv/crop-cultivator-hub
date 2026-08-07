import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <span className="surface-canopy flex size-8 items-center justify-center rounded-lg">
              <Sprout className="size-4" aria-hidden />
            </span>
            <span className="font-display text-base font-semibold">{t("appName")}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t("tagline")}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link to="/schemes" className="text-muted-foreground hover:text-foreground">
            {t("navSchemes")}
          </Link>
          <Link to="/crops" className="text-muted-foreground hover:text-foreground">
            {t("navCrops")}
          </Link>
          <Link to="/market" className="text-muted-foreground hover:text-foreground">
            {t("navMarket")}
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/weather" className="text-muted-foreground hover:text-foreground">
            {t("navWeather")}
          </Link>
          <Link to="/help" className="text-muted-foreground hover:text-foreground">
            {t("navHelp")}
          </Link>
          <Link to="/login" className="text-muted-foreground hover:text-foreground">
            {t("navLogin")}
          </Link>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5">
        <p className="mx-auto max-w-6xl text-xs text-muted-foreground">{t("footerNote")}</p>
      </div>
    </footer>
  );
}
