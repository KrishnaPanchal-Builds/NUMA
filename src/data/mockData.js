// NUMA Clean Slate Store - Authentic User Input Mode

export const INITIAL_USER_PROFILE = {
  name: "New User",
  ageGroup: "25-30 years",
  pcosSubtype: "Hormonal & Metabolic PCOS",
  diagnosisStatus: "Unspecified",
  goals: ["Regularize menstrual cycle", "Reduce fatigue"],
  dietaryPreference: "Low Glycemic",
  currentCycleDay: 1,
  estimatedCycleLength: 30,
  currentPhase: "Menstrual Phase",
  nextPeriodEstimate: "Enter period start date to calculate",
  fertileWindowEstimate: "Calculated from your logged period",
  isOnboarded: false, // Compulsory onboarding flag
};

// Clean Empty Stores for Authentic Data Entry
export const INITIAL_CYCLES = [];

export const INITIAL_24HR_TIMELINE = [];

// Complete 17 PCOS Symptoms Suite from Requirement Document Section 2
export const INITIAL_SYMPTOMS = [
  { id: "s1", name: "Hormonal Acne", category: "Skin & Hair", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s2", name: "Hair Loss / Thinning", category: "Skin & Hair", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s3", name: "Excess Facial/Body Hair (Hirsutism)", category: "Skin & Hair", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s4", name: "Pelvic / Abdominal Discomfort", category: "Pain", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s5", name: "Cramps", category: "Pain", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s6", name: "Bloating", category: "Digestive", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s7", name: "Fatigue", category: "Energy & Mood", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s8", name: "Headaches", category: "Pain", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s9", name: "Breast Tenderness", category: "Hormonal", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s10", name: "Food / Sugar Cravings", category: "Metabolic", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s11", name: "Mood Changes", category: "Mental Health", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s12", name: "Irritability", category: "Mental Health", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s13", name: "Stress", category: "Mental Health", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s14", name: "Sleep-Related Problems", category: "Sleep", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s15", name: "Energy Levels", category: "Energy & Mood", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
  { id: "s16", name: "Digestive Symptoms", category: "Digestive", severity: 1, frequency: "Unlogged", duration: "--", timeOfOccurrence: "--", lastLogged: "Not logged yet", trend: "stable", notes: "" },
];

export const INITIAL_DAILY_CHECKIN = {
  date: new Date().toISOString().split('T')[0],
  mood: "Unlogged",
  energyLevel: 5,
  sleepQuality: "Unlogged",
  painLevel: 0,
  bleedingStatus: "None",
  hydrationLiters: 0.0,
  activityMinutes: 0,
  medsTaken: false,
  notes: "",
};

export const INITIAL_LAB_RESULTS = [];

export const INITIAL_DOCUMENTS = [];

export const OBSERVED_PATTERNS = [
  {
    id: "p_init",
    title: "Pattern Intelligence Ready",
    observation: "NUMA will automatically identify observed patterns once you log your cycles, sleep, and symptoms.",
    type: "Empirical Analytics",
    confidence: "Waiting for entries",
    recommendation: "Use the 30s Check-in to start logging daily parameters."
  }
];

export const WHAT_CHANGED = {
  timeframe: "Real-time Longitudinal Comparison",
  metrics: [
    { name: "Cycle Length", current: "-- Days", previous: "-- Days", delta: "0 Days", status: "Awaiting Logged Cycles" },
    { name: "Average Nightly Sleep", current: "-- Hours", previous: "-- Hours", delta: "0 Hours", status: "Awaiting Sleep Entries" },
    { name: "Severe Cramp Days", current: "0 Days", previous: "0 Days", delta: "0 Days", status: "Awaiting Logged Symptoms" },
  ]
};

export const MEDICATIONS = [];

export const APPOINTMENTS = [];

export const EDUCATION_ARTICLES = [
  {
    id: "e1",
    title: "Understanding PCOS vs PCOD: Key Differences & Management",
    category: "PCOS Basics",
    readTime: "4 min read",
    author: "Reviewed by Clinical Endocrinology Panel",
    snippet: "PCOS (Polycystic Ovary Syndrome) is a metabolic and endocrine disorder, whereas PCOD is largely a hormonal imbalance manageable with lifestyle tweaks."
  },
  {
    id: "e2",
    title: "Insulin Resistance in PCOS: How It Affects Ovulation & Energy",
    category: "Metabolism & Hormones",
    readTime: "6 min read",
    author: "Clinical Nutrition Team",
    snippet: "High insulin levels trigger the ovaries to produce excess testosterone. Discover how pairing complex carbs with protein stabilizes blood sugar."
  }
];

export const RED_FLAG_CRITERIA = [
  {
    level: "Urgent Medical Attention Needed",
    color: "danger",
    symptoms: ["Sudden severe unilateral pelvic pain (Risk of ovarian torsion)", "Extremely heavy bleeding (Soaking >2 pads per hour for 2 consecutive hours)", "Fever >101°F accompanying pelvic pain"],
    action: "Contact your gynecologist immediately or visit emergency care."
  },
  {
    level: "Discuss at Next Healthcare Appointment",
    color: "amber",
    symptoms: ["Absence of period for >90 consecutive days (Amenorrhea)", "Persistent severe acne unresponsive to topical therapy"],
    action: "Schedule a consultation with your endocrinologist."
  },
  {
    level: "Monitor & Track Continuously",
    color: "mint",
    symptoms: ["Mild mid-cycle spotting during ovulation", "Transient mild bloating"],
    action: "Record in your NUMA timeline to track trends."
  }
];
