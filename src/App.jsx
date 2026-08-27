import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import QuickCheckInModal from './components/QuickCheckInModal';
import BreathingModal from './components/BreathingModal';
import MeditationModal from './components/MeditationModal';
import MealLogModal from './components/MealLogModal';
import HealthDataModal from './components/HealthDataModal';
import HealthSummaryModal from './components/HealthSummaryModal';
import PrivacySettingsModal from './components/PrivacySettingsModal';
import SettingsModal from './components/SettingsModal';
import DownloadApkModal from './components/DownloadApkModal';
import NotificationsDrawer from './components/NotificationsDrawer';
import OnboardingModal from './components/OnboardingModal';

// Multi-User Database Storage Persistence Adapter
import {
  getActiveUserId,
  setActiveUserId,
  loadProfile, saveProfile,
  loadCycles, saveCycles,
  loadTimeline, saveTimeline,
  loadSymptoms, saveSymptoms,
  loadDailyCheckIn, saveDailyCheckIn,
  loadLabs, saveLabs,
  loadDocuments, saveDocuments,
  loadMeds, saveMeds,
  loadMeals, saveMeals,
  loadHydration, saveHydration,
  logoutUserSession
} from './utils/numaStorage';

// Views
import HomeView from './views/HomeView';
import TrackView from './views/TrackView';
import SleepView from './views/SleepView';
import MentalWellbeingView from './views/MentalWellbeingView';
import NutritionView from './views/NutritionView';
import MedicationView from './views/MedicationView';
import InsightsView from './views/InsightsView';
import PcosFileView from './views/PcosFileView';
import AppointmentView from './views/AppointmentView';
import AiAssistantView from './views/AiAssistantView';
import LearnView from './views/LearnView';

// Clean Default Store Data
import {
  INITIAL_USER_PROFILE,
  INITIAL_CYCLES,
  INITIAL_24HR_TIMELINE,
  INITIAL_SYMPTOMS,
  INITIAL_DAILY_CHECKIN,
  OBSERVED_PATTERNS,
  WHAT_CHANGED,
  APPOINTMENTS,
  EDUCATION_ARTICLES,
  RED_FLAG_CRITERIA
} from './data/mockData';

export default function App() {
  // Theme Engine (Default: Light, persistent in localStorage)
  const [theme, setTheme] = useState(() => localStorage.getItem('numa_theme') || 'light');
  
  // Navigation & Modal State
  const [activeTab, setActiveTab] = useState('home');
  const [showQuickCheckIn, setShowQuickCheckIn] = useState(false);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [showMeditationModal, setShowMeditationModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showHealthSummary, setShowHealthSummary] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDownloadApkModal, setShowDownloadApkModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);

  // Privacy & Stealth Settings
  const [isPrivateMode, setIsPrivateMode] = useState(() => localStorage.getItem('numa_private_mode') === 'true');
  const [aiConsent, setAiConsent] = useState(() => localStorage.getItem('numa_ai_data_consent') !== 'false');

  // Active User Account ID
  const [userId, setUserId] = useState(() => getActiveUserId());

  // User-Scoped Database Persistent States (All Array states guaranteed to be Arrays)
  const [profile, setProfile] = useState(() => loadProfile(userId, INITIAL_USER_PROFILE));
  const [cycles, setCycles] = useState(() => loadCycles(userId, INITIAL_CYCLES));
  const [timeline, setTimeline] = useState(() => loadTimeline(userId, INITIAL_24HR_TIMELINE));
  const [symptoms, setSymptoms] = useState(() => loadSymptoms(userId, INITIAL_SYMPTOMS));
  const [dailyCheckIn, setDailyCheckIn] = useState(() => loadDailyCheckIn(userId, INITIAL_DAILY_CHECKIN));
  const [labs, setLabs] = useState(() => loadLabs(userId, []));
  const [documents, setDocuments] = useState(() => loadDocuments(userId, []));
  const [medications, setMedications] = useState(() => loadMeds(userId, []));
  const [meals, setMeals] = useState(() => loadMeals(userId, []));
  const [hydration, setHydration] = useState(() => loadHydration(userId, { date: new Date().toISOString().split('T')[0], amountMl: 0, targetMl: 2500 }));

  // Static reference content
  const [patterns] = useState(OBSERVED_PATTERNS);
  const [whatChanged] = useState(WHAT_CHANGED);
  const [appointments] = useState(APPOINTMENTS);
  const [articles] = useState(EDUCATION_ARTICLES);
  const [redFlags] = useState(RED_FLAG_CRITERIA);

  // Sync Theme to HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('numa_theme', theme);
  }, [theme]);

  // Sync Privacy States
  useEffect(() => {
    localStorage.setItem('numa_private_mode', isPrivateMode ? 'true' : 'false');
  }, [isPrivateMode]);

  useEffect(() => {
    localStorage.setItem('numa_ai_data_consent', aiConsent ? 'true' : 'false');
  }, [aiConsent]);

  // PERSISTENCE EFFECT: Save to Database storage whenever states or userId mutate
  useEffect(() => { if (userId) saveProfile(userId, profile); }, [profile, userId]);
  useEffect(() => { if (userId) saveCycles(userId, cycles || []); }, [cycles, userId]);
  useEffect(() => { if (userId) saveTimeline(userId, timeline || []); }, [timeline, userId]);
  useEffect(() => { if (userId) saveSymptoms(userId, symptoms || []); }, [symptoms, userId]);
  useEffect(() => { if (userId) saveDailyCheckIn(userId, dailyCheckIn); }, [dailyCheckIn, userId]);
  useEffect(() => { if (userId) saveLabs(userId, labs || []); }, [labs, userId]);
  useEffect(() => { if (userId) saveDocuments(userId, documents || []); }, [documents, userId]);
  useEffect(() => { if (userId) saveMeds(userId, medications || []); }, [medications, userId]);
  useEffect(() => { if (userId) saveMeals(userId, meals || []); }, [meals, userId]);
  useEffect(() => { if (userId) saveHydration(userId, hydration); }, [hydration, userId]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Login Existing User
  const handleLoginSuccess = (userAcc) => {
    const loadedProf = loadProfile(userAcc.id, { ...INITIAL_USER_PROFILE, id: userAcc.id, name: userAcc.name, email: userAcc.email, isOnboarded: true });
    setUserId(userAcc.id);
    setActiveUserId(userAcc.id);

    setProfile(loadedProf);
    setCycles(loadCycles(userAcc.id, INITIAL_CYCLES));
    setTimeline(loadTimeline(userAcc.id, INITIAL_24HR_TIMELINE));
    setSymptoms(loadSymptoms(userAcc.id, INITIAL_SYMPTOMS));
    setDailyCheckIn(loadDailyCheckIn(userAcc.id, INITIAL_DAILY_CHECKIN));
    setLabs(loadLabs(userAcc.id, []));
    setDocuments(loadDocuments(userAcc.id, []));
    setMedications(loadMeds(userAcc.id, []));
    setMeals(loadMeals(userAcc.id, []));
    setHydration(loadHydration(userAcc.id, { date: new Date().toISOString().split('T')[0], amountMl: 0, targetMl: 2500 }));
  };

  // Complete Registration & Save to Database
  const handleCompleteOnboarding = (newProfile) => {
    setUserId(newProfile.id);
    setActiveUserId(newProfile.id);
    setProfile(newProfile);

    if (newProfile.lmpDate) {
      const initialCycle = {
        id: 'c_init_' + Date.now(),
        startDate: newProfile.lmpDate,
        endDate: newProfile.lmpDate,
        length: newProfile.exactCycleDays,
        flow: newProfile.flowIntensity,
        spotting: false,
        crampsSeverity: 3,
        notes: `Initial Period Start Date logged during registration.`
      };
      setCycles([initialCycle]);
    }
  };

  // Logout Handler (Preserves data permanently in database!)
  const handleLogout = () => {
    logoutUserSession();
    setUserId(null);
    setProfile({ ...INITIAL_USER_PROFILE, isOnboarded: false });
    setCycles([]);
    setTimeline([]);
    setSymptoms(INITIAL_SYMPTOMS);
    setDailyCheckIn(INITIAL_DAILY_CHECKIN);
    setLabs([]);
    setDocuments([]);
    setMedications([]);
    setMeals([]);
    setHydration({ date: new Date().toISOString().split('T')[0], amountMl: 0, targetMl: 2500 });
  };

  // Log period from Google Calendar and compute cycle length
  const handleLogPeriod = (periodLog) => {
    const currentCycles = Array.isArray(cycles) ? cycles : [];
    let computedLength = profile.exactCycleDays || 30;

    if (currentCycles.length > 0) {
      const prevStartDate = new Date(currentCycles[0].startDate);
      const newStartDate = new Date(periodLog.startDate);
      const diffTime = Math.abs(newStartDate - prevStartDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0 && diffDays < 90) {
        computedLength = diffDays;
      }
    }

    const newCycleEntry = {
      ...periodLog,
      endDate: periodLog.startDate,
      length: computedLength
    };

    setCycles([newCycleEntry, ...currentCycles]);
  };

  // Delete Period Mark on Date
  const handleDeletePeriodLog = (dateStr) => {
    const currentTimeline = Array.isArray(timeline) ? timeline : [];
    const currentCycles = Array.isArray(cycles) ? cycles : [];
    setTimeline(currentTimeline.filter((e) => e.date !== dateStr || !e.symptom?.includes('Period')));
    setCycles(currentCycles.filter((c) => c.startDate !== dateStr));
  };

  // Delete Individual Timeline Entry
  const handleDeleteTimelineEntry = (eventId) => {
    const currentTimeline = Array.isArray(timeline) ? timeline : [];
    setTimeline(currentTimeline.filter((e) => e.id !== eventId));
  };

  // Update Individual Timeline Entry
  const handleUpdateTimelineEntry = (updatedEntry) => {
    const currentTimeline = Array.isArray(timeline) ? timeline : [];
    setTimeline(currentTimeline.map((e) => e.id === updatedEntry.id ? updatedEntry : e));
  };

  // Symptom Management Handlers
  const handleSaveSymptom = (updatedSymptom) => {
    const currentSymptoms = Array.isArray(symptoms) ? symptoms : [];
    setSymptoms(currentSymptoms.map((s) => s.id === updatedSymptom.id ? updatedSymptom : s));
  };

  const handleAddCustomSymptom = (newCustomSymptom) => {
    const currentSymptoms = Array.isArray(symptoms) ? symptoms : [];
    setSymptoms([newCustomSymptom, ...currentSymptoms]);
  };

  // Handlers for data mutations (Safe Array Guarded)
  const handleSaveDailyCheckIn = (newCheckIn) => {
    setDailyCheckIn(newCheckIn);
  };

  const handleAddTimelineEntry = (newEntry) => {
    const currentTimeline = Array.isArray(timeline) ? timeline : [];
    setTimeline([newEntry, ...currentTimeline]);
  };

  const handleAddLabResult = (newLab) => {
    const currentLabs = Array.isArray(labs) ? labs : [];
    setLabs([newLab, ...currentLabs]);
  };

  const handleAddMeal = (meal) => {
    const currentTimeline = Array.isArray(timeline) ? timeline : [];
    setTimeline([
      {
        id: meal.id,
        date: new Date().toISOString().split('T')[0],
        time: meal.time,
        symptom: `Meal Logged: ${meal.type}`,
        severity: 1,
        bleedingLevel: 'None',
        painLevel: 0,
        notes: `${meal.description} (${meal.analysis?.pcosRating || 'Low GI'})`
      },
      ...currentTimeline
    ]);
    setShowMealModal(false);
  };

  const handleSaveHealthData = (healthData) => {
    const currentTimeline = Array.isArray(timeline) ? timeline : [];
    setTimeline([
      {
        id: 'h_' + Date.now(),
        date: healthData.date,
        time: 'Logged Just Now',
        symptom: `Metabolic Log: BP ${healthData.bp}`,
        severity: 1,
        bleedingLevel: 'None',
        painLevel: 0,
        notes: `Fasting Glucose: ${healthData.glucose} mg/dL • Weight: ${healthData.weightKg} kg (BMI ${healthData.bmi})`
      },
      ...currentTimeline
    ]);
  };

  const isUserAuthenticated = Boolean(userId && profile.isOnboarded);

  return (
    <ErrorBoundary>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', width: '100vw', minHeight: '100vh' }}>
        {/* Secure Multi-User Auth Guard */}
        <OnboardingModal
          isOpen={!isUserAuthenticated}
          onCompleteOnboarding={handleCompleteOnboarding}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Main Full-Width App Container with Top Header Navbar */}
        <div className="main-content" style={{ width: '100%', flex: 1, margin: 0, padding: 0 }}>
          <Header
            theme={theme}
            toggleTheme={toggleTheme}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenQuickCheckIn={() => setShowQuickCheckIn(true)}
            onOpenBreathing={() => setShowBreathingModal(true)}
            onOpenMeditation={() => setShowMeditationModal(true)}
            onOpenHealthSummary={() => setShowHealthSummary(true)}
            onOpenPrivacy={() => setShowPrivacyModal(true)}
            onOpenDownloadApk={() => setShowDownloadApkModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenNotifications={() => setShowNotificationsDrawer(true)}
            onLogout={handleLogout}
            profile={profile}
          />

          <main className="content-body" style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            {activeTab === 'home' && (
              <HomeView
                profile={profile}
                dailyCheckIn={dailyCheckIn}
                timeline={timeline || []}
                patterns={patterns}
                appointments={appointments}
                onOpenCheckIn={() => setShowQuickCheckIn(true)}
                onNavigate={setActiveTab}
                onOpenMealLog={() => setShowMealModal(true)}
                onOpenHealthData={() => setShowHealthModal(true)}
                onOpenBreathing={() => setShowBreathingModal(true)}
              />
            )}

            {activeTab === 'track' && (
              <TrackView
                cycles={cycles || []}
                timeline={timeline || []}
                symptoms={symptoms || []}
                medications={medications || []}
                labs={labs || []}
                documents={documents || []}
                appointments={appointments || []}
                onAddTimelineEntry={handleAddTimelineEntry}
                onUpdateTimelineEntry={handleUpdateTimelineEntry}
                onLogPeriod={handleLogPeriod}
                onDeletePeriodLog={handleDeletePeriodLog}
                onDeleteTimelineEntry={handleDeleteTimelineEntry}
                onSaveSymptom={handleSaveSymptom}
                onAddCustomSymptom={handleAddCustomSymptom}
              />
            )}

            {activeTab === 'sleep' && (
              <SleepView
                profile={profile}
                cycles={cycles || []}
                symptoms={symptoms || []}
                timeline={timeline || []}
                onAddTimelineEntry={handleAddTimelineEntry}
                onDeleteTimelineEntry={handleDeleteTimelineEntry}
              />
            )}

            {activeTab === 'mental' && (
              <MentalWellbeingView
                profile={profile}
                cycles={cycles || []}
                symptoms={symptoms || []}
                timeline={timeline || []}
                onAddTimelineEntry={handleAddTimelineEntry}
              />
            )}

            {activeTab === 'nutrition' && (
              <NutritionView
                meals={meals || []}
                hydration={hydration}
                timeline={timeline || []}
                onAddMeal={handleAddMeal}
                onUpdateMeals={(val) => setMeals(Array.isArray(val) ? val : [])}
                onUpdateHydration={setHydration}
                onAddTimelineEntry={handleAddTimelineEntry}
              />
            )}

            {activeTab === 'meds' && (
              <MedicationView
                profile={profile}
                medications={medications || []}
                onUpdateMedications={(val) => setMedications(Array.isArray(val) ? val : [])}
                onAddTimelineEntry={handleAddTimelineEntry}
              />
            )}

            {activeTab === 'insights' && (
              <InsightsView
                patterns={patterns}
                whatChanged={whatChanged}
                cycles={cycles || []}
              />
            )}

            {activeTab === 'pcosFile' && (
              <PcosFileView
                labs={labs || []}
                documents={documents || []}
                profile={profile}
                cycles={cycles || []}
                symptoms={symptoms || []}
                timeline={timeline || []}
                medications={medications || []}
                meals={meals || []}
                hydration={hydration}
                appointments={appointments || []}
                onAddLabResult={handleAddLabResult}
                onUpdateLabs={(val) => setLabs(Array.isArray(val) ? val : [])}
                onUpdateDocuments={(val) => setDocuments(Array.isArray(val) ? val : [])}
              />
            )}

            {activeTab === 'appointment' && (
              <AppointmentView
                appointments={appointments && appointments.length > 0 ? appointments : [{
                  id: "a_default",
                  doctor: "Dr. Healthcare Professional",
                  specialty: "Reproductive Endocrinologist",
                  date: "Not scheduled",
                  time: "--:--",
                  clinic: "Clinic / Hospital",
                  status: "Upcoming",
                  savedQuestions: ["What dietary tweaks support my insulin sensitivity?"]
                }]}
                profile={profile}
                cycles={cycles || []}
                symptoms={symptoms || []}
                labs={labs || []}
                medications={medications || []}
                timeline={timeline || []}
              />
            )}

            {activeTab === 'ai' && (
              <AiAssistantView
                profile={profile}
                cycles={cycles || []}
                labs={labs || []}
                symptoms={symptoms || []}
                timeline={timeline || []}
                medications={medications || []}
                documents={documents || []}
                appointments={appointments || []}
              />
            )}

            {activeTab === 'learn' && (
              <LearnView
                articles={articles}
                redFlags={redFlags}
              />
            )}
          </main>
        </div>

        {/* Modals & Drawers */}
        <QuickCheckInModal
          isOpen={showQuickCheckIn}
          onClose={() => setShowQuickCheckIn(false)}
          onSaveCheckIn={handleSaveDailyCheckIn}
          initialData={dailyCheckIn}
        />

        <BreathingModal
          isOpen={showBreathingModal}
          onClose={() => setShowBreathingModal(false)}
        />

        <MeditationModal
          isOpen={showMeditationModal}
          onClose={() => setShowMeditationModal(false)}
        />

        <MealLogModal
          isOpen={showMealModal}
          onClose={() => setShowMealModal(false)}
          onAddMeal={handleAddMeal}
        />

        <HealthDataModal
          isOpen={showHealthModal}
          onClose={() => setShowHealthModal(false)}
          onSaveHealthData={handleSaveHealthData}
        />

        <HealthSummaryModal
          isOpen={showHealthSummary}
          onClose={() => setShowHealthSummary(false)}
          profile={profile}
          cycles={cycles || []}
          timeline={timeline || []}
          symptoms={symptoms || []}
          labs={labs || []}
          medications={medications || []}
          meals={meals || []}
          hydration={hydration}
          appointments={appointments || []}
        />

        <PrivacySettingsModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
          profile={profile}
          cycles={cycles || []}
          timeline={timeline || []}
          symptoms={symptoms || []}
          labs={labs || []}
          documents={documents || []}
          medications={medications || []}
          meals={meals || []}
          hydration={hydration}
          appointments={appointments || []}
          isPrivateMode={isPrivateMode}
          setIsPrivateMode={setIsPrivateMode}
          aiConsent={aiConsent}
          setAiConsent={setAiConsent}
          onLogout={handleLogout}
        />

        <DownloadApkModal
          isOpen={showDownloadApkModal}
          onClose={() => setShowDownloadApkModal(false)}
        />

        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          profile={profile}
          onUpdateProfile={setProfile}
          onLogout={handleLogout}
        />

        <NotificationsDrawer
          isOpen={showNotificationsDrawer}
          onClose={() => setShowNotificationsDrawer(false)}
          onNavigate={setActiveTab}
          onOpenCheckIn={() => setShowQuickCheckIn(true)}
        />
      </div>
    </ErrorBoundary>
  );
}
