import React from 'react';

/**
 * Displays success or error messages after submission.
 * @param {Object} props
 * @param {'success' | 'error'} props.type
 * @param {string} props.message
 */
const StatusMessage = ({ type, message }) => {
  const isSuccess = type === 'success';

  const containerStyle = {
    padding: '14px 18px',
    borderRadius: '10px',
    border: `1px solid ${isSuccess ? 'rgba(72, 187, 120, 0.3)' : 'rgba(245, 101, 101, 0.3)'}`,
    background: isSuccess ? 'rgba(72, 187, 120, 0.08)' : 'rgba(245, 101, 101, 0.08)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginTop: '8px',
  };

  const iconStyle = {
    fontSize: '18px',
    lineHeight: '1',
    flexShrink: 0,
    marginTop: '1px',
  };

  const textStyle = {
    color: isSuccess ? '#68d391' : '#fc8181',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: 0,
  };

  return (
    <div style={containerStyle} role="alert">
      <span style={iconStyle}>{isSuccess ? '✅' : '❌'}</span>
      <p style={textStyle}>{message}</p>
    </div>
  );
};

export default StatusMessage;
