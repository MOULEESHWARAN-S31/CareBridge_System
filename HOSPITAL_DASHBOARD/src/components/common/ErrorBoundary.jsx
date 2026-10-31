import { Component } from 'react';
import { Heart, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary — catches runtime JS errors and shows a friendly error UI.
 *
 * KEY FIX: Accepts a `resetKey` prop (typically the current pathname).
 * When resetKey changes (i.e. user navigates to a new route), the boundary
 * automatically resets — so a crash on one page never bleeds into others.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, lastResetKey: props.resetKey };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Auto-reset when the route changes (resetKey prop changes)
  static getDerivedStateFromProps(props, state) {
    if (state.hasError && props.resetKey !== state.lastResetKey) {
      return { hasError: false, error: null, errorInfo: null, lastResetKey: props.resetKey };
    }
    if (!state.hasError && props.resetKey !== state.lastResetKey) {
      return { lastResetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[CareConnect ErrorBoundary]', error, errorInfo?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '60vh', padding: 40,
          fontFamily: 'Inter, sans-serif',
        }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: '40px 48px',
            boxShadow: '0 20px 60px rgba(14,165,233,0.12)', maxWidth: 520,
            width: '100%', textAlign: 'center', border: '1px solid #FEE2E2',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(239,68,68,0.3)',
            }}>
              <Heart size={28} color="white" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              This page encountered an unexpected error.
              Navigate to another page using the sidebar, or click <strong>Try Again</strong> below.
            </p>
            {this.state.error && (
              <details style={{ marginBottom: 20, textAlign: 'left' }}>
                <summary style={{ fontSize: 12, color: '#94A3B8', cursor: 'pointer' }}>Technical details</summary>
                <pre style={{ fontSize: 11, color: '#EF4444', marginTop: 8, whiteSpace: 'pre-wrap', background: '#FEF2F2', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              style={{
                background: 'linear-gradient(135deg, #0EA5E9, #0D9488)', color: 'white',
                border: 'none', borderRadius: 12, padding: '12px 28px',
                fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
