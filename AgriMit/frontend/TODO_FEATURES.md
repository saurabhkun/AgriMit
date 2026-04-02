# AgriMit Feature Implementation TODO

## Phase 1: Graphs (Priority - Approved) ✓

- [x] Implement SensorGraphs.jsx (soil moisture, pH, temp, humidity, leaf wetness)
- [x] Implement VegetationHealthGraph.jsx (NDVI trends, disease progression)
- [x] Integrate into FarmerView.jsx & ExpertView.jsx
- [x] Add mock pH data to DEMO_SENSORS

**Phase 1 COMPLETE** ✅

**Phase 1 LIVE - Vite HMR confirmed**

## Phase 2: Backend LLM Enhancement (Disease Precautions Added ✅)

- [x] Update ml_stubs.py generate_advice_stub() with structured prompt + disease-specific precautions (Tomato prioritized: early_blight, late_blight, bacterial_spot, mosaic_virus)
- [x] Expand schemas.py (Added precautions: List[str] to AdviceResult)
- [ ] Update api.js fuseAndAdvise payload

**Phase 2 Progress: Disease detection + market prices/shops (Mancozeb ₹350/500g @ Krishi Kendra Nashik)**

## Phase 3: Risk Dashboard

- [ ] Create RiskDashboard.jsx (aphid/fungal/pest risks)
- [ ] Integrate chips/gauges

**Phase 2 Market Prices COMPLETE ✅**
