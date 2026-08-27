import React, { useState } from 'react';
import { Home, Calendar, Activity, FileText, Stethoscope, Bot, BookOpen, Sun, Moon, Plus, Heart, Bell, LogOut, Brain, Sparkles, Pill, Utensils, FileCheck, Lock, Smartphone, MoreHorizontal, X } from 'lucide-react';
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
  const [showMobileMore, setShowMobileMore] = useState(false);
  const userInitials = getUserInitials(profile.name);

  // Modular Active Tracking Feature Preferences
  const activeTracking = profile.activeTracking || {
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

  // Primary 5 Mobile Tabs
  const primaryMobileTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'track', label: 'Track', icon: Calendar },
    { id: 'insights', label: 'Insights', icon: Activity },
    { id: 'pcosFile', label: 'My File', icon: FileText },
    { id: 'ai', label: 'NUMA AI', icon: Bot },
  ];

  return (
    <>
      <header className="numa-header glass-card" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border-color)',
        padding: '0.75rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-md)'
      }}>
        
        {/* Row 1: Brand Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          
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
              boxShadow: 'var(--shadow-glow)'
            }}>
              N
            </div>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: '800', lineHeight: 1.1 }}>NUMA Health</h1>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Day {profile.currentCycleDay || 14} • {profile.currentPhase || 'Follicular'}
              </p>
            </div>
          </div>

          {/* Right Desktop Actions (Hidden on small mobile screens) */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            
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

          {/* Mobile Right Bar Actions (Clean & Uncluttered) */}
          <div className="hide-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button onClick={onOpenQuickCheckIn} className="btn btn-primary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', gap: '0.2rem' }}>
              <Plus size={14} /> Log
            </button>

            <button onClick={onOpenNotifications} className="btn btn-outline btn-icon" style={{ width: '34px', height: '34px', position: 'relative' }}>
              <Bell size={15} />
            </button>

            <button onClick={() => setShowMobileMore(true)} className="btn btn-outline btn-icon" style={{ width: '34px', height: '34px' }}>
              <MoreHorizontal size={16} />
            </button>

            <button onClick={onOpenSettings} style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '800', fontSize: '0.75rem', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {userInitials}
            </button>
          </div>

        </div>

        {/* Row 2: Desktop Top Navbar (Hidden on Mobile, replaced by Bottom Tab Bar) */}
        <nav className="hide-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          overflowX: 'auto',
          padding: '0.25rem 0',
          borderTop: '1px solid var(--border-color)',
          scrollbarWidth: 'thin'
        }}>
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

      {/* NATIVE MOBILE BOTTOM NAVIGATION BAR (FIXED ON SMARTPHONES) */}
      <nav className="mobile-bottom-nav hide-desktop" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0.4rem 0.25rem',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)'
      }}>
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
                gap: '0.2rem',
                flex: 1,
                padding: '0.3rem 0',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.7rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                padding: '0.3rem 0.8rem',
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

        {/* More Tools Menu Trigger */}
        <button
          onClick={() => setShowMobileMore(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            flex: 1,
            padding: '0.3rem 0',
            color: 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.7rem'
          }}
        >
          <div style={{ padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)' }}>
            <MoreHorizontal size={18} />
          </div>
          <span>More</span>
        </button>
      </nav>

      {/* MOBILE MORE TOOLS DRAWER POPUP */}
      {showMobileMore && (
        <div className="modal-overlay" onClick={() => setShowMobileMore(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>NUMA Health Tools</h3>
              <button onClick={() => setShowMobileMore(false)} className="btn btn-outline btn-icon" style={{ width: '32px', height: '32px' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <button onClick={() => { setActiveTab('sleep'); setShowMobileMore(false); }} className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.65rem' }}>
                <Moon size={16} color="var(--primary)" /> Sleep Track
              </button>

              <button onClick={() => { setActiveTab('mental'); setShowMobileMore(false); }} className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.65rem' }}>
                <Brain size={16} color="var(--secondary)" /> Mental Well-Being
              </button>

              <button onClick={() => { setActiveTab('nutrition'); setShowMobileMore(false); }} className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.65rem' }}>
                <Utensils size={16} color="var(--accent-mint)" /> AI Nutrition
              </button>

              <button onClick={() => { setActiveTab('meds'); setShowMobileMore(false); }} className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.65rem' }}>
                <Pill size={16} color="var(--accent-amber)" /> Meds & Supplements
              </button>

              <button onClick={() => { setActiveTab('appointment'); setShowMobileMore(false); }} className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.65rem' }}>
                <Stethoscope size={16} color="var(--accent-teal)" /> Appointment Prep
              </button>

              <button onClick={() => { setActiveTab('learn'); setShowMobileMore(false); }} className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.65rem' }}>
                <BookOpen size={16} color="var(--primary)" /> Learn Hub
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button onClick={() => { onOpenDownloadApk(); setShowMobileMore(false); }} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
                <Smartphone size={16} /> 📱 Download Android App (APK)
              </button>

              <button onClick={() => { onOpenPrivacy(); setShowMobileMore(false); }} className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>
                <Lock size={16} color="var(--primary)" /> 🔒 Privacy & Stealth Mode
              </button>

              <button onClick={() => { onOpenHealthSummary(); setShowMobileMore(false); }} className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>
                <FileCheck size={16} color="var(--primary)" /> 📄 Health Summary Report
              </button>

              <button onClick={() => { toggleTheme(); setShowMobileMore(false); }} className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} color="#FBBF24" />} Switch Theme ({theme === 'light' ? 'Dark' : 'Light'})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
