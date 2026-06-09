import React from 'react';

export default function HistoryPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prediction History</h1>
        <p className="text-gray-500 mb-8">
          Keep track of all your past crop scans and AI recovery progress.
        </p>
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-gray-400 font-medium">
          No prediction history yet.
        </div>
      </div>
    </div>
  );
}
