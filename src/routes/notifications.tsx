import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  CloudRain,
  ExternalLink,
  FileText,
  Filter,
  HelpCircle,
  Sprout,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFarmerSession } from "@/lib/farmer-session";
import { frontendStore } from "@/services/frontend-store";
import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/PageHeader";
import type { AppNotification, NotificationKind } from "@/types/domain";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notification & Alert Center — KisanMitra CE2" },
      {
        name: "description",
        content: "Agricultural weather advisories, crop calendar milestones, and scheme update notifications.",
      },
    ],
  }),
  component: NotificationsPage,
});

export function NotificationsPage() {
  const { t, tr } = useLanguage();
  const { farmer } = useFarmerSession();
  const phone = farmer?.phone;

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "read">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const reloadNotifs = () => {
    if (!phone) {
      setNotifications([]);
      return;
    }
    setNotifications(frontendStore.getNotifications(phone));
  };

  useEffect(() => {
    reloadNotifs();
  }, [phone]);

  const handleMarkAsRead = (id: string) => {
    frontendStore.markNotificationRead(id);
    reloadNotifs();
  };

  const handleMarkAllRead = () => {
    if (!phone) return;
    frontendStore.markAllNotificationsRead(phone);
    reloadNotifs();
  };

  const filtered = notifications.filter((n) => {
    const matchStatus =
      filterTab === "all" ? true : filterTab === "unread" ? !n.read : n.read;
    const matchCategory =
      categoryFilter === "all" || n.kind === categoryFilter;
    return matchStatus && matchCategory;
  });

  const unreadTotal = notifications.filter((n) => !n.read).length;

  const getKindIcon = (kind: NotificationKind) => {
    switch (kind) {
      case "weather":
        return <CloudRain className="size-5 text-[#69585F]" />;
      case "crop":
        return <Sprout className="size-5 text-[#69585F]" />;
      case "scheme":
        return <FileText className="size-5 text-[#69585F]" />;
      case "support":
        return <HelpCircle className="size-5 text-[#69585F]" />;
      default:
        return <Bell className="size-5 text-[#69585F]" />;
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={t("appName")}
        title={tr({ en: "Notifications & Alert Center", hi: "सूचना एवं चेतावनी केंद्र" })}
        body={tr({
          en: "Real-time agro-meteorological advisories, crop task reminders, scheme application notifications, and support ticket answers.",
          hi: "कृषि मौसम सलाह, फसल के जरूरी कार्य, सरकारी योजना सूचनाएं और सहायता टिकट के जवाब।",
        })}
      >
        <div className="flex flex-wrap items-center gap-3">
          {unreadTotal > 0 && (
            <Button
              onClick={handleMarkAllRead}
              className="bg-[#69585F] text-white hover:bg-[#55464D] shadow-sm font-semibold"
            >
              <CheckCheck className="size-4 mr-1.5" />
              <span>Mark All as Read ({unreadTotal})</span>
            </Button>
          )}
        </div>
      </PageHeader>

      <Section>
        {/* Filter Tabs and Category Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCDFC8] pb-4">
          <div className="flex gap-2">
            {[
              { id: "all", label: `All (${notifications.length})` },
              { id: "unread", label: `Unread (${unreadTotal})` },
              { id: "read", label: `Read (${notifications.length - unreadTotal})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id as "all" | "unread" | "read")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  filterTab === tab.id
                    ? "bg-[#69585F] text-white"
                    : "bg-white text-[#69585F] border border-[#DCDFC8] hover:bg-[#D9DBBC]/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#69585F] font-semibold flex items-center gap-1">
              <Filter className="size-3.5" />
              Category:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 rounded-lg border border-[#DCDFC8] bg-white px-2.5 text-xs text-[#43373D]"
            >
              <option value="all">All Categories</option>
              <option value="weather">Weather (मौसम)</option>
              <option value="crop">Crop Advisory (फसल)</option>
              <option value="scheme">Schemes (योजनाएं)</option>
              <option value="support">Support Responses (सहायता)</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="mt-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DCDFC8] bg-white p-12 text-center">
              <Bell className="mx-auto size-10 text-[#69585F]/50" />
              <h3 className="mt-3 font-display text-lg font-bold text-[#43373D]">
                {!farmer ? "Guest Mode — No Farmer Alerts" : "No notifications in this view"}
              </h3>
              <p className="mt-1 text-xs text-[#69585F] max-w-sm mx-auto">
                {!farmer
                  ? "Sign in to receive personalized weather alerts, harvest reminders, and government scheme updates for your farm."
                  : "You are all caught up! When new alerts or scheme announcements occur, they will appear here."}
              </p>
              {!farmer && (
                <Button asChild size="sm" className="mt-4 bg-[#69585F] text-white">
                  <Link to="/login">Sign In with Phone</Link>
                </Button>
              )}
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 rounded-xl border p-4 sm:p-5 transition-all ${
                  item.read
                    ? "border-[#DCDFC8] bg-white text-[#69585F]"
                    : "border-[#B8D8BA] bg-[#B8D8BA]/15 text-[#43373D] shadow-xs"
                }`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#DCDFC8] shadow-xs">
                  {getKindIcon(item.kind)}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-base font-bold text-[#43373D]">
                        {tr(item.title)}
                      </h4>
                      {!item.read && (
                        <span className="inline-block size-2 rounded-full bg-[#EF959D]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#69585F] flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-[#43373D] leading-relaxed">
                    {tr(item.body)}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#DCDFC8]/40 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#69585F]">
                      Category: {item.kind}
                    </span>

                    <div className="flex items-center gap-3">
                      {item.link && (
                        <Link
                          to={item.link}
                          className="font-semibold text-[#69585F] hover:underline flex items-center gap-1"
                        >
                          <span>Open related module</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      )}

                      {!item.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(item.id)}
                          className="text-xs font-semibold text-[#69585F] hover:text-[#43373D] cursor-pointer"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Section>
    </>
  );
}
