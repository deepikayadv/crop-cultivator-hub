import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "en" | "hi";

/** A bilingual string used across all mock data. */
export type L = { en: string; hi: string };

const STORAGE_KEY = "kisanmitra.lang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** Translate a dictionary key. */
  t: (key: keyof typeof dictionary) => string;
  /** Resolve a bilingual data field. */
  tr: (value: L) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const dictionary = {
  appName: { en: "KisanMitra", hi: "किसानमित्र" },
  tagline: {
    en: "Every answer a farmer needs, in one place.",
    hi: "किसान के हर सवाल का जवाब, एक ही जगह।",
  },
  navHome: { en: "Home", hi: "होम" },
  navSchemes: { en: "Schemes", hi: "योजनाएँ" },
  navCrops: { en: "Crop Calendar", hi: "फसल कैलेंडर" },
  navMarket: { en: "Mandi Prices", hi: "मंडी भाव" },
  navWeather: { en: "Weather", hi: "मौसम" },
  navHelp: { en: "Help", hi: "सहायता" },
  navLogin: { en: "Sign in", hi: "साइन इन" },
  navProfile: { en: "My Profile", hi: "मेरी प्रोफ़ाइल" },
  signOut: { en: "Sign out", hi: "साइन आउट" },

  heroTitle: {
    en: "Farming decisions, made simple.",
    hi: "खेती के फ़ैसले, अब आसान।",
  },
  heroBody: {
    en: "Government schemes, sowing windows, mandi rates, weather alerts and new farm technology — all in your language, on one screen.",
    hi: "सरकारी योजनाएँ, बुवाई का समय, मंडी भाव, मौसम चेतावनी और नई कृषि तकनीक — सब आपकी भाषा में, एक ही स्क्रीन पर।",
  },
  heroCta: { en: "Explore schemes", hi: "योजनाएँ देखें" },
  heroCta2: { en: "Check mandi rates", hi: "मंडी भाव देखें" },

  sectionServices: { en: "What you get", hi: "आपको क्या मिलेगा" },
  sectionAdvisory: { en: "Today's advisory", hi: "आज की सलाह" },
  sectionTech: { en: "New farm technology", hi: "नई कृषि तकनीक" },
  viewAll: { en: "View all", hi: "सभी देखें" },

  search: { en: "Search", hi: "खोजें" },
  filterAll: { en: "All", hi: "सभी" },
  noResults: { en: "Nothing matched your search.", hi: "आपकी खोज से कुछ नहीं मिला।" },

  eligibility: { en: "Who can apply", hi: "कौन आवेदन कर सकता है" },
  benefit: { en: "Benefit", hi: "लाभ" },
  documents: { en: "Documents needed", hi: "ज़रूरी दस्तावेज़" },
  applyAt: { en: "Apply at", hi: "आवेदन कहाँ करें" },

  season: { en: "Season", hi: "मौसम" },
  sowing: { en: "Sowing window", hi: "बुवाई का समय" },
  harvest: { en: "Harvest window", hi: "कटाई का समय" },
  duration: { en: "Duration", hi: "अवधि" },
  water: { en: "Water need", hi: "पानी की ज़रूरत" },
  soil: { en: "Soil", hi: "मिट्टी" },
  tip: { en: "Field tip", hi: "खेत की सलाह" },
  bestNow: { en: "Good to sow now", hi: "अभी बुवाई के लिए अच्छा" },

  crop: { en: "Crop", hi: "फसल" },
  mandi: { en: "Mandi", hi: "मंडी" },
  price: { en: "Price (₹/quintal)", hi: "भाव (₹/क्विंटल)" },
  change: { en: "Change", hi: "बदलाव" },
  updated: { en: "Updated today", hi: "आज अपडेट किया गया" },

  forecast: { en: "7-day forecast", hi: "7 दिन का पूर्वानुमान" },
  alerts: { en: "Weather alerts", hi: "मौसम चेतावनी" },
  district: { en: "District", hi: "ज़िला" },

  phone: { en: "Mobile number", hi: "मोबाइल नंबर" },
  name: { en: "Full name", hi: "पूरा नाम" },
  village: { en: "Village / District", hi: "गाँव / ज़िला" },
  landSize: { en: "Land size (acres)", hi: "ज़मीन (एकड़)" },
  mainCrop: { en: "Main crop", hi: "मुख्य फसल" },
  signInTitle: { en: "Sign in to KisanMitra", hi: "किसानमित्र में साइन इन करें" },
  signInBody: {
    en: "Enter your mobile number to get a personalised feed of schemes and prices.",
    hi: "अपनी योजनाओं और भावों की व्यक्तिगत सूची पाने के लिए मोबाइल नंबर डालें।",
  },
  continueBtn: { en: "Continue", hi: "आगे बढ़ें" },
  saveBtn: { en: "Save profile", hi: "प्रोफ़ाइल सेव करें" },
  demoNote: {
    en: "Demo sign-in — no data leaves this device in this evaluation stage.",
    hi: "डेमो साइन-इन — इस चरण में कोई डेटा इस डिवाइस से बाहर नहीं जाता।",
  },

  helplines: { en: "Helplines", hi: "हेल्पलाइन" },
  faq: { en: "Common questions", hi: "आम सवाल" },
  helpBody: {
    en: "Toll-free numbers and answers to the questions farmers ask us most.",
    hi: "टोल-फ़्री नंबर और किसानों के सबसे आम सवालों के जवाब।",
  },
  footerNote: {
    en: "A student project. Scheme details are illustrative — always confirm with the official portal.",
    hi: "एक छात्र परियोजना। योजना विवरण उदाहरण मात्र हैं — आधिकारिक पोर्टल से पुष्टि करें।",
  },
} satisfies Record<string, L>;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "hi" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggle: () => setLang(lang === "en" ? "hi" : "en"),
      t: (key) => dictionary[key][lang],
      tr: (value) => value[lang],
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
