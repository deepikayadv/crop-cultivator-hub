import { Link } from "@tanstack/react-router";
import { Shield, Sprout } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function SiteFooter() {
  const { t, tr } = useLanguage();

  return (
    <footer className="mt-20 border-t border-[#DCDFC8] bg-[#D9DBBC]/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#69585F] text-white shadow-xs">
              <Sprout className="size-4 text-[#B8D8BA]" aria-hidden />
            </span>
            <span className="font-display text-base font-bold text-[#43373D]">{t("appName")}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-[#69585F]">{t("tagline")}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#69585F]/80">
            <span className="inline-block size-2 rounded-full bg-[#B8D8BA]" />
            <span>Continuous Evaluation 2 (CE2) Full-Stack Upgrade</span>
          </div>
        </div>

        {/* Farming Links */}
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold text-[#43373D]">{t("navFarming")}</p>
          <Link to="/crops" className="text-[#69585F] hover:text-[#43373D] transition-colors">
            {t("navCrops")}
          </Link>
          <Link to="/planner" className="text-[#69585F] hover:text-[#43373D] transition-colors">
            {t("navPlanner")}
          </Link>
          <Link
            to="/recommendations"
            className="text-[#69585F] hover:text-[#43373D] transition-colors"
          >
            {t("navRecommendation")}
          </Link>
        </div>

        {/* Markets & Finance */}
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold text-[#43373D]">{t("navMarkets")}</p>
          <Link to="/market" className="text-[#69585F] hover:text-[#43373D] transition-colors">
            {t("navMarket")}
          </Link>
          <Link to="/expenses" className="text-[#69585F] hover:text-[#43373D] transition-colors">
            {t("navFinance")}
          </Link>
          <Link to="/schemes" className="text-[#69585F] hover:text-[#43373D] transition-colors">
            {t("navSchemes")}
          </Link>
          <Link to="/saved-schemes" className="text-[#69585F] hover:text-[#43373D] transition-colors">
            {t("navSavedSchemes")}
          </Link>
        </div>

        {/* Help & Account */}
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold text-[#43373D]">{t("navHelp")}</p>
          <Link to="/weather" className="text-[#69585F] hover:text-[#43373D] transition-colors">
            {t("navWeather")}
          </Link>
          <Link to="/help" className="text-[#69585F] hover:text-[#43373D] transition-colors">
            {t("navHelp")}
          </Link>
          <Link to="/notifications" className="text-[#69585F] hover:text-[#43373D] transition-colors">
            {t("navNotifications")}
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-1 text-[#69585F] hover:text-[#43373D] transition-colors"
          >
            <Shield className="size-3.5 text-[#EF959D]" />
            <span>{t("navAdmin")}</span>
          </Link>
        </div>
      </div>
      <div className="border-t border-[#DCDFC8] px-4 py-5 bg-[#F8F9F3]">
        <p className="mx-auto max-w-7xl text-xs text-[#69585F] text-center sm:text-left">
          {t("footerNote")}
        </p>
      </div>
    </footer>
  );
}
