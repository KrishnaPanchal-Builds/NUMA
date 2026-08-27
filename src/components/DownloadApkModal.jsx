import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle, X, ShieldCheck, Sparkles, ExternalLink, HelpCircle, ArrowRight, Share2, PlusSquare } from 'lucide-react';

export default function DownloadApkModal({ isOpen, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState('android');

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
      // Fallback instruction
      alert("To install NUMA as an app on your phone:\n\n1. Tap the 3 dots (⋮) menu in Chrome/Edge.\n2. Tap 'Install App' or 'Add to Home Screen'.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 99999, background: 'rgba(5, 7, 13, 0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
              <Smartphone size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Download NUMA Android App</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Install NUMA as a native mobile application on your device</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-icon" style={{ borderRadius: 'var(--radius-full)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Highlight Banner */}
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(217,70,239,0.1) 0%, rgba(20,184,166,0.1) 100%)', border: '1px solid var(--primary)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            <strong style={{ fontSize: '0.95rem', color: 'var(--primary-dark)' }}>Native Android Experience (No App Store Required)</strong>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>
            NUMA uses WebAPK & Progressive Web App (PWA) technology to run directly on your smartphone with a full-screen home screen icon, offline tracking support, and instant loading!
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
          
          {/* Action 1: 1-Tap App Install */}
          <button
            onClick={handleInstallClick}
            className="btn btn-primary"
            style={{ padding: '0.9rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-lg)' }}
          >
            <Smartphone size={22} />
            <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>{isInstalled ? 'App Installed ✓' : '1-Tap Install App'}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>Chrome / Edge / Android</span>
          </button>

          {/* Action 2: Direct APK Download */}
          <a
            href="/numa-pcos-companion.apk"
            download="numa-pcos-companion.apk"
            className="btn btn-secondary"
            style={{ padding: '0.9rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-lg)', textDecoration: 'none' }}
          >
            <Download size={22} />
            <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>Download APK File</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>Direct .APK File (v1.0)</span>
          </a>

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
            <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem' }}>1</span>
                <span>Open <strong>https://numa-pi.vercel.app</strong> in Chrome or Edge on your phone.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem' }}>2</span>
                <span>Tap the <strong>3 dots (⋮)</strong> menu icon at the top right of your browser.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem' }}>3</span>
                <span>Select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.</span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem' }}>1</span>
                <span>Open <strong>https://numa-pi.vercel.app</strong> in <strong>Safari</strong> on your iPhone.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem' }}>2</span>
                <span>Tap the <strong>Share</strong> button <Share2 size={14} style={{ display: 'inline' }} /> at the bottom menu.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem' }}>3</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare size={14} style={{ display: 'inline' }} />.</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={14} color="var(--primary)" /> Secure WebAPK Mobile Installation • Safe & Verified Package
        </div>

      </div>
    </div>
  );
}
