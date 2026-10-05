import { formatDwell, formatNumber } from '../utils/dataLoader';

export default function HubDetail({ hub, onClose, onFocusMap }) {
  if (!hub) return null;

  return (
    <section className="hub-detail-panel" aria-label={`Detail ${hub.hub_name}`}>
      <div className="detail-panel-header">
        <div className="detail-header-left">
          <svg className="detail-header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <h2 className="detail-panel-title">Detail hub</h2>
        </div>
        <button type="button" className="detail-close-btn" onClick={onClose} aria-label="Tutup detail hub">
          ✕
        </button>
      </div>
      <div className="detail-main-info">
        <div className="detail-title-group">
          <span className="detail-hub-id-chip">{hub.hub_id}</span>
          <h3 className="detail-hub-name">{hub.hub_name}</h3>
        </div>
        <span className={`detail-priority-badge ${hub.is_priority ? 'priority' : 'normal'}`}>
          <span className={`status-dot ${hub.is_priority ? 'magenta' : 'blue'}`} />
          {hub.is_priority ? 'Prioritas' : 'Normal'}
        </span>
      </div>
      <div className="detail-metrics-grid">
        <div className="detail-metric-tile">
          <span className="detail-metric-label">package_count</span>
          <div className="detail-metric-val">{formatNumber(hub.package_count)}</div>
        </div>
        <div className="detail-metric-tile">
          <span className="detail-metric-label">Mean dwell</span>
          <div className={`detail-metric-val ${hub.is_priority ? 'priority' : ''}`}>{formatDwell(hub.avg_dwell_hours)}</div>
        </div>
        <div className="detail-metric-tile">
          <span className="detail-metric-label">Median dwell</span>
          <div className="detail-metric-val">{formatDwell(hub.median_dwell_hours)}</div>
        </div>
      </div>
      <button type="button" className="detail-focus-btn" onClick={() => onFocusMap(hub.hub_id)}>
        Fokuskan di peta
      </button>
    </section>
  );
}
