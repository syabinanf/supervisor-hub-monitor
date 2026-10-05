export default function FilterToolbar({
  searchQuery,
  onSearchChange,
  filterMode,
  onFilterChange,
  totalCount,
  priorityCount
}) {
  return (
    <div className="filter-toolbar-container">
      <div className="search-filter-row">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari nama atau ID hub"
            aria-label="Cari nama atau ID hub"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>
        <div className="filter-tabs-group" role="group" aria-label="Filter hub">
          <button
            type="button"
            aria-pressed={filterMode === 'all'}
            className={`filter-tab-btn ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            Semua hub ({totalCount})
          </button>
          <button
            type="button"
            aria-pressed={filterMode === 'priority'}
            className={`filter-tab-btn priority-tab ${filterMode === 'priority' ? 'active' : ''}`}
            onClick={() => onFilterChange('priority')}
          >
            Prioritas investigasi ({priorityCount})
          </button>
        </div>
      </div>
    </div>
  );
}
