import { formatDwell, formatNumber } from '../utils/dataLoader';

export default function GlobalKPI({ kpi, top3Hubs, onSelectHub, isLoading }) {
  const { totalHubs, totalPackages, priorityCount } = kpi;

  return (
    <section className="global-kpi-section" aria-label="Ringkasan global seluruh hub">
      <div className="kpi-grid">
        <article className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Jumlah hub global</span>
            <span className="kpi-icon-box primary" aria-hidden="true">⌖</span>
          </div>
          <div className="kpi-card-body">
            <div className="kpi-metric-val">{isLoading ? '—' : totalHubs}</div>
            <div className="kpi-sub-line">Seluruh hub dalam dataset</div>
          </div>
        </article>

        <article className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Total package_count global</span>
            <span className="kpi-icon-box tertiary" aria-hidden="true">▦</span>
          </div>
          <div className="kpi-card-body">
            <div className="kpi-metric-val">{isLoading ? '—' : formatNumber(totalPackages)}</div>
            <div className="kpi-sub-line">Jumlah dari seluruh hub</div>
          </div>
        </article>

        <article className="kpi-card priority-kpi">
          <div className="kpi-card-header">
            <span className="kpi-card-label priority">Hub prioritas global</span>
            <span className="kpi-icon-box error" aria-hidden="true">!</span>
          </div>
          <div className="kpi-card-body">
            <div className="kpi-metric-val priority">{isLoading ? '—' : priorityCount}</div>
            <div className="kpi-sub-line">
              <span className="status-dot magenta" />
              Mean dwell ≥ 6 jam (aturan latihan)
            </div>
          </div>
        </article>

        <article className="kpi-card top3-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Top 3 mean dwell global</span>
            <span className="kpi-icon-box secondary" aria-hidden="true">↗</span>
          </div>
          <div className="top3-list">
            {top3Hubs.map((hub, index) => (
              <button
                key={hub.hub_id}
                type="button"
                className="top3-row"
                onClick={() => onSelectHub(hub.hub_id)}
                title={`Tampilkan detail ${hub.hub_name}`}
              >
                <span className="top3-name-group">
                  <span className={`rank-circle rank-badge-${index + 1}`}>{index + 1}</span>
                  <span className="top3-hub-name">{hub.hub_name}</span>
                </span>
                <span className="top3-dwell-chip">{formatDwell(hub.avg_dwell_hours)}</span>
              </button>
            ))}
            {!isLoading && top3Hubs.length === 0 && (
              <span className="kpi-sub-line">Belum ada data hub.</span>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
