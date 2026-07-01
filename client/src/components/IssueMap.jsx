import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

export default function IssueMap({ 
  issues = [], 
  center = [23.7957, 86.4304], 
  zoom = 13, 
  selectable = false,
  selectedLocation = null,
  onLocationSelect = null 
}) {
  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CartoDB'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {selectable && <LocationPicker onLocationSelect={onLocationSelect} />}

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <strong>Selected Location</strong><br />
              Lat: {selectedLocation.lat.toFixed(5)}<br />
              Lng: {selectedLocation.lng.toFixed(5)}
            </Popup>
          </Marker>
        )}

        {!selectable && issues.map((issue) => (
          <Marker key={issue.id} position={[parseFloat(issue.latitude), parseFloat(issue.longitude)]}>
            <Popup>
              <div style={{ padding: '4px', maxWidth: '220px' }}>
                <strong style={{ fontSize: '0.95rem' }}>{issue.title}</strong><br />
                <span style={{ fontSize: '0.8rem', color: '#666' }}>Status: {issue.status}</span><br />
                <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}>{issue.address || issue.neighborhood || 'Geotagged Issue'}</p>
                <a href={`/issues/${issue.id}`} style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, display: 'inline-block', marginTop: '6px' }}>
                  View Full Report →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
