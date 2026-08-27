// NUMA Persistent Multi-User Database Storage Adapter

const ACCOUNTS_REGISTRY_KEY = 'numa_db_accounts_registry';
const ACTIVE_USER_ID_KEY = 'numa_active_user_id';

// Default Seed Accounts for Out-of-the-Box Access
const DEFAULT_DEMO_ACCOUNTS = [
  {
    id: 'usr_demo_krishna',
    name: 'Krishna Panchal',
    email: 'krishna@numa.health',
    password: 'password123',
    registeredAt: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'usr_demo_user',
    name: 'Demo User',
    email: 'demo@numa.health',
    password: 'password',
    registeredAt: '2026-08-01T00:00:00.000Z'
  }
];

// Helper: User Name Initials Generator
export function getUserInitials(name) {
  if (!name || typeof name !== 'string') return 'KP';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Helper: Get Accounts Registry (Auto-seeds demo accounts if empty)
export function getAccountsRegistry() {
  try {
    const data = localStorage.getItem(ACCOUNTS_REGISTRY_KEY);
    if (!data) {
      saveAccountsRegistry(DEFAULT_DEMO_ACCOUNTS);
      return DEFAULT_DEMO_ACCOUNTS;
    }
    const parsed = JSON.parse(data);
    const accountsArray = Array.isArray(parsed) ? parsed : [];
    if (accountsArray.length === 0) {
      saveAccountsRegistry(DEFAULT_DEMO_ACCOUNTS);
      return DEFAULT_DEMO_ACCOUNTS;
    }
    return accountsArray;
  } catch (e) {
    console.error('Error reading accounts registry:', e);
    return DEFAULT_DEMO_ACCOUNTS;
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
  const inputNorm = (loginInput || '').trim().toLowerCase();
  const passNorm = (passwordInput || '').trim();

  if (!inputNorm || !passNorm) {
    return {
      success: false,
      message: 'Please enter both your email/username and password.'
    };
  }

  // Flexible match by Email, Username prefix, or Full Name
  const found = accounts.find((acc) => {
    const accEmail = (acc.email || '').trim().toLowerCase();
    const accName = (acc.name || '').trim().toLowerCase();
    const accEmailPrefix = accEmail.split('@')[0];
    const accPassword = (acc.password || '').trim();

    const matchesIdentity = (
      accEmail === inputNorm ||
      accName === inputNorm ||
      accEmailPrefix === inputNorm
    );

    const matchesPassword = (accPassword === passNorm);

    return matchesIdentity && matchesPassword;
  });

  if (found) {
    return { success: true, user: found };
  } else {
    return {
      success: false,
      message: 'Incorrect email/username or password. Please verify your credentials or use the 1-Tap Demo Sign In button below.'
    };
  }
}

// Register New User Account with Password
export function registerNewUserAccount(name, email, password) {
  const accounts = getAccountsRegistry();
  const emailNorm = (email || '').trim().toLowerCase();

  const existing = accounts.find((acc) => (acc.email || '').trim().toLowerCase() === emailNorm);
  if (existing) {
    // Update existing credentials if re-registering
    existing.name = name.trim();
    existing.password = password.trim();
    saveAccountsRegistry(accounts);
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
    localStorage.setItem(getKey(userId, 'cycles'), JSON.stringify(Array.isArray(cyclesData) ? cyclesData : []));
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
    localStorage.setItem(getKey(userId, 'timeline'), JSON.stringify(Array.isArray(timelineData) ? timelineData : []));
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
    localStorage.setItem(getKey(userId, 'symptoms'), JSON.stringify(Array.isArray(symptomsData) ? symptomsData : []));
  } catch (e) {
    console.error('Failed saving symptoms:', e);
  }
}

// Daily CheckIn Storage
export function loadDailyCheckIn(userId, fallback) {
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
    console.error('Failed saving daily checkin:', e);
  }
}

// Labs Storage
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
    localStorage.setItem(getKey(userId, 'labs'), JSON.stringify(Array.isArray(labsData) ? labsData : []));
  } catch (e) {
    console.error('Failed saving labs:', e);
  }
}

// Documents Storage
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

export function saveDocuments(userId, documentsData) {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId, 'documents'), JSON.stringify(Array.isArray(documentsData) ? documentsData : []));
  } catch (e) {
    console.error('Failed saving documents:', e);
  }
}

// Medications Storage
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
    localStorage.setItem(getKey(userId, 'meds'), JSON.stringify(Array.isArray(medsData) ? medsData : []));
  } catch (e) {
    console.error('Failed saving meds:', e);
  }
}

// Meals Storage
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
    localStorage.setItem(getKey(userId, 'meals'), JSON.stringify(Array.isArray(mealsData) ? mealsData : []));
  } catch (e) {
    console.error('Failed saving meals:', e);
  }
}

// Hydration Storage
export function loadHydration(userId, fallback) {
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
