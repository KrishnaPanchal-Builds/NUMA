import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, X, ShieldCheck, Sparkles, ExternalLink, HelpCircle, ArrowRight, Share2, PlusSquare, Check } from 'lucide-react';

export default function DownloadApkModal({ isOpen, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState('android');
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  // Trigger Native WebAPK / PWA 1-Tap Install
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowManualGuide(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 99999, background: 'rgba(5, 7, 13, 0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
              <Smartphone size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Install NUMA Mobile App</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Install NUMA directly on your phone's Home Screen</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-icon" style={{ borderRadius: 'var(--radius-full)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Highlight Banner */}
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(217,70,239,0.12) 0%, rgba(20,184,166,0.12) 100%)', border: '1px solid var(--primary)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            <strong style={{ fontSize: '0.95rem', color: 'var(--primary-dark)' }}>Native Android WebAPK Installation</strong>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>
            NUMA installs as a real native app directly from Chrome/Safari without needing raw APK downloads or the Play Store. It adds an app icon to your phone screen and loads instantly!
          </p>
        </div>

        {/* Primary Action Button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={handleInstallClick}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1.1rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', borderRadius: 'var(--radius-lg)', fontSize: '1.05rem', fontWeight: '800' }}
          >
            <Smartphone size={24} />
            <span>{isInstalled ? 'NUMA App Installed ✓' : '📱 1-Tap Install NUMA App on Phone'}</span>
          </button>
        </div>

        {/* Step-by-Step Installation Tabs */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '0.85rem' }}>
            <button
              onClick={() => setActiveTab('android')}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'android' ? '2px solid var(--primary)' : 'none',
                color: activeTab === 'android' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              📱 Android (Chrome / Edge)
            </button>

            <button
              onClick={() => setActiveTab('ios')}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'ios' ? '2px solid var(--secondary)' : 'none',
                color: activeTab === 'ios' ? 'var(--secondary)' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              🍎 iPhone / iPad (Safari)
            </button>
          </div>

          {activeTab === 'android' ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem', flexShrink: 0 }}>1</span>
                <span>Open <strong>https://numa-pi.vercel.app</strong> in Chrome on your Android phone.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem', flexShrink: 0 }}>2</span>
                <span>Tap the <strong>3 dots (⋮)</strong> menu icon in top-right corner of Chrome.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem', flexShrink: 0 }}>3</span>
                <span>Tap <strong>"Install App"</strong> (or <em>"Add to Home screen"</em>). Done! 🎉</span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--secondary)', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem', flexShrink: 0 }}>1</span>
                <span>Open <strong>https://numa-pi.vercel.app</strong> in <strong>Safari</strong> on your iPhone.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--secondary)', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem', flexShrink: 0 }}>2</span>
                <span>Tap the <strong>Share</strong> icon <Share2 size={14} style={{ display: 'inline' }} /> at bottom menu bar.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--secondary)', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem', flexShrink: 0 }}>3</span>
                <span>Tap <strong>"Add to Home Screen"</strong> <PlusSquare size={14} style={{ display: 'inline' }} />. Done! 🎉</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={14} color="var(--primary)" /> Secure WebAPK Mobile Installation • No Unknown APK Errors
        </div>

      </div>
    </div>
  );
}
