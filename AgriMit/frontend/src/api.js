// src/api.js
// All API calls to the Agrimit backend

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  getFields: () => {
    // Mock for frontend dev (backend optional) + GEO DATA
    return Promise.resolve([
      {
        id: "F001",
        name: "Field Alpha",
        cropType: "Corn",
        location: "41.5°N, 93.5°W (Iowa)",
        lastStatus: "yellow",
        acres: 120,
        bounds: {
          north: 41.52,
          south: 41.48,
          east: -93.48,
          west: -93.52,
          areaAcres: 120,
          polygon: [
            [41.52, -93.52],
            [41.52, -93.48],
            [41.48, -93.48],
            [41.48, -93.52],
            [41.52, -93.52]
          ]
        }
      },
      {
        id: "F002",
        name: "Field Beta", 
        cropType: "Wheat",
        location: "38.8°N, 97.4°W (Kansas)",
        lastStatus: "green",
        acres: 85,
        bounds: {
          north: 38.82,
          south: 38.78,
          east: -97.38,
          west: -97.42,
          areaAcres: 85,
          polygon: [
            [38.82, -97.42],
            [38.82, -97.38],
            [38.78, -97.38],
            [38.78, -97.42],
            [38.82, -97.42]
          ]
        }
      },
      {
        id: "F003",
        name: "Field Gamma",
        cropType: "Soybean",
        location: "40.0°N, 89.0°W (Illinois)", 
        lastStatus: "red",
        acres: 95,
        bounds: {
          north: 40.02,
          south: 39.98,
          east: -88.98,
          west: -89.02,
          areaAcres: 95,
          polygon: [
            [40.02, -89.02],
            [40.02, -88.98],
            [39.98, -88.98],
            [39.98, -89.02],
            [40.02, -89.02]
          ]
        }
      }
    ]);
  },

  getField: (fieldId) => request(`/api/demo/field/${fieldId}`),

  analyzeImage: async (file, cropType, fieldId) => {
    // Mock static analysis for demo (backend optional)
    await new Promise(r => setTimeout(r, 2000)); // Simulate AI processing
    
    const diseases = [
      { label: 'healthy', severity: 'mild', confidence: 0.92 },
      { label: 'leaf_blight', severity: 'moderate', confidence: 0.78 },
      { label: 'nutrient_deficiency', severity: 'mild', confidence: 0.85 },
      { label: 'pest_damage', severity: 'severe', confidence: 0.89 }
    ];
    
    const mock = diseases[Math.floor(Math.random() * diseases.length)];
    
    return Promise.resolve({
      classLabel: mock.label,
      severity: mock.severity,
      confidence: mock.confidence,
      cropType,
      fieldId: fieldId || 'demo',
      timestamp: new Date().toISOString()
    });
  },

  analyzeSensors: async (payload) => {
    // Mock sensor analysis
    await new Promise(r => setTimeout(r, 1500));
    
    const moisture = payload.soilMoisture?.slice(-1)[0] || 50;
    const humidity = payload.humidity?.slice(-1)[0] || 60;
    const wetness = payload.leafWetness?.slice(-1)[0] || 40;
    
    return {
      irrigationRisk: moisture < 25 ? 'high' : moisture < 40 ? 'medium' : 'low',
      fungalRisk: humidity > 75 || wetness > 60 ? 'high' : humidity > 60 ? 'medium' : 'low',
      pestRisk: wetness > 50 ? 'medium' : 'low',
      avgSoilMoisture: payload.soilMoisture?.reduce((a,b)=>a+b,0)/payload.soilMoisture.length || 50,
      avgHumidity: payload.humidity?.reduce((a,b)=>a+b,0)/payload.humidity.length || 60,
      avgLeafWetness: payload.leafWetness?.reduce((a,b)=>a+b,0)/payload.leafWetness.length || 40,
      avgAirTemp: payload.airTemp?.reduce((a,b)=>a+b,0)/payload.airTemp.length || 25,
      timestamp: new Date().toISOString()
    };
  },

  fuseAndAdvise: async (payload) => {
    // Mock AI advice for image + sensor data
    await new Promise(r => setTimeout(r, 1500));
    
    const analysis = payload.imageAnalysis || { classLabel: 'healthy', severity: 'mild' };
    const sensorRisk = payload.sensorAnalysis || {};
    
    const adviceTemplates = {
      healthy: {
        status: 'green',
        alerts: [],
        actions: ['Continue current practices', 'Schedule weekly scouting'],
        tips: ['Soil test in 30 days', 'Maintain irrigation schedule'],
        pesticides: [],
        nutrients: [],
        shops: ['Local Co-op', 'Agri Supplies Store']
      },
      leaf_blight: {
        status: 'yellow',
        disease: 'Northern Corn Leaf Blight',
        alerts: ['Fungal blight - treat immediately'],
        actions: ['Apply Kocide 101 (copper hydroxide) 1.5lb/acre', 'Prune lower leaves', 'Increase row spacing'],
        tips: ['Humidity <70%', 'Morning fungicide sprays'],
        pesticides: ['Kocide 101', 'Mancozeb Dithane', 'Headline (pyraclostrobin)'],
        nutrients: [],
        shops: ['Krishi Kendra (2km)', 'Green Agri Mart (5km)']
      },
      nutrient_deficiency: {
        status: 'orange',
        disease: 'Nitrogen Deficiency',
        alerts: ['Yellowing lower leaves'],
        actions: ['Urea 46-0-0 foliar 2% solution', 'Soil test N-P-K', 'Side dress 50lbs N/acre'],
        tips: ['Split N applications', 'pH 6.0-7.0'],
        pesticides: [],
        nutrients: ['Urea 46-0-0', 'DAP 18-46-0', 'MOP 0-0-60'],
        shops: ['Fertilizer Depot (1km)', 'Sharma Agri (3km)']
      },
      pest_damage: {
        status: 'red',
        disease: 'Fall Armyworm Infestation',
        alerts: ['Chewing damage on leaves'],
        actions: ['Coragen (chlorantraniliprole) 0.2ml/liter', 'Deploy Trichogramma wasps', 'Border treatment'],
        tips: ['Scout nightly', 'Pheromone traps'],
        pesticides: ['Coragen', 'Pirimor (pirimicarb)', 'Thiodan (endosulfan)'],
        nutrients: [],
        shops: ['Pest Control Hub (4km)', 'Kisan Seva (1.5km)']
      }
    };
    
    const template = adviceTemplates[analysis.classLabel] || adviceTemplates.healthy;
    
    return {
      overallStatus: template.status,
      diagnosis: analysis.classLabel.replace(/_/g, ' '),
      severity: analysis.severity,
      confidence: analysis.confidence,
      sensorRisks: sensorRisk,
      alerts: template.alerts,
      actions: template.actions,
      preventionTips: template.tips,
      timestamp: new Date().toISOString()
    };
  },

  chat: (payload) =>
    request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};

