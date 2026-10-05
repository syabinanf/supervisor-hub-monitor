export default function Header({ onToggleSidebar }) {
  return (
    <div className="top-header-wrapper">
      <header className="main-top-header">
        <div className="header-left">
          <button
            type="button"
            className="hamburger-btn"
            onClick={onToggleSidebar}
            aria-label="Buka menu navigasi"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <div className="header-title-box">
            <span className="header-title">Anteraja Hub Dwell Monitor</span>
            <span className="header-separator-dot" />
            <span className="header-subtitle">Pemantauan operasional</span>
          </div>
        </div>
        <div className="header-right">
          <span className="header-data-label">Dataset latihan</span>
        </div>
      </header>
      <div className="simulation-banner">
        <div className="sim-banner-left">
          <span className="sim-banner-icon" aria-hidden="true">●</span>
          <p className="sim-banner-text">
            <strong>Data simulasi</strong> — Data ini digunakan untuk latihan pemantauan hub.
          </p>
        </div>
        <div className="sim-banner-chip">
          <span className="sim-chip-pulse" />
          <span className="sim-chip-label">Mode simulasi</span>
        </div>
      </div>
      <div className="priority-rule-banner">
        <div className="priority-rule-left">
          <svg className="rule-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span className="rule-text">
            <strong className="rule-highlight">Aturan prioritas latihan:</strong> mean dwell ≥ 6,00 jam. Bukan SLA resmi.
          </span>
        </div>
      </div>
    </div>
  );
}
