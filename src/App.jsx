import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GlobalKPI from './components/GlobalKPI';
import FilterToolbar from './components/FilterToolbar';
import MapView from './components/MapView';
import HubList from './components/HubList';
import HubDetail from './components/HubDetail';
import ErrorBanner from './components/ErrorBanner';
import {
  calculateGlobalKPI,
  fetchAndParseHubs,
  getTop3Hubs
} from './utils/dataLoader';
import './App.css';

export default function App() {
  const [hubs, setHubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [selectedHubId, setSelectedHubId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    fetchAndParseHubs(`${import.meta.env.BASE_URL}data/anteraja_bottleneck_map.csv`)
      .then((data) => {
        if (!ignore) setHubs(data);
      })
      .catch((error) => {
        if (!ignore) {
          setHubs([]);
          setErrorMessage(error.message || 'Terjadi kesalahan saat memuat data CSV.');
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadTrigger]);

  const globalKPI = useMemo(() => calculateGlobalKPI(hubs), [hubs]);
  const globalTop3 = useMemo(() => getTop3Hubs(hubs), [hubs]);

  const visibleHubs = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('id-ID');
    return hubs.filter((hub) => {
      const matchesFilter = filterMode === 'all' || hub.is_priority;
      const matchesSearch =
        !query ||
        hub.hub_name.toLocaleLowerCase('id-ID').includes(query) ||
        hub.hub_id.toLocaleLowerCase('id-ID').includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [hubs, filterMode, searchQuery]);

  const selectedHub = useMemo(
    () => visibleHubs.find((hub) => hub.hub_id === selectedHubId) || null,
    [visibleHubs, selectedHubId]
  );

  const handleSelectHub = useCallback((hubId) => {
    if (!hubId) {
      setSelectedHubId(null);
      return;
    }

    if (!visibleHubs.some((hub) => hub.hub_id === hubId)) {
      setSearchQuery('');
      setFilterMode('all');
    }
    setSelectedHubId(hubId);
  }, [visibleHubs]);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    const selectedHub = hubs.find((hub) => hub.hub_id === selectedHubId);
    const normalizedQuery = query.trim().toLocaleLowerCase('id-ID');
    if (
      selectedHub &&
      !(
        selectedHub.hub_name.toLocaleLowerCase('id-ID').includes(normalizedQuery) ||
        selectedHub.hub_id.toLocaleLowerCase('id-ID').includes(normalizedQuery)
      )
    ) {
      setSelectedHubId(null);
    }
  }, [hubs, selectedHubId]);

  const handleFilterChange = useCallback((mode) => {
    setFilterMode(mode);
    const selectedHub = hubs.find((hub) => hub.hub_id === selectedHubId);
    if (mode === 'priority' && selectedHub && !selectedHub.is_priority) {
      setSelectedHubId(null);
    }
  }, [hubs, selectedHubId]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setErrorMessage('');
    setReloadTrigger((trigger) => trigger + 1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterMode('all');
  }, []);

  return (
    <div className="dashboard-app-wrapper">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content-layout">
        <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <main className="dashboard-main-container">
          {errorMessage && <ErrorBanner message={errorMessage} onRetry={handleRetry} />}
          {!errorMessage && (
            <>
              <GlobalKPI
                kpi={globalKPI}
                top3Hubs={globalTop3}
                onSelectHub={handleSelectHub}
                isLoading={isLoading}
              />
              <FilterToolbar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                filterMode={filterMode}
                onFilterChange={handleFilterChange}
                totalCount={globalKPI.totalHubs}
                priorityCount={globalKPI.priorityCount}
              />
              <div className="work-area-grid">
                <MapView
                  visibleHubs={visibleHubs}
                  selectedHubId={selectedHub?.hub_id ?? null}
                  onSelectHub={handleSelectHub}
                  isLoading={isLoading}
                />
                <div className="list-column">
                  {selectedHub && (
                    <HubDetail
                      hub={selectedHub}
                      onClose={() => setSelectedHubId(null)}
                      onFocusMap={handleSelectHub}
                    />
                  )}
                  <HubList
                    visibleHubs={visibleHubs}
                    totalHubsCount={globalKPI.totalHubs}
                    selectedHubId={selectedHub?.hub_id ?? null}
                    onSelectHub={handleSelectHub}
                    isLoading={isLoading}
                    onResetFilters={handleResetFilters}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
