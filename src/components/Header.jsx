import React from 'react';
import { Home, Calendar, Activity, FileText, Stethoscope, Bot, BookOpen, Sun, Moon, Plus, Heart, Bell, LogOut, Brain, Sparkles, Pill, Utensils, FileCheck, Lock } from 'lucide-react';
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
  onOpenSettings,
  onOpenNotifications,
  onLogout,
  profile
}) {
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

  return (
    <header className="numa-header glass-card" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
      background: 'var(--bg-card)',
      boxShadow: 'var(--shadow-md)'
    }}>
      
      {/* Row 1: Brand, Privacy, Health Summary, Quick Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Left Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            fontWeight: '800',
            fontSize: '1.25rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            N
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: '800', lineHeight: 1.1 }}>NUMA PCOS Companion</h1>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Day {profile.currentCycleDay || 14} • {profile.currentPhase || 'Follicular Phase'}
            </p>
          </div>
        </div>

        {/* Right Action Icons & Voice Breathing + Meditation Quick Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          {/* Privacy & Security Button */}
          <button
            onClick={onOpenPrivacy}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'var(--primary)' }}
            title="Privacy Controls, Stealth Mode & Data Export"
          >
            <Lock size={15} color="var(--primary)" />
            <span>🔒 Privacy</span>
          </button>

          {/* Generate My Health Summary Button */}
          <button
            onClick={onOpenHealthSummary}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'var(--primary)' }}
            title="Generate My Personal Health Summary Document"
          >
            <FileCheck size={15} color="var(--primary)" />
            <span>📄 Health Summary</span>
          </button>

          {/* Audio Voice 4-7-8 Breathing Button */}
          <button
            onClick={onOpenBreathing}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'var(--secondary)' }}
            title="Start Audio Voice-Guided 4-7-8 Breathing Exercise"
          >
            <Heart size={15} color="var(--secondary)" />
            <span>🫁 4-7-8 Calm</span>
          </button>

          {/* Quick Voice Meditation Button */}
          <button
            onClick={onOpenMeditation}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'var(--primary)' }}
            title="Start Female Voice-Guided Meditation Affirmations"
          >
            <Sparkles size={15} color="var(--primary)" />
            <span>🧘 Meditation</span>
          </button>

          {/* Quick Log Button */}
          <button
            onClick={onOpenQuickCheckIn}
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', gap: '0.35rem' }}
            title="Open 30-Second Quick Log"
          >
            <Plus size={16} />
            <span>+ Log Event</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="btn btn-outline btn-icon"
            style={{ position: 'relative' }}
            title="Notifications & Reminders"
          >
            <Bell size={17} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '16px',
              height: '16px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--secondary)',
              color: '#FFF',
              fontSize: '0.6rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              3
            </span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="btn btn-outline btn-icon"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} color="#FBBF24" />}
          </button>

          {/* User Initials Avatar */}
          <button
            onClick={onOpenSettings}
            style={{
              height: '34px',
              padding: '0 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '0.8rem',
              border: '2px solid var(--primary)',
              gap: '0.3rem'
            }}
            title={`Account Settings & Custom Tracking: ${profile.name}`}
          >
            <span>{userInitials}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="btn btn-outline btn-icon"
            style={{ color: 'var(--danger)', borderColor: 'var(--border-color)' }}
            title="Logout & Clear Active Session"
          >
            <LogOut size={15} />
          </button>

        </div>

      </div>

      {/* Row 2: PROMINENT TOP NAVBAR WITH USER-SELECTED ACTIVE TRACKING TABS */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        padding: '0.35rem 0',
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
                fontSize: '0.85rem',
                fontWeight: isActive ? '800' : '600',
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'var(--bg-input)',
                color: isActive ? '#FFF' : 'var(--text-main)',
                border: isActive ? 'none' : '1px solid var(--border-color)'
              }}
            >
              <IconComp size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </header>
  );
}
