import React, { useState } from 'react';
import { X, Bell, Pill, Droplets, Calendar, Moon, Check, Trash2 } from 'lucide-react';

export default function NotificationsDrawer({ isOpen, onClose, onNavigate, onOpenCheckIn }) {
  if (!isOpen) return null;

  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Supplement Reminder',
      message: 'Time for Evening Myo-Inositol (2000mg) + D-Chiro Inositol.',
      time: '10 mins ago',
      type: 'med',
      read: false,
      actionText: 'Mark Taken'
    },
    {
      id: 'n2',
      title: 'Hydration Target',
      message: 'You have logged 2.2L today. Just 300ml left for your 2.5L goal!',
      time: '1 hour ago',
      type: 'hydration',
      read: false,
      actionText: 'Log 300ml'
    },
    {
      id: 'n3',
      title: 'Upcoming Appointment',
      message: 'Consultation with Dr. Ananya Sen scheduled for Aug 28.',
      time: '3 hours ago',
      type: 'appointment',
      read: false,
      actionText: 'Prepare Brief'
    },
    {
      id: 'n4',
      title: 'Cortisol Wind-Down',
      message: 'Remember to practice 4-7-8 deep breathing before bedtime.',
      time: 'Yesterday',
      type: 'sleep',
      read: true,
      actionText: null
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleAction = (n) => {
    setNotifications(notifications.map((item) => item.id === n.id ? { ...item, read: true } : item));
    if (n.type === 'appointment') {
      onClose();
      onNavigate('appointment');
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '420px',
        height: '100vh',
        borderRadius: 'var(--radius-xl) 0 0 var(--radius-xl)',
        padding: '1.5rem',
        animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>In-App Reminders</h2>
            {unreadCount > 0 && (
              <span className="badge badge-secondary">{unreadCount} New</span>
            )}
          </div>
          <button onClick={onClose} className="btn btn-outline btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Action bar */}
        {unreadCount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
            <button onClick={handleMarkAllRead} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
              Mark All Read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <div key={n.id} style={{
              background: n.read ? 'var(--bg-input)' : 'var(--primary-light)',
              padding: '0.9rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${n.read ? 'var(--border-color)' : 'rgba(139, 92, 246, 0.3)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.875rem', color: n.read ? 'var(--text-main)' : 'var(--primary)' }}>
                  {n.title}
                </strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {n.message}
              </p>

              {n.actionText && (
                <button
                  onClick={() => handleAction(n)}
                  className={`btn ${n.read ? 'btn-outline' : 'btn-primary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', alignSelf: 'flex-start', marginTop: '0.25rem' }}
                >
                  <Check size={14} /> {n.actionText}
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
