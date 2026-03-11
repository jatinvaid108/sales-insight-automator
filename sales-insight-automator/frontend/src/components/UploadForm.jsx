import React, { useState, useRef } from 'react';

const ALLOWED_TYPES = [
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/**
 * Upload form with drag-and-drop support, file validation, and email input.
 *
 * @param {Object} props
 * @param {(file: File, email: string) => void} props.onSubmit
 * @param {boolean} props.isLoading
 */
const UploadForm = ({ onSubmit, isLoading }) => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const validateAndSetFile = (selectedFile) => {
    setFileError('');

    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      setFileError('Only CSV and XLSX files are supported.');
      return;
    }

    if (selectedFile.size > MAX_SIZE_BYTES) {
      setFileError(`File size must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !email || isLoading) return;
    onSubmit(file, email);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ─── Drop Zone ─────────────────────────────────────────────── */}
      <div
        style={{
          ...styles.dropZone,
          ...(dragActive ? styles.dropZoneActive : {}),
          ...(file ? styles.dropZoneSuccess : {}),
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isLoading}
        />

        {file ? (
          <div style={styles.filePreview}>
            <span style={styles.fileIcon}>
              {file.name.endsWith('.csv') ? '📄' : '📊'}
            </span>
            <div style={styles.fileInfo}>
              <span style={styles.fileName}>{file.name}</span>
              <span style={styles.fileSize}>{formatFileSize(file.size)}</span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
              style={styles.removeBtn}
              disabled={isLoading}
              title="Remove file"
            >
              ✕
            </button>
          </div>
        ) : (
          <div style={styles.dropContent}>
            <div style={styles.uploadIcon}>☁</div>
            <p style={styles.dropTitle}>
              {dragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}
            </p>
            <p style={styles.dropSubtitle}>CSV or XLSX · Max {MAX_SIZE_MB}MB</p>
          </div>
        )}
      </div>

      {fileError && (
        <p style={styles.fieldError}>⚠ {fileError}</p>
      )}

      {/* ─── Email Input ─────────────────────────────────────────────── */}
      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="email">
          Recipient Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          style={styles.input}
          onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, styles.input)}
          autoComplete="email"
        />
      </div>

      {/* ─── Submit Button ───────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={!file || !email || isLoading || !!fileError}
        style={{
          ...styles.submitBtn,
          ...(!file || !email || isLoading || !!fileError ? styles.submitBtnDisabled : {}),
        }}
      >
        {isLoading ? 'Processing…' : '✦ Generate & Send Summary'}
      </button>
    </form>
  );
};

const styles = {
  dropZone: {
    border: '1.5px dashed rgba(226, 185, 111, 0.3)',
    borderRadius: '12px',
    padding: '32px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'rgba(226, 185, 111, 0.03)',
    marginBottom: '8px',
  },
  dropZoneActive: {
    borderColor: '#e2b96f',
    background: 'rgba(226, 185, 111, 0.07)',
  },
  dropZoneSuccess: {
    borderStyle: 'solid',
    borderColor: 'rgba(104, 211, 145, 0.4)',
    background: 'rgba(104, 211, 145, 0.04)',
    cursor: 'default',
  },
  dropContent: {},
  uploadIcon: {
    fontSize: '36px',
    color: '#e2b96f',
    opacity: 0.6,
    lineHeight: 1,
    marginBottom: '10px',
  },
  dropTitle: {
    color: '#a0aec0',
    fontSize: '14px',
    margin: '0 0 4px',
    fontWeight: '500',
  },
  dropSubtitle: {
    color: '#4a5568',
    fontSize: '12px',
    margin: 0,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'left',
  },
  fileIcon: {
    fontSize: '28px',
    flexShrink: 0,
  },
  fileInfo: {
    flex: 1,
    overflow: 'hidden',
  },
  fileName: {
    display: 'block',
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  fileSize: {
    display: 'block',
    color: '#718096',
    fontSize: '12px',
    marginTop: '2px',
  },
  removeBtn: {
    background: 'rgba(245, 101, 101, 0.1)',
    border: '1px solid rgba(245, 101, 101, 0.2)',
    color: '#fc8181',
    borderRadius: '6px',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '12px',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
  fieldError: {
    color: '#fc8181',
    fontSize: '12px',
    margin: '4px 0 12px',
  },
  fieldGroup: {
    marginTop: '20px',
    marginBottom: '4px',
  },
  label: {
    display: 'block',
    color: '#718096',
    fontSize: '12px',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit',
  },
  inputFocus: {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(226, 185, 111, 0.4)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  submitBtn: {
    width: '100%',
    marginTop: '24px',
    padding: '14px',
    background: 'linear-gradient(135deg, #e2b96f 0%, #c9963c 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#1a1a2e',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.3px',
    transition: 'opacity 0.2s ease, transform 0.1s ease',
    fontFamily: 'inherit',
  },
  submitBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
};

export default UploadForm;
