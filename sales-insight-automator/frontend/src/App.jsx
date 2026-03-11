import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import Loader from './components/Loader';
import StatusMessage from './components/StatusMessage';
import { uploadSalesFile } from './services/api';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const handleSubmit = async (file, email) => {
    setIsLoading(true);
    setStatus(null);

    try {
      await uploadSalesFile(file, email);
      setStatus({
        type: 'success',
        message: `Your executive summary is on its way to ${email}! Check your inbox in a few moments.`,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.';
      setStatus({ type: 'error', message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={styles.page}>
        {/* ─── Background Decoration ─── */}
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />

        {/* ─── Main Card ─── */}
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.cardHeader}>
            <div style={styles.logoMark}>✦</div>
            <h1 style={styles.title}>Sales Insight Automator</h1>
            <p style={styles.subtitle}>
              Upload your quarterly sales data and receive an AI-generated
              executive summary directly in your inbox.
            </p>
          </div>

          {/* Pipeline Steps */}
          <div style={styles.pipeline}>
            {PIPELINE_STEPS.map((step, i) => (
              <div key={i} style={styles.pipelineStep}>
                <span style={styles.pipelineIcon}>{step.icon}</span>
                <span style={styles.pipelineLabel}>{step.label}</span>
                {i < PIPELINE_STEPS.length - 1 && (
                  <span style={styles.pipelineArrow}>→</span>
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Form / Loader / Status */}
          {isLoading ? (
            <Loader />
          ) : status?.type === 'success' ? (
            <div style={styles.successContainer}>
              <StatusMessage type="success" message={status.message} />
              <button
                style={styles.resetBtn}
                onClick={() => setStatus(null)}
              >
                Upload Another File
              </button>
            </div>
          ) : (
            <>
              <UploadForm onSubmit={handleSubmit} isLoading={isLoading} />
              {status && (
                <div style={{ marginTop: '16px' }}>
                  <StatusMessage type={status.type} message={status.message} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          Powered by <span style={styles.footerBrand}>Rabbitt AI</span>
          &nbsp;·&nbsp; Secured with Helmet + Rate Limiting
          &nbsp;·&nbsp; Groq Llama 3
        </p>
      </div>
    </>
  );
};

const PIPELINE_STEPS = [
  { icon: '📁', label: 'Upload' },
  { icon: '⚙️', label: 'Parse' },
  { icon: '🤖', label: 'AI Analysis' },
  { icon: '📧', label: 'Email' },
];

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    position: 'relative',
    overflow: 'hidden',
    background: '#0d1117',
  },
  bgOrb1: {
    position: 'fixed',
    top: '-160px',
    right: '-120px',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(226,185,111,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgOrb2: {
    position: 'fixed',
    bottom: '-200px',
    left: '-150px',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,179,237,0.04) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(22, 27, 34, 0.95)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '48px 44px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(12px)',
    position: 'relative',
    zIndex: 1,
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoMark: {
    fontSize: '28px',
    color: '#e2b96f',
    marginBottom: '12px',
    display: 'block',
    animation: 'pulse 3s ease-in-out infinite',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#f0f4f8',
    margin: '0 0 10px',
    letterSpacing: '-0.4px',
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  subtitle: {
    color: '#718096',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0,
    maxWidth: '360px',
    marginInline: 'auto',
  },
  pipeline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  pipelineStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  pipelineIcon: {
    fontSize: '14px',
  },
  pipelineLabel: {
    fontSize: '11px',
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  pipelineArrow: {
    color: 'rgba(226, 185, 111, 0.3)',
    fontSize: '12px',
    marginLeft: '4px',
    marginRight: '2px',
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.05)',
    marginBottom: '28px',
  },
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  resetBtn: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: '1px solid rgba(226, 185, 111, 0.3)',
    borderRadius: '10px',
    color: '#e2b96f',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  footer: {
    marginTop: '24px',
    color: '#2d3748',
    fontSize: '11px',
    textAlign: 'center',
    letterSpacing: '0.3px',
    position: 'relative',
    zIndex: 1,
  },
  footerBrand: {
    color: '#4a5568',
    fontWeight: '600',
  },
};

const globalStyles = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #0d1117;
    -webkit-font-smoothing: antialiased;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.08); }
  }
  input::placeholder { color: #4a5568; }
  input[type="email"]::-webkit-input-placeholder { color: #4a5568; }
`;

export default App;
