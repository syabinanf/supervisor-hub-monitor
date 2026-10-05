import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="skeleton-container" aria-label="Memuat data simulasi...">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-subtitle" />
          <div className="skeleton-metrics-row">
            <div className="skeleton-box" />
            <div className="skeleton-box" />
            <div className="skeleton-box" />
          </div>
          <div className="skeleton-line skeleton-bar" />
        </div>
      ))}
    </div>
  );
}
