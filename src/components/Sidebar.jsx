export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <button
        type="button"
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-label="Tutup menu navigasi"
        tabIndex={isOpen ? 0 : -1}
      />
      <aside className={`main-sidebar ${isOpen ? 'mobile-open' : ''}`} aria-label="Navigasi utama">
        <div className="sidebar-brand">
          <div className="brand-logo-container">
            <div className="brand-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="brand-text-column">
              <span className="brand-title">anteraja<span className="brand-dot" /></span>
              <span className="brand-subtitle">Hub Dwell Monitor</span>
            </div>
          </div>
          <button type="button" className="mobile-sidebar-close" onClick={onClose} aria-label="Tutup menu">
            ✕
          </button>
        </div>
        <div className="sidebar-simulation-pill">
          <div className="sim-pill-inner">
            <span className="sim-warning-icon" aria-hidden="true">●</span>
            <div className="sim-text-col">
              <span className="sim-title">Data simulasi</span>
              <span className="sim-desc">Latihan operasional</span>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav" aria-label="Halaman">
          <div className="sidebar-nav-item active" aria-current="page">
            <span className="nav-item-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </span>
            <span className="nav-item-label">Hub Dwell Monitor</span>
          </div>
        </nav>
      </aside>
    </>
  );
}
