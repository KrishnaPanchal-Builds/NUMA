import React from 'react';
import { Home, Calendar, Plus, LineChart, FolderHeart, Bot, Stethoscope } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onOpenQuickCheckIn }) {
  const primaryTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'track', label: 'Track', icon: Calendar },
    { id: 'insights', label: 'Insights', icon: LineChart },
    { id: 'pcosFile', label: 'My File', icon: FolderHeart },
    { id: 'ai', label: 'Ask AI', icon: Bot },
  ];

  return (
    <nav className="bottom-nav glass-card" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '68px',
      background: 'var(--bg-glass)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 0.5rem',
      zIndex: 120,
    }}>
      {primaryTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: isActive ? '700' : '500',
              flex: 1,
              height: '100%'
            }}
          >
            <Icon size={20} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
            <span>{tab.label}</span>
          </button>
        );
      })}

      {/* Floating Center Action Button */}
      <button
        onClick={onOpenQuickCheckIn}
        style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '50px',
          height: '50px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)',
          border: '3px solid var(--bg-app)'
        }}
        title="Quick 30-sec Check-in"
      >
        <Plus size={26} />
      </button>
    </nav>
  );
}
