import React from 'react';
import { Home, Calendar, LineChart, FolderHeart, Stethoscope, Bot, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, profile }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, badge: null },
    { id: 'track', label: 'Track & Timeline', icon: Calendar, badge: '24h Log' },
    { id: 'insights', label: 'Insights & Patterns', icon: LineChart, badge: 'AI' },
    { id: 'pcosFile', label: 'My PCOS File', icon: FolderHeart, badge: 'Labs' },
    { id: 'appointment', label: 'Appointment Prep', icon: Stethoscope, badge: '4-Step' },
    { id: 'ai', label: 'Ask NUMA AI', icon: Bot, badge: 'Records' },
    { id: 'learn', label: 'Education Centre', icon: BookOpen, badge: null },
  ];

  return (
    <aside className="sidebar" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '260px',
      height: '100vh',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 1rem',
      zIndex: 110,
    }}>
      <div>
        {/* Brand Logo & Tagline */}
        <div style={{
          padding: '0.5rem 0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            fontWeight: '800',
            fontSize: '1.4rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            N
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: '800',
              fontSize: '1.35rem',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              NUMA
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PCOS Health Companion
            </p>
          </div>
        </div>

        {/* Nav List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.9rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={19} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`badge ${isActive ? 'badge-primary' : 'badge-teal'}`} style={{ fontSize: '0.65rem' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Widget - Personal Health Story */}
      <div className="numa-card glass-card" style={{ padding: '1rem', background: 'var(--primary-light)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Sparkles size={16} color="var(--primary)" />
          <span style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--primary)' }}>
            Longitudinal Story
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          34-day cycle recorded. 92% supplement adherence.
        </p>
        <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--accent-mint)', fontWeight: '600' }}>
          <ShieldCheck size={14} />
          <span>Non-Diagnostic Safety Shield</span>
        </div>
      </div>
    </aside>
  );
}
