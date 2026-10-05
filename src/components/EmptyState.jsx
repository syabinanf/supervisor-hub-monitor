import React from 'react';

export default function EmptyState({ onReset }) {
  return (
    <div className="empty-state-card" aria-label="Tidak ada hub yang sesuai kriteria">
      <div className="empty-state-icon-box">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      </div>
      <h5 className="empty-state-title">Tidak ada hub yang sesuai kriteria</h5>
      <p className="empty-state-desc">
        Coba sesuaikan kata kunci pencarian atau ubah filter tab ke status &apos;Semua Hub&apos;.
      </p>
      {onReset && (
        <button
          type="button"
          className="empty-state-reset-btn"
          onClick={onReset}
        >
          Reset Pencarian
        </button>
      )}
    </div>
  );
}
