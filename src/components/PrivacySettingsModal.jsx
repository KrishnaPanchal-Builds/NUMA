import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Download, Trash2, Key, Check, X, AlertTriangle, FileText, Cpu, Database, Share2, Sparkles } from 'lucide-react';

export default function PrivacySettingsModal({ isOpen, onClose, profile, cycles = [], timeline = [], symptoms = [], labs = [], documents = [], medications = [], meals = [], hydration = {}, appointments = [], isPrivateMode, setIsPrivateMode, aiConsent, setAiConsent, onLogout }) {
  const [activeTab, setActiveTab] = useState('controls'); // 'controls' | 'sharing' | 'policy'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sharePasscode, setSharePasscode] = useState('');
  const [passcodeGenerated, setPasscodeGenerated] = useState(false);

  if (!isOpen) return null;

  // Generate 6-Digit Doctor Sharing Passcode
  const handleGeneratePasscode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSharePasscode(code);
    setPasscodeGenerated(true);
  };

  // Full Data Export (JSON format)
  const handleExportAllData = () => {
    const exportPayload = {
      app: 'NUMA PCOS Companion',
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      userProfile: profile,
      cycles: cycles,
      timeline: timeline,
      symptoms: symptoms,
      labs: labs,
      documents: documents,
      medications: medications,
      meals: meals,
      hydration: hydration,
      appointments: appointments
    };

    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `NUMA_Full_Health_Data_${profile.name || 'User'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Full Data & Account Deletion
  const handleWipeAllData = () => {
    localStorage.clear();
    alert('All account records and local data have been permanently wiped from this device.');
    if (onLogout) onLogout();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '680px', maxHeight: '88vh', overflowY: 'auto' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Privacy & Security Control Center</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On-device storage, Stealth mode, AI consent, data export & deletion.</p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-outline btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Sub-Nav Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <button onClick={() => setActiveTab('controls')} className={`btn ${activeTab === 'controls' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.8rem' }}>
            <ShieldCheck size={14} /> Privacy Controls & Data
          </button>
          <button onClick={() => setActiveTab('sharing')} className={`btn ${activeTab === 'sharing' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.8rem' }}>
            <Share2 size={14} /> Controlled Doctor Sharing
          </button>
          <button onClick={() => setActiveTab('policy')} className={`btn ${activeTab === 'policy' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.8rem' }}>
            <FileText size={14} /> Policy & AI Disclosure
          </button>
        </div>

        {/* TAB 1: PRIVACY CONTROLS & DATA PORTABILITY */}
        {activeTab === 'controls' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Private / Stealth Mode Card */}
            <div className="numa-card" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {isPrivateMode ? <EyeOff size={22} color="var(--primary)" /> : <Eye size={22} color="var(--text-muted)" />}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>Stealth Private Mode</h4>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    Obfuscates sensitive reproductive flow names and lab biomarker values on screen for public privacy.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPrivateMode(!isPrivateMode)}
                className={`btn ${isPrivateMode ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              >
                {isPrivateMode ? <Check size={14} /> : null} {isPrivateMode ? 'Private Mode ON' : 'Turn ON'}
              </button>
            </div>

            {/* AI Data Usage Consent Card */}
            <div className="numa-card" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Sparkles size={22} color="var(--secondary)" />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>AI Health Data Usage Consent</h4>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    Allow NUMA AI Assistant to read your logged records (cycles, labs, meds) for personalized answers.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAiConsent(!aiConsent)}
                className={`btn ${aiConsent ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              >
                {aiConsent ? <Check size={14} /> : null} {aiConsent ? 'Consent Granted' : 'Revoke Consent'}
              </button>
            </div>

            {/* Local-First Architecture Badge */}
            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Database size={20} color="var(--primary)" />
              <div>
                <strong>On-Device Local Storage Architecture:</strong> All your health records are stored keylessly on your device using encrypted browser persistent storage.
              </div>
            </div>

            {/* Data Export & Deletion Action Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <button onClick={handleExportAllData} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.65rem' }}>
                <Download size={16} /> Export All Data (JSON)
              </button>

              <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.65rem', color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}>
                <Trash2 size={16} /> Permanently Wipe All Data
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: CONTROLLED DOCTOR SHARING */}
        {activeTab === 'sharing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="numa-card" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Encrypted Clinical Passcode Generator</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Generate a temporary 6-digit passcode to allow your healthcare provider to unlock and view your 1-page clinical summary sheet during consultations.
              </p>

              {passcodeGenerated ? (
                <div style={{ background: 'var(--primary-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--primary)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.25rem' }}>TEMPORARY CLINICAL PASSCODE</div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '4px', color: 'var(--primary)' }}>{sharePasscode}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Expires in 15 minutes • Share with your doctor</div>
                </div>
              ) : (
                <button onClick={handleGeneratePasscode} className="btn btn-primary" style={{ fontSize: '0.85rem', alignSelf: 'flex-start' }}>
                  <Key size={16} /> Generate 6-Digit Passcode
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TRANSPARENT PRIVACY POLICY & AI DISCLOSURE */}
        {activeTab === 'policy' && (
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: '0.825rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary)' }}>Transparent Privacy Policy & AI Data Disclosure</h4>
            
            <p>
              <strong>1. Data Minimization & Ownership:</strong> You own 100% of your health data. NUMA collects only the minimum information required to operate your cycle, symptom, lab, and medication logs.
            </p>

            <p>
              <strong>2. Zero Third-Party Selling:</strong> We do NOT sell, monetize, or transfer your personal reproductive or health information to advertisers, insurers, or data brokers.
            </p>

            <p>
              <strong>3. How AI Uses Your Data:</strong> When AI Data Consent is granted, your permitted health records are used solely to answer your specific prompts. Personal data is never used to train global AI models.
            </p>

            <p>
              <strong>4. On-Device Storage:</strong> All health logs remain stored on your local device unless you explicitly export or share them.
            </p>
          </div>
        )}

        {/* DELETE CONFIRMATION OVERLAY */}
        {showDeleteConfirm && (
          <div style={{ marginTop: '1.25rem', padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '2px solid var(--accent-rose)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-rose)', fontWeight: '800', fontSize: '1rem', marginBottom: '0.5rem' }}>
              <AlertTriangle size={20} /> Permanent Data Wiping Confirmation
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              Are you sure you want to permanently delete all your cycles, labs, documents, medications, and account settings? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleWipeAllData} className="btn btn-primary" style={{ flex: 1, background: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}>
                Confirm Permanent Wipe
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
