import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, Check, Sparkles, User, Lock, Mail, AlertCircle, LogIn, UserPlus, Heart } from 'lucide-react';
import { authenticateUser, registerNewUserAccount, getAccountsRegistry } from '../utils/numaStorage';

export default function OnboardingModal({ isOpen, onCompleteOnboarding, onLoginSuccess }) {
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
      setList(list.filter((item) => item !== option)); // DESELECT ON RE-CLICK
    } else {
      setList([...list, option]); // SELECT
    }
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

        {/* SCREEN 1: CHOICE SCREEN (SIGN IN VS REGISTER) */}
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
                    For registered users. Load saved cycles & records without re-typing.
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Create Credentials First</h3>
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
              <input
                type="text"
                placeholder="e.g. Krishna Pankaj Panchal, Maya Verma..."
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
              <input
                type="email"
                placeholder="e.g. user@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Create Password</label>
              <input
                type="password"
                placeholder="Create password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              Continue to 7-Step Clinical Onboarding <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* SCREEN 4: 7-STEP CLINICAL ONBOARDING WIZARD */}
        {screen === 'wizard' && (
          <div>
            
            {/* Step Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)' }}>Step {currentStep} of 7</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <div key={s} style={{
                    width: '24px',
                    height: '6px',
                    borderRadius: 'var(--radius-full)',
                    background: s <= currentStep ? 'var(--primary)' : 'var(--bg-input)'
                  }} />
                ))}
              </div>
            </div>

            {/* STEP 1: PHYSICAL BASELINE */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Step 1: Physical Baseline Numerics</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Exact Age</label>
                    <input type="number" min="12" max="65" value={exactAge} onChange={(e) => setExactAge(e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Height (cm)</label>
                    <input type="number" min="120" max="220" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Weight (kg)</label>
                    <input type="number" min="30" max="200" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} style={{ width: '100%' }} />
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}>
                  Calculated BMI: <strong>{calculatedBmi} kg/m²</strong>
                </div>
              </div>
            )}

            {/* STEP 2: GYNECOLOGICAL & CYCLE HISTORY */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Step 2: Menstrual & Cycle History</h3>
                
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>LMP Date (First Day of Last Period)</label>
                  <input type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} style={{ width: '100%' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Cycle Length (Days)</label>
                    <input type="number" min="20" max="90" value={exactCycleDays} onChange={(e) => setExactCycleDays(e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Period Duration (Days)</label>
                    <input type="number" min="1" max="15" value={exactPeriodDays} onChange={(e) => setExactPeriodDays(e.target.value)} style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: CLINICAL SUBTYPE & LAB FINDINGS (WITH DESELECTION TOGGLE) */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Step 3: Known Lab Biomarkers & Subtype</h3>
                
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                    Known Lab Findings (Tap to Select or Deselect)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {[
                      'High Testosterone / Androgens',
                      'High Fasting Insulin',
                      'LH / FSH Ratio > 2:1',
                      'Elevated AMH (> 4.0 ng/mL)',
                      'Thyroid Dysfunction (TSH)',
                      'Vitamin D Deficiency'
                    ].map((lab) => {
                      const isSelected = knownLabs.includes(lab);
                      return (
                        <button
                          type="button"
                          key={lab}
                          onClick={() => toggleArrayOption(knownLabs, setKnownLabs, lab)} // DESELECT ON RE-CLICK
                          className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                          style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                        >
                          {isSelected && <Check size={14} />} {lab}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: ACTIVE PRESCRIPTIONS (WITH DESELECTION TOGGLE) */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Step 4: Active Prescriptions & Supplements</h3>
                
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                    Current Regimen (Tap to Select or Deselect)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {[
                      'Myo-Inositol & D-Chiro (40:1)',
                      'Metformin XR',
                      'Spironolactone',
                      'Oral Contraceptive Pill',
                      'Vitamin D3 & K2',
                      'Magnesium Glycinate',
                      'Thyroxine / Levothyroxine'
                    ].map((med) => {
                      const isSelected = prescriptions.includes(med);
                      return (
                        <button
                          type="button"
                          key={med}
                          onClick={() => toggleArrayOption(prescriptions, setPrescriptions, med)} // DESELECT ON RE-CLICK
                          className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                          style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                        >
                          {isSelected && <Check size={14} />} {med}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: SYMPTOMS */}
            {currentStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Step 5: Physical Symptom Severities (1-5)</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.2rem' }}>Acne ({acneSeverity}/5)</label>
                    <input type="range" min="1" max="5" value={acneSeverity} onChange={(e) => setAcneSeverity(e.target.value)} style={{ width: '100%' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.2rem' }}>Fatigue ({fatigueSeverity}/5)</label>
                    <input type="range" min="1" max="5" value={fatigueSeverity} onChange={(e) => setFatigueSeverity(e.target.value)} style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: MENTAL & SLEEP */}
            {currentStep === 6 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Step 6: Mental Health, Sleep & Exercise</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Nightly Sleep (Hours)</label>
                    <input type="number" step="0.5" min="4" max="12" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Daily Hydration Target (L)</label>
                    <input type="number" step="0.5" min="1" max="6" value={hydrationTarget} onChange={(e) => setHydrationTarget(e.target.value)} style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: GOALS & FINISH (WITH DESELECTION TOGGLE) */}
            {currentStep === 7 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Step 7: Primary Goals & Write-in Context</h3>
                
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                    Primary Goals (Tap to Select or Deselect)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {[
                      'Regularize menstrual cycle',
                      'Improve insulin sensitivity',
                      'Reduce fatigue & brain fog',
                      'Clear hormonal acne',
                      'Manage weight & waist-to-hip ratio',
                      'Manage hirsutism / hair thinning'
                    ].map((goal) => {
                      const isSelected = primaryGoals.includes(goal);
                      return (
                        <button
                          type="button"
                          key={goal}
                          onClick={() => toggleArrayOption(primaryGoals, setPrimaryGoals, goal)} // DESELECT ON RE-CLICK
                          className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                          style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                        >
                          {isSelected && <Check size={14} />} {goal}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Additional Notes & Clinical Context</label>
                  <textarea rows="2" placeholder="Any specific details you want NUMA to track..." value={writeInNotes} onChange={(e) => setWriteInNotes(e.target.value)} style={{ width: '100%', resize: 'none' }} />
                </div>
              </div>
            )}

            {/* Wizard Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              {currentStep > 1 ? (
                <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="btn btn-outline">
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <button type="button" onClick={() => setScreen('register_credentials')} className="btn btn-outline">
                  <ArrowLeft size={16} /> Back to Credentials
                </button>
              )}

              {currentStep < 7 ? (
                <button type="button" onClick={() => setCurrentStep(currentStep + 1)} className="btn btn-primary">
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishRegistration}
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}
                >
                  <Check size={18} /> Complete Registration & Personalize App
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
