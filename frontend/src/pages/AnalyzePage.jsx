import React, { useState } from 'react';
import axios from 'axios';

export default function AnalyzePage() {
  const [selectedCrop, setSelectedCrop] = useState('Apple');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Direct call to FastAPI ML Backend (port 8000)
      const res = await axios.post('/api/ml/v1/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.status === 'error') {
        setError(res.data.message);
      } else {
        setResult(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to reach the ML analysis service. Please ensure the backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Crop Disease Analysis</h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side: Inputs */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Crop Type
                </label>
                <select 
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-abstract-blue"
                >
                  <option value="Apple">Apple</option>
                  <option value="Grape">Grape</option>
                  <option value="Tomato">Tomato</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Leaf Photo
                </label>
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
                  ) : (
                    <div className="text-gray-500">
                      <div className="text-4xl mb-2">📸</div>
                      <p className="font-semibold">Click to upload leaf image</p>
                      <p className="text-xs text-gray-400 mt-1">Supports JPEG, PNG</p>
                    </div>
                  )}
                </label>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={!file || loading}
                className={`w-full py-3 bg-abstract-blue text-white rounded-lg font-bold hover:bg-opacity-90 transition-all ${
                  (!file || loading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Analyzing Leaf Image...' : 'Analyze Image'}
              </button>
            </div>

            {/* Right side: Results */}
            <div className="flex-1 flex flex-col justify-start">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Analysis Results</h3>

              {!result && !error && !loading && (
                <div className="text-gray-400 text-center py-16">
                  Upload a photo and click Analyze to view diagnosis details.
                </div>
              )}

              {loading && (
                <div className="text-abstract-blue text-center py-16 animate-pulse font-medium">
                  Processing image and running predictions...
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
                  <h4 className="font-bold mb-1">Validation Error</h4>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {result && result.status === 'low_confidence' && (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-100">
                  <h4 className="font-bold mb-1">Low Confidence Prediction</h4>
                  <p className="text-sm">{result.message}</p>
                </div>
              )}

              {result && result.status === 'success' && result.prediction && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-1">Detected Disease</span>
                        <h4 className="text-2xl font-bold text-green-900">{result.prediction.disease}</h4>
                      </div>
                      <span className="bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {result.prediction.severity} Severity
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-green-200">
                      <div>
                        <span className="text-gray-500 block">Crop Type</span>
                        <span className="font-semibold text-gray-800">{result.prediction.crop}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Confidence Match</span>
                        <span className="font-semibold text-gray-800">{(result.prediction.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {result.recovery_plan && (
                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                      <h4 className="font-bold text-lg text-gray-900 mb-3">AI Recovery Guidance Plan</h4>
                      <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {result.recovery_plan}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
