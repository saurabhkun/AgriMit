import { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from './StatusBadge';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const COLORS = {
  green: '#10B981', orange: '#F59E0B', purple: '#8B5CF6', red: '#EF4444', gray: '#9CA3AF'
};

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function FarmMap({ fields = [], selectedId, onFieldSelect }) {
  const [userFields, setUserFields] = useState([]);
  const [clickedCoords, setClickedCoords] = useState(null);
  const [center, setCenter] = useState([20.5937, 78.9629]); // India
  const [satellite, setSatellite] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);

  const handleClick = (latlng) => {
    const coords = { lat: latlng.lat.toFixed(4), lng: latlng.lng.toFixed(4) };
    setClickedCoords(coords);
    
    const tempField = {
      id: `point_${Date.now()}`,
      name: `Location ${coords.lat}N ${coords.lng}E`,
      location: `${coords.lat}°N, ${coords.lng}°E`,
      lastStatus: 'info',
      bounds: { polygon: [[latlng.lat, latlng.lng]] }
    };
    setUserFields(prev => [...prev, tempField]);
  };

  const startDrawing = () => {
    setDrawingMode(true);
  };

  const handleDrawComplete = (e) => {
    const layer = e.target;
    const coords = layer.getLatLngs()[0].map(p => [p.lat, p.lng]);
    const bounds = layer.getBounds();
    const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) / 10000; // m² to ha approx
    
    const newField = {
      id: `field_${Date.now()}`,
      name: `My Field (${area.toFixed(1)} ha)`,
      cropType: 'User Drawn',
      location: `${bounds.getCenter().lat.toFixed(3)}N ${bounds.getCenter().lng.toFixed(3)}E`,
      lastStatus: area > 5 ? 'green' : 'orange',
      acres: Math.round(area * 2.47),
      bounds: {
        polygon: coords,
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
        areaAcres: Math.round(area * 2.47)
      }
    };
    
    setUserFields(prev => [...prev, newField]);
    layer.bindPopup(`Field Selected! ${newField.name}`).openPopup();
    layer.on('click', () => onFieldSelect(newField.id));
    
    setCenter(bounds.getCenter());
    const map = layer._map;
    map.fitBounds(bounds);
    
    setDrawingMode(false);
    map.removeLayer(layer);
  };

  const allFields = [...fields, ...userFields];
  const currentField = allFields.find(f => f.id === selectedId);

  return (
    <div className="card h-96 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Controls */}
      <div className="absolute top-3 left-3 z-[1000] flex gap-1 bg-white/95 backdrop-blur p-1 rounded-xl shadow-lg">
        <button 
          onClick={() => setSatellite(prev => !prev)}
          className="px-2 py-1 text-xs rounded-lg transition-all bg-white hover:bg-gray-50"
          title="Street/Satellite"
        >
          {satellite ? '🗺️' : '🛰️'}
        </button>
        <button 
          onClick={drawingMode ? () => setDrawingMode(false) : startDrawing}
          className="px-2 py-1 text-xs rounded-lg transition-all bg-blue-500 hover:bg-blue-600 text-white"
          title="Draw field"
        >
          {drawingMode ? '⏹️' : '📐'}
        </button>
      </div>

      {/* Info panels */}
      {clickedCoords && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur rounded-xl px-3 py-2 shadow-lg text-xs">
          📍 {clickedCoords.lat}°N {clickedCoords.lng}°E
        </div>
      )}
      
      {currentField && (
        <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur rounded-xl px-3 py-2 shadow-lg text-xs">
          <StatusBadge status={currentField.lastStatus} />
          <div>{currentField.acres || '?'} acres</div>
        </div>
      )}

      <MapContainer center={center} zoom={5} style={{height: '100%', width: '100%'}} maxZoom={20}>
        <ClickHandler onClick={handleClick} />
        
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url={satellite 
            ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />

        {/* Predefined fields */}
        {fields.map(field => (
          <Polygon
            key={field.id}
            positions={field.bounds.polygon}
            pathOptions={{
              fillColor: COLORS[field.lastStatus] || COLORS.gray,
              fillOpacity: 0.4,
              color: COLORS[field.lastStatus] || COLORS.gray,
              weight: 2
            }}
          >
            <Popup maxWidth={250}>
              <div>
                <h3 className="font-bold mb-1">{field.name}</h3>
                <StatusBadge status={field.lastStatus} />
                <p className="text-xs mt-2">{field.cropType}</p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* User fields */}
        {userFields.map(field => (
          <Polygon
            key={field.id}
            positions={field.bounds.polygon}
            pathOptions={{
              fillColor: COLORS[field.lastStatus],
              fillOpacity: 0.5,
              color: COLORS[field.lastStatus],
              weight: 3
            }}
          >
            <Popup>
              <div className="min-w-[250px]">
                <h3 className="font-bold">{field.name}</h3>
                <StatusBadge status={field.lastStatus} size="lg" />
                <p className="text-sm mt-2">{field.location}</p>
                <button 
                  className="w-full mt-3 bg-blue-500 text-white py-2 px-4 rounded font-medium text-sm hover:bg-blue-600"
                  onClick={() => onFieldSelect(field.id)}
                >
                  Analyze
                </button>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Click marker */}
        {clickedCoords && (
          <Marker position={[parseFloat(clickedCoords.lat), parseFloat(clickedCoords.lng)]}>
            <Popup>Clicked location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

