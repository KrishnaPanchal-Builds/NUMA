import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, Check, Sparkles, User, Lock, Mail, AlertCircle, LogIn, UserPlus, Heart, Key, CheckCircle2, Smartphone, Download } from 'lucide-react';
import { authenticateUser, registerNewUserAccount, getAccountsRegistry } from '../utils/numaStorage';

export default function OnboardingModal({ isOpen, onCompleteOnboarding, onLoginSuccess, onOpenDownloadApk }) {
  if (!isOpen) return null;

  // Auth Screen View State: 'choice' | 'login' | 'register_credentials' | 'wizard'
  const [screen, setScreen] = useState('choice');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Credentials State (Step 0)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Wizard Step State (Steps 1 to 7)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Baseline Physical Numerics
  const [exactAge, setExactAge] = useState(27);
  const [heightCm, setHeightCm] = useState(165);
  const [weightKg, setWeightKg] = useState(62);

  // Step 2: Gynecological & Cycle Numerics
  const [lmpDate, setLmpDate] = useState('2026-08-01');
  const [exactCycleDays, setExactCycleDays] = useState(34);
  const [exactPeriodDays, setExactPeriodDays] = useState(5);
  const [flowIntensity, setFlowIntensity] = useState('Medium');
  const [crampsSeverity, setCrampsSeverity] = useState(3);
  const [pillHistory, setPillHistory] = useState('Never taken');

  // Step 3: Clinical Subtype & Lab Findings
  const [diagnosisStatus, setDiagnosisStatus] = useState('Confirmed PCOS by Gynecologist');
  const [pcosSubtype, setPcosSubtype] = useState('Insulin Resistant & Adrenal PCOS');
  const [knownLabs, setKnownLabs] = useState(['High Testosterone / Androgens', 'High Fasting Insulin']);

  // Step 4: Active Prescriptions
  const [prescriptions, setPrescriptions] = useState(['Myo-Inositol & D-Chiro (40:1)', 'Vitamin D3 & K2']);

  // Step 5: Symptom Severities (1-5)
  const [acneSeverity, setAcneSeverity] = useState(2);
  const [acneLocation, setAcneLocation] = useState('Jawline & Chin');
  const [hirsutismSeverity, setHirsutismSeverity] = useState(2);
  const [hairLossSeverity, setHairLossSeverity] = useState(1);
  const [fatigueSeverity, setFatigueSeverity] = useState(3);
  const [bloatingSeverity, setBloatingSeverity] = useState(2);
  const [cravingsSeverity, setCravingsSeverity] = useState(4);

  // Step 6: Mental, Sleep & Activity
  const [baselineMood, setBaselineMood] = useState('Mild Anxiety & Fatigue');
  const [sleepHours, setSleepHours] = useState(7.2);
  const [bedtime, setBedtime] = useState('11:00 PM');
  const [exerciseFreq, setExerciseFreq] = useState('3-4 times per week (Pilates & Strength)');

  // Step 7: Goals, Diet & Write-in
  const [primaryGoals, setPrimaryGoals] = useState(['Regularize menstrual cycle', 'Improve insulin sensitivity', 'Reduce fatigue']);
  const [dietaryPreference, setDietaryPreference] = useState('Low Glycemic Index (Low GI)');
  const [hydrationTarget, setHydrationTarget] = useState(2.5);
  const [writeInNotes, setWriteInNotes] = useState('');

  // Real-time calculated BMI
  const heightInMeters = heightCm / 100;
  const calculatedBmi = (heightInMeters > 0) ? (weightKg / (heightInMeters * heightInMeters)).toFixed(1) : 22.8;

  // Toggle option deselection helper
  const toggleArrayOption = (list, setList, option) => {
    if (list.includes(option)) {
      setList(list.filter((item) => item !== option));
    } else {
      setList([...list, option]);
    }
  };

  // Helper: Auto-fill Demo Credentials
  const handleFillDemoCredentials = () => {
    setLoginEmail('krishna@numa.health');
    setLoginPassword('password123');
    setLoginError('');
  };

  // Handle Existing User Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const res = authenticateUser(loginEmail, loginPassword);
    if (res.success) {
      onLoginSuccess(res.user);
    } else {
      setLoginError(res.message);
    }
  };

  // Handle Step 0: Register Credentials Submit -> Move to Step 1
  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Please fill in all credential fields (Name, Email, Password)');
      return;
    }
    setRegError('');
    setCurrentStep(1);
    setScreen('wizard');
  };

  // Handle Step 7 Finish -> Save Account & Navigate to Main App Dashboard
  const handleFinishRegistration = () => {
    const newAcc = registerNewUserAccount(regName, regEmail, regPassword);

    const userProfile = {
      id: newAcc.id,
      name: regName.trim(),
      email: regEmail.trim(),
      exactAge: parseInt(exactAge),
      heightCm: parseFloat(heightCm),
      weightKg: parseFloat(weightKg),
      bmi: parseFloat(calculatedBmi),
      lmpDate,
      exactCycleDays: parseInt(exactCycleDays),
      exactPeriodDays: parseInt(exactPeriodDays),
      flowIntensity,
      crampsSeverity: parseInt(crampsSeverity),
      pillHistory,
      diagnosisStatus,
      pcosSubtype,
      knownLabs,
      prescriptions,
      symptomSeverities: {
        acne: { severity: acneSeverity, location: acneLocation },
        hirsutism: hirsutismSeverity,
        hairLoss: hairLossSeverity,
        fatigue: fatigueSeverity,
        bloating: bloatingSeverity,
        cravings: cravingsSeverity,
      },
      baselineMood,
      sleepHours: parseFloat(sleepHours),
      bedtime,
      exerciseFreq,
      goals: primaryGoals,
      dietaryPreference,
      hydrationTarget: parseFloat(hydrationTarget),
      writeInNotes,
      currentCycleDay: 14,
      estimatedCycleLength: parseInt(exactCycleDays),
      currentPhase: 'Follicular Phase',
      isOnboarded: true,
    };

    onCompleteOnboarding(userProfile);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999, background: 'rgba(5, 7, 13, 0.88)', backdropFilter: 'blur(12px)' }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '2.25rem', borderRadius: 'var(--radius-xl)' }}>
        
        {/* Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            fontWeight: '800',
            fontSize: '1.6rem',
            marginBottom: '0.6rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            N
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>NUMA: PCOS Health Companion</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Empirical Tracking, 24-Hr Symptom Timelines & Personalized Health Insights
          </p>
        </div>

        {/* SCREEN 1: CHOICE SCREEN (SIGN IN VS REGISTER VS DOWNLOAD APK) */}
        {screen === 'choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', textAlign: 'center', fontWeight: '600' }}>
              Welcome! Please select how you would like to proceed:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              
              {/* Option A: Existing User Login */}
              <button
                type="button"
                onClick={() => setScreen('login')}
                className="numa-card glass-card numa-card-interactive"
                style={{ padding: '1.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', border: '2px solid var(--primary)' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LogIn size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.25rem' }}>Sign In</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    For registered users or Demo Login. Load saved cycles & records instantly.
                  </p>
                </div>
              </button>

              {/* Option B: New User Registration */}
              <button
                type="button"
                onClick={() => setScreen('register_credentials')}
                className="numa-card glass-card numa-card-interactive"
                style={{ padding: '1.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', border: '2px solid var(--secondary)' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.25rem' }}>Register New User</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Create credentials and personalize your 7-step clinical PCOS profile.
                  </p>
                </div>
              </button>

            </div>

            {/* Option C: Direct Download Mobile App (APK) Banner */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onOpenDownloadApk}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.9rem 1rem', fontSize: '0.925rem', fontWeight: '800', gap: '0.6rem', justifyContent: 'center' }}
              >
                <Smartphone size={20} /> 📱 Download Android App (APK) & Install Mobile App
              </button>

              <a
                href="/numa-pcos-companion.apk"
                download="numa-pcos-companion.apk"
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', textDecoration: 'underline' }}
              >
                📥 Direct Download APK File (numa-pcos-companion.apk)
              </a>
            </div>

          </div>
        )}

        {/* SCREEN 2: LOGIN FORM FOR EXISTING USERS */}
        {screen === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Sign In to Your Account</h3>
              <button type="button" onClick={() => setScreen('choice')} className="btn btn-outline" style={{ fontSize: '0.75rem' }}>
                ← Back to Choice
              </button>
            </div>

            {/* Quick Demo Credentials Banner */}
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary-dark)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>💡 Demo Account Available:</strong>
                <div>Email: <code>krishna@numa.health</code> | Password: <code>password123</code></div>
              </div>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="btn btn-primary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', whiteSpace: 'nowrap' }}
              >
                1-Tap Auto Fill
              </button>
            </div>

            {loginError && (
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> {loginError}
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Username or Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Enter your registered email or username"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              <LogIn size={18} /> Sign In & Load My Saved Health Records
            </button>
          </form>
        )}

        {/* SCREEN 3: REGISTER CREDENTIALS FIRST (STEP 0) */}
        {screen === 'register_credentials' && (
          <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Create Account Credentials</h3>
              <button type="button" onClick={() => setScreen('choice')} className="btn btn-outline" style={{ fontSize: '0.75rem' }}>
                ← Back to Choice
              </button>
            </div>

            {regError && (
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', fontSize: '0.825rem' }}>
                {regError}
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>First & Last Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. Krishna Panchal"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="e.g. krishna@numa.health"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Create Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  placeholder="Create a secure password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              Continue to Clinical Profile Customization (7 Steps) →
            </button>
          </form>
        )}

        {/* SCREEN 4: 7-STEP CLINICAL ONBOARDING WIZARD */}
        {screen === 'wizard' && (
          <div>
            {/* Progress Stepper Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Step {currentStep} of 7
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                  {currentStep === 1 && '1. Baseline Physical Numerics'}
                  {currentStep === 2 && '2. Gynecological & Cycle Baseline'}
                  {currentStep === 3 && '3. PCOS Diagnosis & Subtype'}
                  {currentStep === 4 && '4. Active Prescriptions & Supplements'}
                  {currentStep === 5 && '5. Baseline Symptom Severities (1-5)'}
                  {currentStep === 6 && '6. Sleep, Mental Baseline & Activity'}
                  {currentStep === 7 && '7. Personal Goals & Health Preferences'}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <div
                    key={s}
                    style={{
                      width: '24px',
                      height: '6px',
                      borderRadius: 'var(--radius-full)',
                      background: s === currentStep ? 'var(--primary)' : s < currentStep ? 'var(--secondary)' : 'var(--border-color)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* STEP 1: PHYSICAL NUMERICS */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Exact Age</label>
                    <input type="number" min="12" max="75" value={exactAge} onChange={(e) => setExactAge(e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Height (cm)</label>
                    <input type="number" min="100" max="220" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Weight (kg)</label>
                    <input type="number" min="30" max="200" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} style={{ width: '100%' }} />
                  </div>
                </div>

                <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Calculated Body Mass Index (BMI)</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{calculatedBmi} kg/m²</strong>
                  </div>
                  <span className="badge badge-mint" style={{ fontSize: '0.75rem' }}>Automated Clinical Metric</span>
                </div>
              </div>
            )}

            {/* STEP 2: GYNECOLOGICAL BASELINE */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Last Period Start Date (LMP)</label>
                    <input type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Average Cycle Duration (Days)</label>
                    <input type="number" min="15" max="120" value={exactCycleDays} onChange={(e) => setExactCycleDays(e.target.value)} style={{ width: '100%' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Average Period Length (Days)</label>
                    <input type="number" min="1" max="15" value={exactPeriodDays} onChange={(e) => setExactPeriodDays(e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Baseline Flow Intensity</label>
                    <select value={flowIntensity} onChange={(e) => setFlowIntensity(e.target.value)} style={{ width: '100%' }}>
                      <option value="Light">Light Flow</option>
                      <option value="Medium">Medium Flow</option>
                      <option value="Heavy">Heavy Flow</option>
                      <option value="Very Heavy / Clots">Very Heavy with Clots</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Oral Contraceptive Pill History</label>
                  <select value={pillHistory} onChange={(e) => setPillHistory(e.target.value)} style={{ width: '100%' }}>
                    <option value="Never taken">Never taken hormonal birth control</option>
                    <option value="Currently taking COCP">Currently taking Combined Oral Contraceptive Pill</option>
                    <option value="Stopped < 6 months ago">Stopped birth control less than 6 months ago (Post-Pill PCOS)</option>
                    <option value="Stopped > 1 year ago">Stopped birth control over 1 year ago</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3: CLINICAL DIAGNOSIS & SUBTYPE */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Clinical Diagnosis Status</label>
                  <select value={diagnosisStatus} onChange={(e) => setDiagnosisStatus(e.target.value)} style={{ width: '100%' }}>
                    <option value="Confirmed PCOS by Gynecologist">Confirmed PCOS (Rotterdam Criteria met)</option>
                    <option value="Suspected PCOS / Self-Triage">Suspected PCOS (Irregular cycles & acne/hirsutism)</option>
                    <option value="PCOD Diagnosis">PCOD Diagnosis</option>
                    <option value="Exploring Hormonal Health">Exploring Menstrual & Hormonal Health</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Primary PCOS Subtype Classification</label>
                  <select value={pcosSubtype} onChange={(e) => setPcosSubtype(e.target.value)} style={{ width: '100%' }}>
                    <option value="Insulin Resistant PCOS">Insulin Resistant PCOS (~70% of cases)</option>
                    <option value="Insulin Resistant & Adrenal PCOS">Insulin Resistant & Adrenal Combined Subtype</option>
                    <option value="Inflammatory PCOS">Inflammatory PCOS</option>
                    <option value="Adrenal PCOS">Adrenal PCOS (Driven by DHEA-S & Cortisol)</option>
                    <option value="Post-Pill PCOS">Post-Pill PCOS</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>Known Lab Findings (Select all that apply)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {['High Fasting Insulin', 'High Testosterone / Androgens', 'Elevated DHEA-S', 'High LH:FSH Ratio (>2:1)', 'High AMH (>4.5 ng/mL)', 'Vitamin D Deficiency'].map((lab) => (
                      <button
                        type="button"
                        key={lab}
                        onClick={() => toggleArrayOption(knownLabs, setKnownLabs, lab)}
                        className={`btn ${knownLabs.includes(lab) ? 'btn-primary' : 'btn-outline'}`}
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem', textAlign: 'left', justifyContent: 'flex-start' }}
                      >
                        {knownLabs.includes(lab) ? '✓ ' : '+ '} {lab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PRESCRIPTIONS & SUPPLEMENTS */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block' }}>Select Active Prescriptions & Supplements</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {[
                    'Metformin XR (500mg - 1000mg)',
                    'Myo-Inositol & D-Chiro (40:1)',
                    'Spironolactone (50mg)',
                    'Spearmint Leaf Tea (2 cups/day)',
                    'Vitamin D3 & K2',
                    'Omega-3 Fish Oil (1000mg)',
                    'Magnesium Glycinate (400mg)',
                    'Berberine HCl (500mg)'
                  ].map((med) => (
                    <button
                      type="button"
                      key={med}
                      onClick={() => toggleArrayOption(prescriptions, setPrescriptions, med)}
                      className={`btn ${prescriptions.includes(med) ? 'btn-primary' : 'btn-outline'}`}
                      style={{ fontSize: '0.75rem', padding: '0.5rem', textAlign: 'left', justifyContent: 'flex-start' }}
                    >
                      {prescriptions.includes(med) ? '✓ ' : '+ '} {med}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: SYMPTOM SEVERITIES */}
            {currentStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '0.4rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.2rem' }}>
                    <span>Hormonal Acne Severity</span>
                    <span>{acneSeverity}/5 ({acneSeverity === 1 ? 'Mild' : acneSeverity === 5 ? 'Severe Cystic' : 'Moderate'})</span>
                  </div>
                  <input type="range" min="1" max="5" value={acneSeverity} onChange={(e) => setAcneSeverity(parseInt(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.2rem' }}>
                    <span>Hirsutism (Excess Hair Growth) Severity</span>
                    <span>{hirsutismSeverity}/5</span>
                  </div>
                  <input type="range" min="1" max="5" value={hirsutismSeverity} onChange={(e) => setHirsutismSeverity(parseInt(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.2rem' }}>
                    <span>Chronic Fatigue Baseline</span>
                    <span>{fatigueSeverity}/5</span>
                  </div>
                  <input type="range" min="1" max="5" value={fatigueSeverity} onChange={(e) => setFatigueSeverity(parseInt(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.2rem' }}>
                    <span>Sugar & Carbohydrate Cravings</span>
                    <span>{cravingsSeverity}/5</span>
                  </div>
                  <input type="range" min="1" max="5" value={cravingsSeverity} onChange={(e) => setCravingsSeverity(parseInt(e.target.value))} style={{ width: '100%' }} />
                </div>
              </div>
            )}

            {/* STEP 6: SLEEP & ACTIVITY */}
            {currentStep === 6 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Average Sleep Duration (Hours)</label>
                    <input type="number" step="0.1" min="4" max="12" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Target Bedtime</label>
                    <input type="text" value={bedtime} onChange={(e) => setBedtime(e.target.value)} style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Physical Activity Pattern</label>
                  <select value={exerciseFreq} onChange={(e) => setExerciseFreq(e.target.value)} style={{ width: '100%' }}>
                    <option value="3-4 times per week (Pilates & Strength)">3-4 times per week (Low-impact Pilates & Strength)</option>
                    <option value="Daily Walking & Light Yoga">Daily Walking & Gentle Yoga</option>
                    <option value="High Intensity Interval Training (HIIT)">HIIT & Cardio Focus</option>
                    <option value="Sedentary / Recovery Phase">Currently Sedentary / Stress Recovery</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 7: GOALS & FINISH */}
            {currentStep === 7 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>Select Primary Goals</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {['Regularize menstrual cycle', 'Improve insulin sensitivity', 'Reduce fatigue & brain fog', 'Manage hormonal acne', 'Weight management', 'Fertility & Ovulation tracking'].map((goal) => (
                      <button
                        type="button"
                        key={goal}
                        onClick={() => toggleArrayOption(primaryGoals, setPrimaryGoals, goal)}
                        className={`btn ${primaryGoals.includes(goal) ? 'btn-primary' : 'btn-outline'}`}
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem', textAlign: 'left', justifyContent: 'flex-start' }}
                      >
                        {primaryGoals.includes(goal) ? '✓ ' : '+ '} {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Dietary Preference</label>
                  <select value={dietaryPreference} onChange={(e) => setDietaryPreference(e.target.value)} style={{ width: '100%' }}>
                    <option value="Low Glycemic Index (Low GI)">Low Glycemic Index (Low GI)</option>
                    <option value="Anti-Inflammatory Mediterranean">Anti-Inflammatory Mediterranean</option>
                    <option value="High Protein Low Carb">High Protein Low Carb</option>
                    <option value="Vegetarian / Plant-Based">Vegetarian / Plant-Based</option>
                  </select>
                </div>
              </div>
            )}

            {/* Wizard Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              {currentStep > 1 ? (
                <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="btn btn-outline">
                  <ArrowLeft size={16} /> Back
                </button>
              ) : <div />}

              {currentStep < 7 ? (
                <button type="button" onClick={() => setCurrentStep(currentStep + 1)} className="btn btn-primary">
                  Next Step <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" onClick={handleFinishRegistration} className="btn btn-secondary">
                  <CheckCircle2 size={16} /> Complete & Launch My Companion
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
