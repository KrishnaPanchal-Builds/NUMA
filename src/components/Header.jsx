import React, { useState } from 'react';
import { Home, Calendar, Activity, FileText, Stethoscope, Bot, BookOpen, Sun, Moon, Plus, Heart, Bell, LogOut, Brain, Sparkles, Pill, Utensils, FileCheck, Lock, Smartphone, Menu, X, ChevronRight } from 'lucide-react';
import { getUserInitials } from '../utils/numaStorage';

export default function Header({
  theme,
  toggleTheme,
  activeTab,
  setActiveTab,
  onOpenQuickCheckIn,
  onOpenBreathing,
  onOpenMeditation,
  onOpenHealthSummary,
  onOpenPrivacy,
  onOpenDownloadApk,
  onOpenSettings,
  onOpenNotifications,
  onLogout,
  profile
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const safeProfile = profile || {};
  const userInitials = getUserInitials(safeProfile.name || 'User');

  // Modular Active Tracking Feature Preferences
  const activeTracking = safeProfile.activeTracking || {
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

  const allNavTabs = [
    { id: 'home', label: 'Home', icon: Home, enabled: true },
    { id: 'track', label: 'Track & Calendar', icon: Calendar, enabled: activeTracking.track !== false },
    { id: 'sleep', label: 'Sleep Track', icon: Moon, enabled: activeTracking.sleep !== false },
    { id: 'mental', label: 'Mental Well-Being', icon: Brain, enabled: activeTracking.mental !== false },
    { id: 'nutrition', label: 'AI Nutrition & Meals', icon: Utensils, enabled: activeTracking.nutrition !== false },
    { id: 'meds', label: 'Meds & Supplements', icon: Pill, enabled: activeTracking.meds !== false },
    { id: 'insights', label: 'Insights', icon: Activity, enabled: true },
    { id: 'pcosFile', label: 'My PCOS File', icon: FileText, enabled: activeTracking.pcosFile !== false },
    { id: 'appointment', label: 'Appointment Prep', icon: Stethoscope, enabled: activeTracking.appointment !== false },
    { id: 'ai', label: 'Ask NUMA AI', icon: Bot, enabled: activeTracking.ai !== false },
    { id: 'learn', label: 'Learn Hub', icon: BookOpen, enabled: activeTracking.learn !== false },
  ];

  const visibleNavTabs = allNavTabs.filter((t) => t.enabled);

  // Primary 5 Mobile Bottom Tabs
  const primaryMobileTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'track', label: 'Track', icon: Calendar },
    { id: 'insights', label: 'Patterns', icon: Activity },
    { id: 'pcosFile', label: 'My File', icon: FileText },
    { id: 'ai', label: 'NUMA AI', icon: Bot },
  ];

  return (
    <>
      <header className="numa-header glass-card">
        
        {/* Row 1: Single Clean Header Bar */}
        <div className="header-top-row">
          
          {/* Left Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              fontWeight: '800',
              fontSize: '1.15rem',
              boxShadow: 'var(--shadow-glow)',
              flexShrink: 0
            }}>
              N
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h1 style={{ fontSize: '1.05rem', fontWeight: '800', lineHeight: 1.1 }}>NUMA</h1>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                  Day {safeProfile.currentCycleDay || 14}
                </span>
              </div>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>
                {safeProfile.currentPhase || 'Follicular Phase'}
              </p>
            </div>
          </div>

          {/* Desktop Right Action Buttons */}
          <div className="desktop-actions hide-mobile">
            <button onClick={onOpenDownloadApk} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>
              <Smartphone size={14} /> 📱 App (APK)
            </button>

            <button onClick={onOpenPrivacy} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', borderColor: 'var(--primary)' }}>
              <Lock size={14} color="var(--primary)" /> 🔒 Privacy
            </button>

            <button onClick={onOpenHealthSummary} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>
              <FileCheck size={14} color="var(--primary)" /> 📄 Health Summary
            </button>

            <button onClick={onOpenBreathing} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>
              <Heart size={14} color="var(--secondary)" /> 🫁 4-7-8 Calm
            </button>

            <button onClick={onOpenMeditation} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>
              <Sparkles size={14} color="var(--primary)" /> 🧘 Meditation
            </button>

            <button onClick={onOpenQuickCheckIn} className="btn btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
              <Plus size={15} /> + Log Event
            </button>

            <button onClick={onOpenNotifications} className="btn btn-outline btn-icon" style={{ position: 'relative' }}>
              <Bell size={16} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '15px', height: '15px', borderRadius: '50%', background: 'var(--secondary)', color: '#FFF', fontSize: '0.55rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            </button>

            <button onClick={toggleTheme} className="btn btn-outline btn-icon">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} color="#FBBF24" />}
            </button>

            <button onClick={onOpenSettings} style={{ height: '32px', padding: '0 0.6rem', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '800', fontSize: '0.75rem', border: '2px solid var(--primary)' }}>
              {userInitials}
            </button>

            <button onClick={onLogout} className="btn btn-outline btn-icon" style={{ color: 'var(--danger)' }}>
              <LogOut size={14} />
            </button>
          </div>

          {/* Mobile Compact Right Bar Actions */}
          <div className="mobile-actions hide-desktop">
            <button onClick={onOpenQuickCheckIn} className="btn btn-primary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', gap: '0.25rem', borderRadius: 'var(--radius-full)' }}>
              <Plus size={14} /> Log
            </button>

            <button onClick={onOpenNotifications} className="btn btn-outline btn-icon" style={{ width: '34px', height: '34px', position: 'relative' }}>
              <Bell size={15} />
            </button>

            <button onClick={() => setShowMobileMenu(true)} className="btn btn-secondary btn-icon" style={{ width: '34px', height: '34px' }}>
              <Menu size={18} />
            </button>
          </div>

        </div>

        {/* Desktop Top Navbar (Hidden on Mobile) */}
        <nav className="desktop-nav hide-mobile">
          {visibleNavTabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  fontSize: '0.825rem',
                  fontWeight: isActive ? '800' : '600',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                  background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'var(--bg-input)',
                  color: isActive ? '#FFF' : 'var(--text-main)',
                  border: isActive ? 'none' : '1px solid var(--border-color)'
                }}
              >
                <IconComp size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </header>

      {/* NATIVE MOBILE BOTTOM NAVIGATION TAB BAR */}
      <nav className="mobile-bottom-nav hide-desktop">
        {primaryMobileTabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.15rem',
                flex: 1,
                padding: '0.25rem 0',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.68rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconComp size={18} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setShowMobileMenu(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.15rem',
            flex: 1,
            padding: '0.25rem 0',
            color: 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.68rem'
          }}
        >
          <div style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
            <Menu size={18} />
          </div>
          <span>Menu</span>
        </button>
      </nav>

      {/* FULL MOBILE HEALTH HUB DRAWER MODAL */}
      {showMobileMenu && (
        <div className="modal-overlay" onClick={() => setShowMobileMenu(false)} style={{ zIndex: 99999 }}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  {userInitials}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{safeProfile.name || 'Krishna'}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>NUMA Health Hub Navigation</p>
                </div>
              </div>
              <button onClick={() => setShowMobileMenu(false)} className="btn btn-outline btn-icon" style={{ borderRadius: '50%' }}>
                <X size={16} />
              </button>
            </div>

            {/* Section 1: All App Views */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="badge badge-primary" style={{ marginBottom: '0.6rem', fontSize: '0.68rem' }}>EXPLORE NUMA VIEWS</span>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {visibleNavTabs.map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowMobileMenu(false);
                      }}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'var(--bg-input)',
                        color: isActive ? '#FFF' : 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        fontWeight: isActive ? '800' : '600',
                        border: '1px solid var(--border-color)',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <IconComp size={16} color={isActive ? '#FFF' : 'var(--primary)'} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tab.label}</span>
                      </div>
                      <ChevronRight size={14} opacity={0.6} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Quick Tools & Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="badge badge-secondary" style={{ marginBottom: '0.2rem', fontSize: '0.68rem' }}>QUICK WELLNESS & PRIVACY TOOLS</span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <button onClick={() => { onOpenBreathing(); setShowMobileMenu(false); }} className="btn btn-outline" style={{ fontSize: '0.78rem', justifyContent: 'flex-start', padding: '0.55rem 0.75rem' }}>
                  <Heart size={15} color="var(--secondary)" /> 🫁 4-7-8 Calm
                </button>

                <button onClick={() => { onOpenMeditation(); setShowMobileMenu(false); }} className="btn btn-outline" style={{ fontSize: '0.78rem', justifyContent: 'flex-start', padding: '0.55rem 0.75rem' }}>
                  <Sparkles size={15} color="var(--primary)" /> 🧘 Meditation
                </button>
              </div>

              <button onClick={() => { onOpenDownloadApk(); setShowMobileMenu(false); }} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.825rem' }}>
                <Smartphone size={16} /> 📱 Install Android App (APK)
              </button>

              <button onClick={() => { onOpenPrivacy(); setShowMobileMenu(false); }} className="btn btn-outline" style={{ width: '100%', fontSize: '0.825rem' }}>
                <Lock size={16} color="var(--primary)" /> 🔒 Privacy & Stealth Mode
              </button>

              <button onClick={() => { onOpenHealthSummary(); setShowMobileMenu(false); }} className="btn btn-outline" style={{ width: '100%', fontSize: '0.825rem' }}>
                <FileCheck size={16} color="var(--primary)" /> 📄 Health Summary Report
              </button>

              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem' }}>
                <button onClick={() => { toggleTheme(); setShowMobileMenu(false); }} className="btn btn-outline" style={{ flex: 1, fontSize: '0.78rem' }}>
                  {theme === 'light' ? <Moon size={15} /> : <Sun size={15} color="#FBBF24" />} Theme ({theme === 'light' ? 'Dark' : 'Light'})
                </button>

                <button onClick={() => { onOpenSettings(); setShowMobileMenu(false); }} className="btn btn-outline" style={{ flex: 1, fontSize: '0.78rem' }}>
                  Account Settings
                </button>
              </div>

              <button onClick={() => { onLogout(); setShowMobileMenu(false); }} className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.4rem', borderColor: 'var(--danger-light)' }}>
                <LogOut size={15} /> Logout Session
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
