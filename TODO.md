# AgriMit Frontend Enhancement TODO

## Approved Plan Steps:

### 1. Install Dependencies

- [ ] `cd AgriMit/frontend && npm i react-router-dom chart.js react-chartjs-2 react-leaflet leaflet @types/leaflet lucide-react socket.io-client zustand` (use zustand for auth/map state instead of context)
- Update package.json scripts if needed.

### 2. Create Auth State Management

- [x] Create `src/stores/authStore.js` for login/register/logout, mock user data (farmer/expert).
- [x] Create `src/components/LoginModal.jsx`, `RegisterModal.jsx`.

### 3. Real-time Map

- [x] Create `src/components/RealTimeMap.jsx` with react-leaflet, mock field locations.
- [ ] Integrate into App/FarmerView sidebar.

### 4. Enhanced Graphs

- [x] Create `src/components/SensorGraphs.jsx`: pH, temp, moisture real-time charts with Chart.js.
- [x] Create `src/components/VegetationHealthGraph.jsx`.
- [ ] Integrate graphs in ExpertView/FarmerView.

### 5. Alerts System

- [x] Create `src/components/Alerts.jsx` with mock condition-based alerts.
- [ ] Add to FarmerView top section.

### 6. Layout & Integration

- [x] Update `src/App.jsx`: Auth wrapper, sidebar map layout.
- [x] Update Navbar: Auth buttons/modals complete.
- [x] Enhance FarmerView: Added Alerts, SensorGraphs, VegetationHealthGraph.
- [ ] Enhance ExpertView with graphs/alerts/map integration.
- [ ] Update api.js with mock endpoints.

### 7. Styling & Testing

- [ ] Update CSS for new components.
- [ ] Test: Auth flow, map interaction, graph rendering, real-time mock updates, alerts.

Progress will be tracked here.
