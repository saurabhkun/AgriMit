import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {currentUser?.displayName || currentUser?.email}
            </h1>
            <p className="text-gray-600 mt-1">
              Account Email: {currentUser?.email}
            </p>
          </div>
          <button onClick={logout} className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium">
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-2">📸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analyze Crop</h3>
              <p className="text-gray-600 text-sm mb-4">
                Upload leaf images of Apple, Grape, or Tomato crops to diagnose potential diseases instantly.
              </p>
            </div>
            <Link to="/analyze" className="w-full text-center py-2.5 bg-abstract-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold block">
              Start Analysis &rarr;
            </Link>
          </div>

          <div className="border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">View History</h3>
              <p className="text-gray-600 text-sm mb-4">
                Access your past diagnosis records, check recovery plans, and keep track of your crop health progress.
              </p>
            </div>
            <Link to="/history" className="w-full text-center py-2.5 bg-white text-abstract-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold block">
              View History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
