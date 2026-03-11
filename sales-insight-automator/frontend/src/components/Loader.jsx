import React from 'react';

const Loader = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner} />
      <p style={styles.text}>Analyzing your data & generating summary…</p>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '24px 0',
  },
  spinner: {
    width: '44px',
    height: '44px',
    border: '3px solid rgba(226, 185, 111, 0.15)',
    borderTop: '3px solid #e2b96f',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  text: {
    color: '#a0aec0',
    fontSize: '14px',
    margin: 0,
    letterSpacing: '0.3px',
  },
};

export default Loader;
