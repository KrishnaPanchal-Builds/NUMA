import React, { useState } from 'react';
import { X, User, Bell, Download, ShieldCheck, Check, LogOut, Sliders, Heart, Target, Plus, Trash2, Utensils, Activity, Sparkles } from 'lucide-react';
import { getUserInitials } from '../utils/numaStorage';

export default function SettingsModal({ isOpen, onClose, profile, onUpdateProfile, onLogout }) {
  if (!isOpen) return null;

  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile' | 'tracking' | 'lifestyle' | 'custom' | 'notifications'
  
  // Profile & Demographics
  const [name, setName] = useState(profile.name || '');
  const [ageGroup, setAgeGroup] = useState(profile.ageGroup || '25-30 years');
  const [pcosSubtype, setPcosSubtype] = useState(profile.pcosSubtype || 'Hormonal & Metabolic PCOS');
  const [heightCm, setHeightCm] = useState(profile.heightCm || 165);
  const [weightKg, setWeightKg] = useState(profile.weightKg || 62);
  const [exactCycleDays, setExactCycleDays] = useState(profile.exactCycleDays || 34);

  // Modular Custom Tracking Feature Selectors (Default: All active)
  const defaultTracking = profile.activeTracking || {
    track: true,
    sleep: true,
    mental: true,
    nutrition: true,
    meds: true,
    pcosFile: true,
    appointment: true,
    ai: true,
    learn: true
  };
  const [activeTracking, setActiveTracking] = useState(defaultTracking);

  // Lifestyle Preferences
  const [dietaryPref, setDietaryPref] = useState(profile.dietaryPreference || 'Low Glycemic');
  const [activityPref, setActivityPref] = useState(profile.activityPreference || 'Low-Impact Cardio & Strength');
  
  // Goals (Array)
  const [goals, setGoals] = useState(profile.goals || ['Regulate Cycle', 'Reduce Fatigue', 'Manage Acne']);
  
  // Custom Tracking Fields List
  const [customFields, setCustomFields] = useState(profile.customFields || ['Hair Thinning', 'Bloating Level', 'Caffeine Intake']);
  const [newCustomField, setNewCustomField] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState(profile.notifications || {
    periodReminders: true,
    medicationAlerts: true,
    dailyCheckIn: true,
    hydrationAlerts: true
  });

  const [isSaved, setIsSaved] = useState(false);

  const toggleGoal = (goalStr) => {
    if (goals.includes(goalStr)) {
      setGoals(goals.filter(g => g !== goalStr));
    } else {
      setGoals([...goals, goalStr]);
    }
  };

  const handleAddCustomField = () => {
    if (newCustomField.trim() && !customFields.includes(newCustomField.trim())) {
      setCustomFields([...customFields, newCustomField.trim()]);
      setNewCustomField('');
    }
  };

  const handleRemoveCustomField = (fieldToRemove) => {
    setCustomFields(customFields.filter(f => f !== fieldToRemove));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      ageGroup,
      pcosSubtype,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      exactCycleDays: Number(exactCycleDays),
      activeTracking,
      dietaryPreference: dietaryPref,
      activityPreference: activityPref,
      goals,
      customFields,
      notifications
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `numa_pcos_health_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const userInitials = getUserInitials(name || profile.name);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '640px', maxHeight: '88vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.1rem',
              border: '2px solid var(--primary)'
            }}>
              {userInitials}
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Personalization & Settings</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customize your profile, active features, preferences & custom fields.</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Sub-Nav Bar */}
        <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem', marginBottom: '1.15rem', overflowX: 'auto' }}>
          <button onClick={() => setActiveSubTab('profile')} className={`btn ${activeSubTab === 'profile' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}>
            <User size={13} /> Profile
          </button>
          <button onClick={() => setActiveSubTab('tracking')} className={`btn ${activeSubTab === 'tracking' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}>
            <Sliders size={13} /> Custom Tracking
          </button>
          <button onClick={() => setActiveSubTab('lifestyle')} className={`btn ${activeSubTab === 'lifestyle' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}>
            <Utensils size={13} /> Lifestyle & Goals
          </button>
          <button onClick={() => setActiveSubTab('custom')} className={`btn ${activeSubTab === 'custom' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}>
            <Plus size={13} /> Custom Fields
          </button>
          <button onClick={() => setActiveSubTab('notifications')} className={`btn ${activeSubTab === 'notifications' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}>
            <Bell size={13} /> Alerts
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* TAB 1: PROFILE & DEMOGRAPHICS */}
          {activeSubTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>First & Last Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Krishna Pankaj Panchal"
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Age Group</label>
                  <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} style={{ width: '100%' }}>
                    {['Under 18', '18-24 years', '25-30 years', '31-35 years', '36-40 years', '40+ years'].map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Baseline Cycle Length (Days)</label>
                  <input
                    type="number"
                    value={exactCycleDays}
                    onChange={(e) => setExactCycleDays(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>PCOS Subtype Profile</label>
                <input
                  type="text"
                  value={pcosSubtype}
                  onChange={(e) => setPcosSubtype(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: MODULAR CUSTOM TRACKING FEATURE SELECTOR */}
          {activeSubTab === 'tracking' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ background: 'var(--bg-input)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                💡 <strong>Choose What You Want to Track:</strong> Toggle off any features you don't wish to use. Unchecked features will be hidden from your top navigation bar.
              </div>

              {[
                { key: 'track', title: 'Period & Cycle Calendar', desc: 'Track menstrual flow, ovulation, spotting & cramps.' },
                { key: 'sleep', title: 'Sleep & Circadian Rhythm', desc: 'Log bedtimes, wake times, and sleep quality.' },
                { key: 'mental', title: 'Mental Well-Being & Mood', desc: 'Daily mood check-ins, stress ratings, and breathing exercises.' },
                { key: 'nutrition', title: 'AI Nutrition & Meal Tracker', desc: 'Food recognition, Glycemic Index ratings, and hydration.' },
                { key: 'meds', title: 'Medications & Supplements', desc: 'Active prescription adherence and supplement logs.' },
                { key: 'pcosFile', title: 'My PCOS File (Labs & Docs)', desc: 'Master health record, lab biomarkers, and medical document OCR.' },
                { key: 'appointment', title: 'Appointment Prep Wizard', desc: '1-page printable clinical brief and doctor questions.' },
                { key: 'ai', title: 'Ask NUMA AI Assistant', desc: 'Real-time universal ChatGPT/Claude AI agent.' },
                { key: 'learn', title: 'Learn Hub & Clinical Guidance', desc: 'Evidence-based PCOS articles and red-flag guides.' },
              ].map((item) => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeTracking[item.key] !== false}
                    onChange={(e) => setActiveTracking({ ...activeTracking, [item.key]: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: LIFESTYLE & GOALS */}
          {activeSubTab === 'lifestyle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Dietary Preference</label>
                  <select value={dietaryPref} onChange={(e) => setDietaryPref(e.target.value)} style={{ width: '100%' }}>
                    {['Low Glycemic', 'Anti-Inflammatory', 'High Protein Low Carb', 'Mediterranean', 'Vegetarian / Vegan', 'Gluten-Free'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Activity Preference</label>
                  <select value={activityPref} onChange={(e) => setActivityPref(e.target.value)} style={{ width: '100%' }}>
                    {['Low-Impact Cardio & Strength', 'Pilates & Yoga', 'Walking & Gentle Stretches', 'HIIT & Resistance Training'].map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>Personal Health Goals</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {['Regulate Cycle', 'Reduce Fatigue', 'Manage Acne', 'Boost Fertility', 'Improve Sleep', 'Weight Management', 'Stress Reduction'].map((gStr) => {
                    const isSelected = goals.includes(gStr);
                    return (
                      <button
                        key={gStr}
                        type="button"
                        onClick={() => toggleGoal(gStr)}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                      >
                        {isSelected ? <Check size={12} /> : null} {gStr}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM TRACKING FIELDS */}
          {activeSubTab === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Add Custom Symptom / Metric Field</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={newCustomField}
                    onChange={(e) => setNewCustomField(e.target.value)}
                    placeholder="e.g. Hair Thinning, Brain Fog..."
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={handleAddCustomField} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                    <Plus size={14} /> Add Field
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>Active Custom Fields ({customFields.length})</label>
                {customFields.map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                    <span>{f}</span>
                    <button type="button" onClick={() => handleRemoveCustomField(f)} className="btn btn-outline btn-icon" style={{ color: 'var(--accent-rose)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeSubTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { key: 'periodReminders', title: 'Period & Ovulation Reminders', desc: 'In-app notification 3 days prior to estimated period start date.' },
                { key: 'medicationAlerts', title: 'Medication & Supplement Reminders', desc: 'Daily alerts for prescribed dosage schedules.' },
                { key: 'dailyCheckIn', title: '30-Second Daily Check-in Prompt', desc: 'Evening prompt to record daily symptom severity.' },
                { key: 'hydrationAlerts', title: 'Hydration Target Alerts', desc: 'Mid-day reminder to reach your 2.5L daily water goal.' }
              ].map((nItem) => (
                <div key={nItem.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800' }}>{nItem.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{nItem.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[nItem.key] !== false}
                    onChange={(e) => setNotifications({ ...notifications, [nItem.key]: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {isSaved ? <Check size={16} /> : null} {isSaved ? 'Preferences Saved!' : 'Save All Preferences'}
            </button>
            <button type="button" onClick={handleExportData} className="btn btn-outline" style={{ gap: '0.4rem' }}>
              <Download size={16} /> Backup JSON
            </button>
          </div>

          {/* LOGOUT BUTTON */}
          <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
            <button
              type="button"
              onClick={() => { onClose(); onLogout(); }}
              className="btn btn-outline"
              style={{ width: '100%', color: 'var(--danger)', borderColor: 'var(--danger)', gap: '0.5rem' }}
            >
              <LogOut size={16} /> Logout & Reset Session
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
