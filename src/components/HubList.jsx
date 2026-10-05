import { formatDwell, formatNumber } from '../utils/dataLoader';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';

export default function HubList({
  visibleHubs,
  totalHubsCount,
  selectedHubId,
  onSelectHub,
  isLoading,
  onResetFilters
}) {
  return (
    <section className="hub-list-card" aria-label="Daftar hub yang terlihat">
      <div className="hub-list-header">
        <div className="hub-list-title-group">
          <svg className="hub-list-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
          </svg>
          <span className="hub-list-title">Daftar hub</span>
        </div>
        <span className="hub-list-counter-chip">
          {isLoading ? 'Memuat data…' : `${visibleHubs.length} dari ${totalHubsCount} hub`}
        </span>
      </div>
      <div className="hub-list-body">
        {isLoading ? (
          <LoadingSkeleton />
        ) : visibleHubs.length === 0 ? (
          <EmptyState onReset={onResetFilters} />
        ) : (
          <div className="hub-cards-scroll-container">
            {visibleHubs.map((hub) => {
              const isPriority = hub.is_priority;
              const isSelected = hub.hub_id === selectedHubId;
              return (
                <article
                  key={hub.hub_id}
                  className={`hub-item-card ${isPriority ? 'border-priority' : 'border-normal'} ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectHub(hub.hub_id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelectHub(hub.hub_id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                >
                  <div className="hub-item-top">
                    <div className="hub-item-ident">
                      <span className="hub-item-name">{hub.hub_name}</span>
                      <span className="hub-item-id-badge">{hub.hub_id}</span>
                    </div>
                    <span className={`hub-item-status-pill ${isPriority ? 'priority' : 'normal'}`}>
                      <span className={`status-dot ${isPriority ? 'magenta' : 'blue'}`} />
                      {isPriority ? 'Prioritas investigasi' : 'Normal'}
                    </span>
                  </div>
                  <div className="hub-item-metrics-grid">
                    <div className="hub-metric-col">
                      <span className="hub-metric-label">Paket</span>
                      <span className="hub-metric-val">{formatNumber(hub.package_count)}</span>
                    </div>
                    <div className="hub-metric-col">
                      <span className="hub-metric-label">Mean dwell</span>
                      <span className={`hub-metric-val ${isPriority ? 'priority' : ''}`}>{formatDwell(hub.avg_dwell_hours)}</span>
                    </div>
                    <div className="hub-metric-col">
                      <span className="hub-metric-label">Median dwell</span>
                      <span className="hub-metric-val">{formatDwell(hub.median_dwell_hours)}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
