// NUMA Persistent Multi-User Database Storage Adapter

const ACCOUNTS_REGISTRY_KEY = 'numa_db_accounts_registry';
const ACTIVE_USER_ID_KEY = 'numa_active_user_id';

// Helper: Get Accounts Registry
export function getAccountsRegistry() {
  try {
    const data = localStorage.getItem(ACCOUNTS_REGISTRY_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading accounts registry:', e);
    return [];
  }
}

// Helper: Save Accounts Registry
export function saveAccountsRegistry(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_REGISTRY_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving accounts registry:', e);
  }
}

// Authenticate Existing User by Email/Username & Password
export function authenticateUser(loginInput, passwordInput) {
  const accounts = getAccountsRegistry();
  const inputNorm = loginInput.trim().toLowerCase();
  const passNorm = passwordInput.trim();

  const found = accounts.find(
    (acc) =>
      (acc.email?.toLowerCase() === inputNorm || acc.name?.toLowerCase() === inputNorm) &&
      acc.password === passNorm
  );

  if (found) {
    return { success: true, user: found };
  } else {
    return {
      success: false,
      message: 'Invalid username/email or password. Please verify your credentials or register a new user.'
    };
  }
}

// Register New User Account with Password
export function registerNewUserAccount(name, email, password) {
  const accounts = getAccountsRegistry();
  const emailNorm = email.trim().toLowerCase();

  const existing = accounts.find((acc) => acc.email?.toLowerCase() === emailNorm);
  if (existing) {
    return existing;
  }

  const newAccount = {
    id: 'usr_' + Date.now(),
    name: name.trim(),
    email: emailNorm,
    password: password.trim(),
    registeredAt: new Date().toISOString()
  };

  accounts.push(newAccount);
  saveAccountsRegistry(accounts);

  return newAccount;
}

// Active Session Management
export function getActiveUserId() {
  return localStorage.getItem(ACTIVE_USER_ID_KEY) || null;
}

export function setActiveUserId(userId) {
  if (userId) {
    localStorage.setItem(ACTIVE_USER_ID_KEY, userId);
  } else {
    localStorage.removeItem(ACTIVE_USER_ID_KEY);
  }
}

export function logoutUserSession() {
  localStorage.removeItem(ACTIVE_USER_ID_KEY);
}

// User-Scoped Storage Keys Generator
const getKey = (userId, domain) => `numa_user_${userId || 'guest'}_${domain}`;

// Profile Storage
export function loadProfile(userId, fallback) {
  if (!userId) return fallback;
  try {
    const data = localStorage.getItem(getKey(userId, 'profile'));
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveProfile(userId, profileData) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId, 'profile'), JSON.stringify(profileData));
  } catch (e) {
    console.error('Failed saving profile:', e);
  }
}

// Cycles Storage (Guarantees Array)
export function loadCycles(userId, fallback = []) {
  if (!userId) return Array.isArray(fallback) ? fallback : [];
  try {
    const data = localStorage.getItem(getKey(userId, 'cycles'));
    if (!data) return Array.isArray(fallback) ? fallback : [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return Array.isArray(fallback) ? fallback : [];
  }
}

export function saveCycles(userId, cyclesData) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId, 'cycles'), JSON.stringify(cyclesData));
  } catch (e) {
    console.error('Failed saving cycles:', e);
  }
}

// Timeline Storage (Guarantees Array)
export function loadTimeline(userId, fallback = []) {
  if (!userId) return Array.isArray(fallback) ? fallback : [];
  try {
    const data = localStorage.getItem(getKey(userId, 'timeline'));
    if (!data) return Array.isArray(fallback) ? fallback : [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return Array.isArray(fallback) ? fallback : [];
  }
}

export function saveTimeline(userId, timelineData) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId, 'timeline'), JSON.stringify(timelineData));
  } catch (e) {
    console.error('Failed saving timeline:', e);
  }
}

// Symptoms Storage (Guarantees Array)
export function loadSymptoms(userId, fallback = []) {
  if (!userId) return Array.isArray(fallback) ? fallback : [];
  try {
    const data = localStorage.getItem(getKey(userId, 'symptoms'));
    if (!data) return Array.isArray(fallback) ? fallback : [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return Array.isArray(fallback) ? fallback : [];
  }
}

export function saveSymptoms(userId, symptomsData) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId, 'symptoms'), JSON.stringify(symptomsData));
  } catch (e) {
    console.error('Failed saving symptoms:', e);
  }
}

// Daily Check-In Storage
export function loadDailyCheckIn(userId, fallback = {}) {
  if (!userId) return fallback;
  try {
    const data = localStorage.getItem(getKey(userId, 'dailyCheckIn'));
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveDailyCheckIn(userId, checkInData) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId, 'dailyCheckIn'), JSON.stringify(checkInData));
  } catch (e) {
    console.error('Failed saving daily check-in:', e);
  }
}

// Labs Storage (Guarantees Array)
export function loadLabs(userId, fallback = []) {
  if (!userId) return Array.isArray(fallback) ? fallback : [];
  try {
    const data = localStorage.getItem(getKey(userId, 'labs'));
    if (!data) return Array.isArray(fallback) ? fallback : [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return Array.isArray(fallback) ? fallback : [];
  }
}

export function saveLabs(userId, labsData) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId, 'labs'), JSON.stringify(labsData));
  } catch (e) {
    console.error('Failed saving labs:', e);
  }
}

// Documents Storage (Guarantees Array)
export function loadDocuments(userId, fallback = []) {
  if (!userId) return Array.isArray(fallback) ? fallback : [];
  try {
    const data = localStorage.getItem(getKey(userId, 'documents'));
    if (!data) return Array.isArray(fallback) ? fallback : [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return Array.isArray(fallback) ? fallback : [];
  }
}

export function saveDocuments(userId, docsData) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId, 'documents'), JSON.stringify(docsData));
  } catch (e) {
    console.error('Failed saving documents:', e);
  }
}

// Medications Storage (Guarantees Array)
export function loadMeds(userId, fallback = []) {
  if (!userId) return Array.isArray(fallback) ? fallback : [];
  try {
    const data = localStorage.getItem(getKey(userId, 'meds'));
    if (!data) return Array.isArray(fallback) ? fallback : [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return Array.isArray(fallback) ? fallback : [];
  }
}

export function saveMeds(userId, medsData) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId, 'meds'), JSON.stringify(medsData));
  } catch (e) {
    console.error('Failed saving meds:', e);
  }
}

// Meals Storage (Guarantees Array)
export function loadMeals(userId, fallback = []) {
  if (!userId) return Array.isArray(fallback) ? fallback : [];
  try {
    const data = localStorage.getItem(getKey(userId, 'meals'));
    if (!data) return Array.isArray(fallback) ? fallback : [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return Array.isArray(fallback) ? fallback : [];
  }
}

export function saveMeals(userId, mealsData) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId, 'meals'), JSON.stringify(mealsData));
  } catch (e) {
    console.error('Failed saving meals:', e);
  }
}

// Hydration Storage
export function loadHydration(userId, fallback = { date: new Date().toISOString().split('T')[0], amountMl: 0, targetMl: 2500 }) {
  if (!userId) return fallback;
  try {
    const data = localStorage.getItem(getKey(userId, 'hydration'));
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveHydration(userId, hydrationData) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId, 'hydration'), JSON.stringify(hydrationData));
  } catch (e) {
    console.error('Failed saving hydration:', e);
  }
}

// User Initials Helper
export function getUserInitials(name) {
  if (!name) return 'KP';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
