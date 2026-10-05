import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatDwell, formatNumber } from '../utils/dataLoader';

function createPopup(hub, onSelectHub) {
  const popup = document.createElement('div');
  popup.className = 'hub-map-popup-card';

  const header = document.createElement('div');
  header.className = 'hub-map-popup-header';
  const title = document.createElement('strong');
  title.className = 'hub-map-popup-title';
  title.textContent = hub.hub_name;
  const id = document.createElement('span');
  id.className = 'hub-map-popup-id';
  id.textContent = hub.hub_id;
  header.append(title, id);
  popup.appendChild(header);

  const body = document.createElement('div');
  body.className = 'hub-map-popup-body';
  const rows = [
    ['Paket', formatNumber(hub.package_count)],
    ['Mean dwell', formatDwell(hub.avg_dwell_hours)],
    ['Median dwell', formatDwell(hub.median_dwell_hours)]
  ];
  rows.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'hub-map-popup-row';
    const labelNode = document.createElement('span');
    labelNode.textContent = `${label}:`;
    const valueNode = document.createElement('strong');
    valueNode.textContent = value;
    if (label === 'Mean dwell' && hub.is_priority) valueNode.className = 'text-primary';
    row.append(labelNode, valueNode);
    body.appendChild(row);
  });
  const status = document.createElement('div');
  status.className = `hub-map-popup-status ${hub.is_priority ? 'priority' : 'normal'}`;
  status.textContent = hub.is_priority ? 'Prioritas investigasi (≥ 6 jam)' : 'Normal (< 6 jam)';
  body.appendChild(status);
  popup.appendChild(body);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hub-map-popup-btn';
  button.textContent = 'Buka detail hub';
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    onSelectHub(hub.hub_id);
  });
  popup.appendChild(button);
  return popup;
}

export default function MapView({ visibleHubs, selectedHubId, onSelectHub, isLoading }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const onSelectHubRef = useRef(onSelectHub);

  useEffect(() => {
    onSelectHubRef.current = onSelectHub;
  }, [onSelectHub]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return undefined;

    const map = L.map(container, {
      center: [-2.5, 116],
      zoom: 5,
      zoomControl: true,
      attributionControl: true
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.on('click', () => onSelectHubRef.current(null));
    mapInstanceRef.current = map;
    const markers = markersRef.current;

    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      map.off();
      map.remove();
      markers.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current.clear();

    if (visibleHubs.length === 0) return;

    const bounds = [];
    visibleHubs.forEach((hub) => {
      const marker = L.circleMarker([hub.latitude, hub.longitude], {
        radius: hub.hub_id === selectedHubId ? 11 : 8,
        fillColor: hub.is_priority ? '#E6007E' : '#007DBD',
        color: hub.is_priority ? '#B90064' : '#006397',
        weight: hub.hub_id === selectedHubId ? 3 : 2,
        opacity: 1,
        fillOpacity: 0.88,
        bubblingMouseEvents: false
      }).addTo(map);
      marker.bindPopup(createPopup(hub, onSelectHub));
      marker.on('click', () => onSelectHub(hub.hub_id));
      markersRef.current.set(hub.hub_id, marker);
      bounds.push([hub.latitude, hub.longitude]);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 8);
    } else {
      map.fitBounds(L.latLngBounds(bounds), {
        padding: [36, 36],
        maxZoom: 8
      });
    }
  }, [visibleHubs, selectedHubId, onSelectHub]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = selectedHubId ? markersRef.current.get(selectedHubId) : null;
    const hub = visibleHubs.find((item) => item.hub_id === selectedHubId);
    if (!map || !marker || !hub) return;

    map.flyTo([hub.latitude, hub.longitude], Math.max(map.getZoom(), 7), {
      animate: true,
      duration: 0.5
    });
    marker.openPopup();
  }, [selectedHubId, visibleHubs]);

  const handleResetZoom = () => {
    const map = mapInstanceRef.current;
    if (map && visibleHubs.length) {
      map.fitBounds(
        L.latLngBounds(visibleHubs.map((hub) => [hub.latitude, hub.longitude])),
        { padding: [36, 36], maxZoom: 8 }
      );
    }
  };

  return (
    <section className="map-view-card" aria-label="Peta distribusi hub">
      <div className="map-header-bar">
        <div className="map-header-title-group">
          <svg className="map-title-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" x2="9" y1="3" y2="18" />
            <line x1="15" x2="15" y1="6" y2="21" />
          </svg>
          <span className="map-title-text">Peta dwell hub</span>
        </div>
        <div className="map-legend" aria-label="Legenda status">
          <div className="legend-item"><span className="legend-dot priority" /><span className="legend-label">Prioritas (≥ 6 jam)</span></div>
          <div className="legend-item"><span className="legend-dot normal" /><span className="legend-label">Normal (&lt; 6 jam)</span></div>
        </div>
      </div>
      <div className="map-inner-wrapper">
        <div ref={mapContainerRef} className="leaflet-map-element" />
        {visibleHubs.length === 0 && (
          <div className="map-empty-overlay">
            {isLoading ? 'Memuat data hub…' : 'Tidak ada hub yang sesuai pencarian dan filter.'}
          </div>
        )}
        {visibleHubs.length > 0 && (
          <>
            <div className="map-instruction-pill">
              Klik marker untuk melihat detail hub
            </div>
            <button type="button" className="map-reset-btn" onClick={handleResetZoom}>
              Tampilkan semua hub
            </button>
          </>
        )}
      </div>
    </section>
  );
}
