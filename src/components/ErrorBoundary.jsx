import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NUMA React ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-main, #0B0F17)',
          color: 'var(--text-main, #F3F4F6)',
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            background: 'var(--bg-card, #131A29)',
            border: '1px solid var(--border-color, #222F43)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <AlertCircle size={32} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Something went wrong
            </h2>
            
            <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '1.5rem' }}>
              NUMA caught an unexpected state error. Don't worry, your logged health data is safe in persistent storage.
            </p>

            <div style={{
              background: '#05070D',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#F87171',
              fontFamily: 'monospace',
              textAlign: 'left',
              marginBottom: '1.5rem',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {this.state.error ? this.state.error.toString() : 'Unknown state error'}
            </div>

            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                color: '#FFF',
                fontWeight: '700',
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <RefreshCw size={18} /> Refresh App & Recover Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
