import type { L } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/* Evaluation-I mock data. Evaluation-II replaces this with DB tables. */
/* ------------------------------------------------------------------ */

export type Scheme = {
  id: string;
  name: L;
  category: "income" | "insurance" | "credit" | "equipment" | "irrigation";
  summary: L;
  benefit: L;
  eligibility: L;
  documents: L;
  portal: string;
};

export const schemes: Scheme[] = [
  {
    id: "pm-kisan",
    name: { en: "PM-KISAN Samman Nidhi", hi: "पीएम-किसान सम्मान निधि" },
    category: "income",
    summary: {
      en: "Direct income support paid in three instalments every year.",
      hi: "हर साल तीन किस्तों में सीधी आय सहायता।",
    },
    benefit: { en: "₹6,000 per year to the bank account", hi: "₹6,000 प्रति वर्ष सीधे बैंक खाते में" },
    eligibility: {
      en: "All landholding farmer families, subject to exclusion criteria.",
      hi: "सभी भूमिधारक किसान परिवार, कुछ अपवादों को छोड़कर।",
    },
    documents: {
      en: "Aadhaar, land records, bank passbook",
      hi: "आधार, ज़मीन के कागज़, बैंक पासबुक",
    },
    portal: "pmkisan.gov.in",
  },
  {
    id: "pmfby",
    name: { en: "Pradhan Mantri Fasal Bima Yojana", hi: "प्रधानमंत्री फसल बीमा योजना" },
    category: "insurance",
    summary: {
      en: "Crop insurance against drought, flood, pest and post-harvest loss.",
      hi: "सूखा, बाढ़, कीट और कटाई बाद नुकसान के लिए फसल बीमा।",
    },
    benefit: {
      en: "Premium of 2% (kharif), 1.5% (rabi); rest paid by government",
      hi: "प्रीमियम 2% (खरीफ), 1.5% (रबी); बाकी सरकार देती है",
    },
    eligibility: {
      en: "Any farmer growing a notified crop in a notified area.",
      hi: "अधिसूचित क्षेत्र में अधिसूचित फसल उगाने वाला कोई भी किसान।",
    },
    documents: { en: "Aadhaar, sowing certificate, bank details", hi: "आधार, बुवाई प्रमाणपत्र, बैंक विवरण" },
    portal: "pmfby.gov.in",
  },
  {
    id: "kcc",
    name: { en: "Kisan Credit Card", hi: "किसान क्रेडिट कार्ड" },
    category: "credit",
    summary: {
      en: "Short-term crop loan at a subsidised interest rate.",
      hi: "कम ब्याज दर पर अल्पकालिक फसल ऋण।",
    },
    benefit: {
      en: "Loans up to ₹3 lakh at 4% effective interest on timely repayment",
      hi: "समय पर चुकाने पर ₹3 लाख तक का ऋण, प्रभावी ब्याज 4%",
    },
    eligibility: {
      en: "Owner cultivators, tenant farmers, sharecroppers and SHG members.",
      hi: "स्वामी कृषक, बटाईदार, किरायेदार किसान और स्वयं सहायता समूह सदस्य।",
    },
    documents: { en: "Aadhaar, land record, photograph", hi: "आधार, खसरा-खतौनी, फोटो" },
    portal: "Nearest bank branch",
  },
  {
    id: "smam",
    name: { en: "Farm Mechanisation Subsidy (SMAM)", hi: "कृषि यंत्रीकरण सब्सिडी (SMAM)" },
    category: "equipment",
    summary: {
      en: "Subsidy on tractors, rotavators, seed drills and harvesters.",
      hi: "ट्रैक्टर, रोटावेटर, सीड ड्रिल और हार्वेस्टर पर सब्सिडी।",
    },
    benefit: {
      en: "40–50% subsidy on machinery cost; higher for SC/ST and women farmers",
      hi: "मशीन लागत पर 40–50% सब्सिडी; एससी/एसटी और महिला किसानों को अधिक",
    },
    eligibility: {
      en: "Individual farmers and custom hiring centres.",
      hi: "व्यक्तिगत किसान और कस्टम हायरिंग सेंटर।",
    },
    documents: { en: "Aadhaar, land record, quotation from dealer", hi: "आधार, ज़मीन के कागज़, डीलर का कोटेशन" },
    portal: "agrimachinery.nic.in",
  },
  {
    id: "pmksy",
    name: { en: "Per Drop More Crop (PMKSY)", hi: "पर ड्रॉप मोर क्रॉप (PMKSY)" },
    category: "irrigation",
    summary: {
      en: "Support for drip and sprinkler micro-irrigation systems.",
      hi: "ड्रिप और स्प्रिंकलर सूक्ष्म सिंचाई प्रणाली के लिए सहायता।",
    },
    benefit: {
      en: "Up to 55% subsidy for small and marginal farmers",
      hi: "छोटे और सीमांत किसानों को 55% तक सब्सिडी",
    },
    eligibility: {
      en: "Farmers with an assured water source and valid land record.",
      hi: "जिनके पास निश्चित जल स्रोत और वैध भूमि रिकॉर्ड हो।",
    },
    documents: { en: "Aadhaar, land record, water source proof", hi: "आधार, ज़मीन के कागज़, जल स्रोत प्रमाण" },
    portal: "pmksy.gov.in",
  },
  {
    id: "shc",
    name: { en: "Soil Health Card", hi: "मृदा स्वास्थ्य कार्ड" },
    category: "income",
    summary: {
      en: "Free soil testing with a nutrient-wise fertiliser recommendation.",
      hi: "मुफ़्त मिट्टी जाँच और पोषक तत्व अनुसार खाद सिफ़ारिश।",
    },
    benefit: {
      en: "Cuts fertiliser cost by using only what the soil lacks",
      hi: "केवल ज़रूरी खाद डालकर लागत घटती है",
    },
    eligibility: { en: "Every farmer, once every two years.", hi: "हर किसान, हर दो साल में एक बार।" },
    documents: { en: "Aadhaar and field location", hi: "आधार और खेत का पता" },
    portal: "soilhealth.dac.gov.in",
  },
  {
    id: "enam",
    name: { en: "e-NAM Online Mandi", hi: "ई-नाम ऑनलाइन मंडी" },
    category: "income",
    summary: {
      en: "Sell produce to buyers across states through an online auction.",
      hi: "ऑनलाइन नीलामी से दूसरे राज्यों के खरीदारों को उपज बेचें।",
    },
    benefit: { en: "Better price discovery, payment into bank account", hi: "बेहतर भाव, भुगतान सीधे बैंक खाते में" },
    eligibility: { en: "Farmers registered with a participating APMC mandi.", hi: "किसी भी जुड़ी हुई एपीएमसी मंडी में पंजीकृत किसान।" },
    documents: { en: "Aadhaar, bank account, mandi registration", hi: "आधार, बैंक खाता, मंडी पंजीकरण" },
    portal: "enam.gov.in",
  },
  {
    id: "kusum",
    name: { en: "PM-KUSUM Solar Pump", hi: "पीएम-कुसुम सोलर पंप" },
    category: "irrigation",
    summary: {
      en: "Solar pumps and grid-connected solar plants on farm land.",
      hi: "खेत पर सोलर पंप और ग्रिड से जुड़े सोलर प्लांट।",
    },
    benefit: { en: "Up to 60% subsidy plus 30% loan on pump cost", hi: "पंप लागत पर 60% तक सब्सिडी और 30% ऋण" },
    eligibility: { en: "Individual farmers, FPOs and cooperatives.", hi: "व्यक्तिगत किसान, एफपीओ और सहकारी समितियाँ।" },
    documents: { en: "Aadhaar, land record, electricity connection details", hi: "आधार, ज़मीन के कागज़, बिजली कनेक्शन विवरण" },
    portal: "pmkusum.mnre.gov.in",
  },
];

export const schemeCategories: { id: Scheme["category"]; label: L }[] = [
  { id: "income", label: { en: "Income support", hi: "आय सहायता" } },
  { id: "insurance", label: { en: "Insurance", hi: "बीमा" } },
  { id: "credit", label: { en: "Credit", hi: "ऋण" } },
  { id: "equipment", label: { en: "Equipment", hi: "यंत्र" } },
  { id: "irrigation", label: { en: "Irrigation", hi: "सिंचाई" } },
];

/* --------------------------- Crop calendar --------------------------- */

export type Crop = {
  id: string;
  name: L;
  season: "kharif" | "rabi" | "zaid";
  sowing: L;
  sowingMonths: number[]; // 1 = January
  harvest: L;
  durationDays: string;
  water: L;
  soil: L;
  tip: L;
  emoji: string;
};

export const crops: Crop[] = [
  {
    id: "paddy",
    name: { en: "Paddy (Rice)", hi: "धान" },
    season: "kharif",
    sowing: { en: "June – July", hi: "जून – जुलाई" },
    sowingMonths: [6, 7],
    harvest: { en: "October – November", hi: "अक्टूबर – नवंबर" },
    durationDays: "120–150",
    water: { en: "High — standing water 5 cm", hi: "अधिक — 5 सेमी खड़ा पानी" },
    soil: { en: "Clay loam, good water holding", hi: "चिकनी दोमट, अच्छी जल धारण क्षमता" },
    tip: {
      en: "Transplant 21–25 day old seedlings; drain the field 10 days before harvest.",
      hi: "21–25 दिन की पौध रोपें; कटाई से 10 दिन पहले पानी निकाल दें।",
    },
    emoji: "🌾",
  },
  {
    id: "wheat",
    name: { en: "Wheat", hi: "गेहूँ" },
    season: "rabi",
    sowing: { en: "November – December", hi: "नवंबर – दिसंबर" },
    sowingMonths: [11, 12],
    harvest: { en: "March – April", hi: "मार्च – अप्रैल" },
    durationDays: "120–145",
    water: { en: "Medium — 4 to 6 irrigations", hi: "मध्यम — 4 से 6 सिंचाई" },
    soil: { en: "Well drained loam", hi: "अच्छी जल निकासी वाली दोमट" },
    tip: {
      en: "The crown root irrigation at 21 days decides your yield — do not miss it.",
      hi: "21 दिन पर पहली सिंचाई (क्राउन रूट) उपज तय करती है — इसे न चूकें।",
    },
    emoji: "🌾",
  },
  {
    id: "maize",
    name: { en: "Maize", hi: "मक्का" },
    season: "kharif",
    sowing: { en: "June – July", hi: "जून – जुलाई" },
    sowingMonths: [6, 7],
    harvest: { en: "September – October", hi: "सितंबर – अक्टूबर" },
    durationDays: "90–110",
    water: { en: "Medium — avoid water logging", hi: "मध्यम — जलभराव से बचें" },
    soil: { en: "Sandy loam to loam", hi: "बलुई दोमट से दोमट" },
    tip: {
      en: "Watch for fall armyworm in the first 30 days; scout leaf whorls weekly.",
      hi: "पहले 30 दिन फॉल आर्मीवर्म पर नज़र रखें; हर हफ़्ते पत्तों की गोफ जाँचें।",
    },
    emoji: "🌽",
  },
  {
    id: "mustard",
    name: { en: "Mustard", hi: "सरसों" },
    season: "rabi",
    sowing: { en: "October – November", hi: "अक्टूबर – नवंबर" },
    sowingMonths: [10, 11],
    harvest: { en: "February – March", hi: "फ़रवरी – मार्च" },
    durationDays: "110–130",
    water: { en: "Low — 2 irrigations", hi: "कम — 2 सिंचाई" },
    soil: { en: "Light loam, slightly alkaline is fine", hi: "हल्की दोमट, हल्की क्षारीय भी ठीक" },
    tip: {
      en: "Sow early to escape aphid attack at flowering.",
      hi: "फूल आने पर माहू से बचने के लिए जल्दी बुवाई करें।",
    },
    emoji: "🌼",
  },
  {
    id: "cotton",
    name: { en: "Cotton", hi: "कपास" },
    season: "kharif",
    sowing: { en: "April – May", hi: "अप्रैल – मई" },
    sowingMonths: [4, 5],
    harvest: { en: "October – January", hi: "अक्टूबर – जनवरी" },
    durationDays: "160–200",
    water: { en: "Medium — critical at boll formation", hi: "मध्यम — गूलर बनते समय ज़रूरी" },
    soil: { en: "Deep black cotton soil", hi: "गहरी काली मिट्टी" },
    tip: {
      en: "Install 5 pheromone traps per acre for pink bollworm monitoring.",
      hi: "गुलाबी सुंडी की निगरानी के लिए प्रति एकड़ 5 फेरोमोन ट्रैप लगाएँ।",
    },
    emoji: "🪴",
  },
  {
    id: "sugarcane",
    name: { en: "Sugarcane", hi: "गन्ना" },
    season: "zaid",
    sowing: { en: "February – March", hi: "फ़रवरी – मार्च" },
    sowingMonths: [2, 3],
    harvest: { en: "December – March", hi: "दिसंबर – मार्च" },
    durationDays: "300–365",
    water: { en: "Very high — 8 to 12 irrigations", hi: "बहुत अधिक — 8 से 12 सिंचाई" },
    soil: { en: "Deep loam with good drainage", hi: "गहरी दोमट, अच्छी निकासी" },
    tip: {
      en: "Trench planting with trash mulching saves nearly a third of water.",
      hi: "ट्रेंच विधि और पत्ती मल्चिंग से लगभग एक-तिहाई पानी बचता है।",
    },
    emoji: "🎋",
  },
  {
    id: "gram",
    name: { en: "Gram (Chana)", hi: "चना" },
    season: "rabi",
    sowing: { en: "October – November", hi: "अक्टूबर – नवंबर" },
    sowingMonths: [10, 11],
    harvest: { en: "February – March", hi: "फ़रवरी – मार्च" },
    durationDays: "95–120",
    water: { en: "Low — 1 to 2 irrigations", hi: "कम — 1 से 2 सिंचाई" },
    soil: { en: "Sandy loam, avoid waterlogging", hi: "बलुई दोमट, जलभराव से बचें" },
    tip: {
      en: "Nip the tips at 30 days to encourage branching and more pods.",
      hi: "30 दिन पर शीर्ष तोड़ें — शाखाएँ और फलियाँ बढ़ती हैं।",
    },
    emoji: "🫘",
  },
  {
    id: "groundnut",
    name: { en: "Groundnut", hi: "मूंगफली" },
    season: "kharif",
    sowing: { en: "June – July", hi: "जून – जुलाई" },
    sowingMonths: [6, 7],
    harvest: { en: "October – November", hi: "अक्टूबर – नवंबर" },
    durationDays: "100–130",
    water: { en: "Medium — critical at pegging", hi: "मध्यम — सुई बनते समय ज़रूरी" },
    soil: { en: "Loose sandy loam", hi: "भुरभुरी बलुई दोमट" },
    tip: {
      en: "Apply gypsum at flowering for better pod filling.",
      hi: "फूल आने पर जिप्सम डालें — फली अच्छी भरती है।",
    },
    emoji: "🥜",
  },
  {
    id: "tomato",
    name: { en: "Tomato", hi: "टमाटर" },
    season: "zaid",
    sowing: { en: "January – February & June – July", hi: "जनवरी – फ़रवरी और जून – जुलाई" },
    sowingMonths: [1, 2, 6, 7],
    harvest: { en: "70–90 days after transplanting", hi: "रोपाई के 70–90 दिन बाद" },
    durationDays: "90–120",
    water: { en: "Medium — drip works best", hi: "मध्यम — ड्रिप सबसे अच्छी" },
    soil: { en: "Well drained loam, pH 6–7", hi: "अच्छी निकासी वाली दोमट, pH 6–7" },
    tip: {
      en: "Stake the plants — it cuts fruit rot losses sharply.",
      hi: "पौधों को सहारा दें — फल सड़न का नुकसान बहुत घटता है।",
    },
    emoji: "🍅",
  },
  {
    id: "onion",
    name: { en: "Onion", hi: "प्याज़" },
    season: "rabi",
    sowing: { en: "November – December", hi: "नवंबर – दिसंबर" },
    sowingMonths: [11, 12],
    harvest: { en: "March – April", hi: "मार्च – अप्रैल" },
    durationDays: "120–150",
    water: { en: "Medium — stop 15 days before harvest", hi: "मध्यम — कटाई से 15 दिन पहले पानी बंद" },
    soil: { en: "Friable loam rich in organic matter", hi: "जैविक पदार्थ युक्त भुरभुरी दोमट" },
    tip: {
      en: "Cure bulbs in shade for 3–4 days before storage to reduce rot.",
      hi: "भंडारण से पहले 3–4 दिन छाया में सुखाएँ — सड़न घटती है।",
    },
    emoji: "🧅",
  },
];

export const seasons: { id: Crop["season"]; label: L; window: L }[] = [
  { id: "kharif", label: { en: "Kharif", hi: "खरीफ़" }, window: { en: "Monsoon sown", hi: "मानसून में बोई" } },
  { id: "rabi", label: { en: "Rabi", hi: "रबी" }, window: { en: "Winter sown", hi: "सर्दी में बोई" } },
  { id: "zaid", label: { en: "Zaid", hi: "ज़ायद" }, window: { en: "Summer sown", hi: "गर्मी में बोई" } },
];

/* --------------------------- Mandi prices --------------------------- */

export type MandiRate = {
  id: string;
  crop: L;
  mandi: L;
  state: L;
  price: number;
  changePct: number;
};

export const mandiRates: MandiRate[] = [
  { id: "m1", crop: { en: "Wheat", hi: "गेहूँ" }, mandi: { en: "Karnal", hi: "करनाल" }, state: { en: "Haryana", hi: "हरियाणा" }, price: 2485, changePct: 1.4 },
  { id: "m2", crop: { en: "Paddy", hi: "धान" }, mandi: { en: "Sangrur", hi: "संगरूर" }, state: { en: "Punjab", hi: "पंजाब" }, price: 2310, changePct: -0.8 },
  { id: "m3", crop: { en: "Mustard", hi: "सरसों" }, mandi: { en: "Bharatpur", hi: "भरतपुर" }, state: { en: "Rajasthan", hi: "राजस्थान" }, price: 5640, changePct: 2.1 },
  { id: "m4", crop: { en: "Cotton", hi: "कपास" }, mandi: { en: "Rajkot", hi: "राजकोट" }, state: { en: "Gujarat", hi: "गुजरात" }, price: 7420, changePct: 0.6 },
  { id: "m5", crop: { en: "Onion", hi: "प्याज़" }, mandi: { en: "Lasalgaon", hi: "लासलगाँव" }, state: { en: "Maharashtra", hi: "महाराष्ट्र" }, price: 1980, changePct: -3.2 },
  { id: "m6", crop: { en: "Tomato", hi: "टमाटर" }, mandi: { en: "Kolar", hi: "कोलार" }, state: { en: "Karnataka", hi: "कर्नाटक" }, price: 1450, changePct: 4.5 },
  { id: "m7", crop: { en: "Gram", hi: "चना" }, mandi: { en: "Indore", hi: "इंदौर" }, state: { en: "Madhya Pradesh", hi: "मध्य प्रदेश" }, price: 5210, changePct: 0.9 },
  { id: "m8", crop: { en: "Maize", hi: "मक्का" }, mandi: { en: "Davangere", hi: "दावणगेरे" }, state: { en: "Karnataka", hi: "कर्नाटक" }, price: 2130, changePct: -1.1 },
  { id: "m9", crop: { en: "Soybean", hi: "सोयाबीन" }, mandi: { en: "Ujjain", hi: "उज्जैन" }, state: { en: "Madhya Pradesh", hi: "मध्य प्रदेश" }, price: 4680, changePct: 1.8 },
  { id: "m10", crop: { en: "Groundnut", hi: "मूंगफली" }, mandi: { en: "Junagadh", hi: "जूनागढ़" }, state: { en: "Gujarat", hi: "गुजरात" }, price: 6350, changePct: -0.4 },
  { id: "m11", crop: { en: "Sugarcane", hi: "गन्ना" }, mandi: { en: "Muzaffarnagar", hi: "मुज़फ़्फ़रनगर" }, state: { en: "Uttar Pradesh", hi: "उत्तर प्रदेश" }, price: 355, changePct: 0.0 },
  { id: "m12", crop: { en: "Potato", hi: "आलू" }, mandi: { en: "Agra", hi: "आगरा" }, state: { en: "Uttar Pradesh", hi: "उत्तर प्रदेश" }, price: 1240, changePct: 2.7 },
];

/* ------------------------------ Weather ------------------------------ */

export type DayForecast = {
  day: L;
  condition: L;
  high: number;
  low: number;
  rainChance: number;
  icon: "sun" | "cloud" | "rain" | "storm";
};

export type DistrictWeather = {
  id: string;
  district: L;
  alert: L | null;
  days: DayForecast[];
};

const d = (
  day: L,
  condition: L,
  high: number,
  low: number,
  rainChance: number,
  icon: DayForecast["icon"],
): DayForecast => ({ day, condition, high, low, rainChance, icon });

const weekdays: L[] = [
  { en: "Today", hi: "आज" },
  { en: "Tomorrow", hi: "कल" },
  { en: "Wed", hi: "बुध" },
  { en: "Thu", hi: "गुरु" },
  { en: "Fri", hi: "शुक्र" },
  { en: "Sat", hi: "शनि" },
  { en: "Sun", hi: "रवि" },
];

const c = {
  sunny: { en: "Sunny", hi: "धूप" },
  partly: { en: "Partly cloudy", hi: "आंशिक बादल" },
  rain: { en: "Light rain", hi: "हल्की बारिश" },
  heavy: { en: "Heavy rain", hi: "तेज़ बारिश" },
  storm: { en: "Thunderstorm", hi: "आँधी-तूफ़ान" },
};

export const districtWeather: DistrictWeather[] = [
  {
    id: "karnal",
    district: { en: "Karnal, Haryana", hi: "करनाल, हरियाणा" },
    alert: {
      en: "Thunderstorm likely on Friday — delay spraying and irrigation.",
      hi: "शुक्रवार को आँधी-तूफ़ान संभव — छिड़काव और सिंचाई टालें।",
    },
    days: [
      d(weekdays[0]!, c.sunny, 34, 24, 5, "sun"),
      d(weekdays[1]!, c.partly, 33, 24, 20, "cloud"),
      d(weekdays[2]!, c.rain, 31, 23, 60, "rain"),
      d(weekdays[3]!, c.rain, 30, 23, 70, "rain"),
      d(weekdays[4]!, c.storm, 29, 22, 85, "storm"),
      d(weekdays[5]!, c.partly, 32, 23, 25, "cloud"),
      d(weekdays[6]!, c.sunny, 34, 24, 10, "sun"),
    ],
  },
  {
    id: "nashik",
    district: { en: "Nashik, Maharashtra", hi: "नासिक, महाराष्ट्र" },
    alert: null,
    days: [
      d(weekdays[0]!, c.partly, 31, 21, 15, "cloud"),
      d(weekdays[1]!, c.sunny, 32, 21, 5, "sun"),
      d(weekdays[2]!, c.sunny, 33, 22, 5, "sun"),
      d(weekdays[3]!, c.partly, 32, 22, 20, "cloud"),
      d(weekdays[4]!, c.rain, 29, 21, 55, "rain"),
      d(weekdays[5]!, c.rain, 28, 21, 65, "rain"),
      d(weekdays[6]!, c.partly, 30, 21, 30, "cloud"),
    ],
  },
  {
    id: "ludhiana",
    district: { en: "Ludhiana, Punjab", hi: "लुधियाना, पंजाब" },
    alert: {
      en: "Night temperature dropping below 8°C — protect vegetable nursery.",
      hi: "रात का तापमान 8°C से नीचे — सब्ज़ी की नर्सरी को ढकें।",
    },
    days: [
      d(weekdays[0]!, c.sunny, 24, 8, 0, "sun"),
      d(weekdays[1]!, c.sunny, 23, 7, 0, "sun"),
      d(weekdays[2]!, c.partly, 22, 7, 10, "cloud"),
      d(weekdays[3]!, c.partly, 22, 8, 15, "cloud"),
      d(weekdays[4]!, c.rain, 20, 9, 50, "rain"),
      d(weekdays[5]!, c.heavy, 19, 10, 75, "rain"),
      d(weekdays[6]!, c.sunny, 23, 8, 5, "sun"),
    ],
  },
];

/* ---------------------------- Advisories ---------------------------- */

export type Advisory = {
  id: string;
  title: L;
  body: L;
  kind: "pest" | "irrigation" | "market" | "soil";
};

export const advisories: Advisory[] = [
  {
    id: "a1",
    kind: "pest",
    title: { en: "Yellow rust watch in wheat", hi: "गेहूँ में पीला रतुआ चेतावनी" },
    body: {
      en: "Cool humid mornings favour yellow rust. Check lower leaves for yellow stripes and spray propiconazole if found.",
      hi: "ठंडी नम सुबह पीले रतुए के लिए अनुकूल है। नीचे की पत्तियों पर पीली धारियाँ देखें, मिलने पर प्रोपिकोनाज़ोल छिड़कें।",
    },
  },
  {
    id: "a2",
    kind: "irrigation",
    title: { en: "Skip irrigation before rain", hi: "बारिश से पहले सिंचाई न करें" },
    body: {
      en: "Rain is expected in the next 48 hours across north-west districts. Postpone irrigation and urea application.",
      hi: "उत्तर-पश्चिम ज़िलों में अगले 48 घंटे में बारिश संभव। सिंचाई और यूरिया डालना टाल दें।",
    },
  },
  {
    id: "a3",
    kind: "market",
    title: { en: "Mustard rates firming up", hi: "सरसों के भाव मज़बूत" },
    body: {
      en: "Bharatpur mandi is up 2.1% this week. Holding graded produce for a few days may fetch a better rate.",
      hi: "भरतपुर मंडी इस हफ़्ते 2.1% ऊपर है। छँटी हुई उपज कुछ दिन रोकने पर बेहतर भाव मिल सकता है।",
    },
  },
  {
    id: "a4",
    kind: "soil",
    title: { en: "Test soil before rabi sowing", hi: "रबी बुवाई से पहले मिट्टी जाँचें" },
    body: {
      en: "A free Soil Health Card test now can cut your fertiliser bill by up to 20% this season.",
      hi: "अभी मुफ़्त मृदा स्वास्थ्य कार्ड जाँच कराने से इस सीज़न खाद का खर्च 20% तक घट सकता है।",
    },
  },
];

/* ------------------------- Technology updates ------------------------- */

export type TechUpdate = {
  id: string;
  title: L;
  body: L;
  tag: L;
};

export const techUpdates: TechUpdate[] = [
  {
    id: "t1",
    tag: { en: "Drones", hi: "ड्रोन" },
    title: { en: "Kisan Drone spraying subsidy", hi: "किसान ड्रोन छिड़काव सब्सिडी" },
    body: {
      en: "Custom hiring centres can buy spraying drones with up to 75% assistance, cutting spray time to 7 minutes an acre.",
      hi: "कस्टम हायरिंग सेंटर 75% तक सहायता से छिड़काव ड्रोन ले सकते हैं — एक एकड़ का छिड़काव 7 मिनट में।",
    },
  },
  {
    id: "t2",
    tag: { en: "Seed", hi: "बीज" },
    title: { en: "Climate-resilient seed varieties", hi: "जलवायु सहनशील बीज किस्में" },
    body: {
      en: "ICAR released short-duration, drought-tolerant paddy and gram varieties suited to delayed monsoon sowing.",
      hi: "आईसीएआर ने देर से बुवाई के लिए कम अवधि वाली, सूखा सहनशील धान और चना किस्में जारी की हैं।",
    },
  },
  {
    id: "t3",
    tag: { en: "Soil", hi: "मिट्टी" },
    title: { en: "Nano urea in place of bags", hi: "बोरी की जगह नैनो यूरिया" },
    body: {
      en: "One 500 ml bottle of nano urea replaces a 45 kg bag, reduces leaching and is easier to carry to the field.",
      hi: "500 मि.ली. नैनो यूरिया की एक बोतल 45 किलो की बोरी के बराबर है — रिसाव कम, ढोना आसान।",
    },
  },
];

/* ----------------------------- Helplines ----------------------------- */

export const helplines: { id: string; label: L; number: string; note: L }[] = [
  {
    id: "h1",
    label: { en: "Kisan Call Centre", hi: "किसान कॉल सेंटर" },
    number: "1800-180-1551",
    note: { en: "Free crop advice, 6 AM – 10 PM", hi: "मुफ़्त फसल सलाह, सुबह 6 – रात 10" },
  },
  {
    id: "h2",
    label: { en: "PM-KISAN Helpdesk", hi: "पीएम-किसान हेल्पडेस्क" },
    number: "155261",
    note: { en: "Instalment and eKYC queries", hi: "किस्त और ई-केवाईसी सवाल" },
  },
  {
    id: "h3",
    label: { en: "Crop Insurance", hi: "फसल बीमा" },
    number: "14447",
    note: { en: "Report crop loss within 72 hours", hi: "72 घंटे के अंदर नुकसान की सूचना दें" },
  },
  {
    id: "h4",
    label: { en: "Soil Testing Lab", hi: "मृदा जाँच प्रयोगशाला" },
    number: "1800-180-1551",
    note: { en: "Book a free soil health test", hi: "मुफ़्त मिट्टी जाँच बुक करें" },
  },
];

export const faqs: { id: string; q: L; a: L }[] = [
  {
    id: "f1",
    q: { en: "My PM-KISAN instalment did not arrive. What now?", hi: "मेरी पीएम-किसान किस्त नहीं आई। अब क्या करें?" },
    a: {
      en: "Most failures are eKYC or a bank account not linked to Aadhaar. Check your beneficiary status on the portal, complete eKYC, and visit the bank to seed Aadhaar.",
      hi: "ज़्यादातर मामलों में ई-केवाईसी या आधार-बैंक लिंक न होना कारण होता है। पोर्टल पर स्थिति देखें, ई-केवाईसी पूरी करें और बैंक में आधार जुड़वाएँ।",
    },
  },
  {
    id: "f2",
    q: { en: "How soon must I report crop damage?", hi: "फसल नुकसान की सूचना कब तक देनी है?" },
    a: {
      en: "Within 72 hours of the event, through the crop insurance helpline, the app, or your bank branch. Late intimation is the biggest reason claims are rejected.",
      hi: "घटना के 72 घंटे के अंदर — बीमा हेल्पलाइन, ऐप या बैंक शाखा के ज़रिए। देर से सूचना देना दावा खारिज होने का सबसे बड़ा कारण है।",
    },
  },
  {
    id: "f3",
    q: { en: "Can a tenant farmer get a Kisan Credit Card?", hi: "क्या बटाईदार किसान को किसान क्रेडिट कार्ड मिल सकता है?" },
    a: {
      en: "Yes. Tenant farmers, oral lessees and sharecroppers are eligible, usually through a Joint Liability Group at the bank.",
      hi: "हाँ। बटाईदार, मौखिक पट्टेदार और साझी किसान पात्र हैं — आमतौर पर बैंक में संयुक्त देयता समूह के ज़रिए।",
    },
  },
  {
    id: "f4",
    q: { en: "Is the mandi price on this site the final rate?", hi: "क्या इस साइट का मंडी भाव अंतिम रेट है?" },
    a: {
      en: "No. Rates shown here are indicative modal prices. Your final rate depends on grade, moisture and the day's arrivals.",
      hi: "नहीं। यहाँ दिखाए भाव संकेतक मॉडल भाव हैं। आपका अंतिम भाव ग्रेड, नमी और उस दिन की आवक पर निर्भर करता है।",
    },
  },
];
