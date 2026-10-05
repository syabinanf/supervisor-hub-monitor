import React from 'react';

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-banner-card" role="alert">
      <div className="error-banner-content">
        <div className="error-banner-icon-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>
        <div className="error-banner-text">
          <h4 className="error-banner-title">Gagal memuat data hub</h4>
          <p className="error-banner-desc">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          className="error-banner-retry-btn"
          onClick={onRetry}
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
