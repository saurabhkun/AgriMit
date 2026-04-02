import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Activity } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Mock fields with coordinates (lat, lng)
const MOCK_FIELDS = [
  { id: 'F001', name: 'Field Alpha', location: '23.0225, 72.5714', lat: 23.0225, lng: 72.5714, status: 'healthy', crop: 'Rice' },
  { id: 'F002', name: 'Field Beta', location: '23.0345, 72.5623', lat: 23.0345, lng: 72.5623, status: 'warning', crop: 'Cotton' },
  { id: 'F003', name: 'Field Gamma', location: '22.9987, 72.5856', lat: 22.9987, lng: 72.5856, status: 'critical', crop: 'Wheat' },
];

export default function RealTimeMap({ onSelectField, height = '400px', selectedId }) {
  const [fields, setFields] = useState(MOCK_FIELDS);
  const [position, setPosition] = useState([23.0225, 72.5714]);
  const isAuth = useAuthStore((state) => state.isAuthenticated());

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFields(prev => prev.map(f => ({
        ...f,
        status: ['healthy', 'warning', 'critical'][Math.floor(Math.random() * 3)]
      })));
    }, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, []);

  // Map click handler
  function LocationMarker() {
    useMapEvents({
      click: (e) => {
        setPosition(e.latlng);
      },
    });
    return null;
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100" style={{ height }}>
      <div className="p-4 bg-gradient-to-r from-agri-leaf/10 to-agri-green/10 border-b border-gray-100 flex items-center gap-2">
        <Activity className="w-5 h-5 text-agri-leaf animate-pulse" />
        <h3 className="font-semibold text-agri-dark text-sm uppercase tracking-wide">Real-Time Field Map</h3>
        {isAuth && <span className="ml-auto text-xs text-gray-400">Live updates</span>}
      </div>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: 'calc(100% - 60px)', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        
        {fields.map((field) => {
          const iconColor = field.status === 'healthy' ? '#16A34A' : field.status === 'warning' ? '#F59E0B' : '#DC2626';
          const isSelected = field.id === selectedId;
          
          return (
            <Marker
              key={field.id}
              position={[field.lat, field.lng]}
              eventHandlers={{
                click: () => onSelectField?.(field.id),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h4 className="font-bold text-lg mb-1">{field.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{field.crop} • {field.location}</p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    field.status === 'healthy' ? 'bg-green-100 text-green-800' :
                    field.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      field.status === 'healthy' ? 'bg-green-500' :
                      field.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    {field.status.toUpperCase()}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

