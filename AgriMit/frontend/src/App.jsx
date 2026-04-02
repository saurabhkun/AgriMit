import { useState } from "react";
import Navbar from "./components/Navbar";
import FarmerView from "./components/FarmerView";
import ExpertView from "./components/ExpertView";
import "./index.css";

import { useAuthStore } from './stores/authStore';

export default function App() {
  const [view, setView] = useState("farmer");
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Navbar view={view} setView={setView} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <main>
{isAuthenticated ? (
            view === "farmer" ? <FarmerView /> : <ExpertView />
          ) : (
            <div className="text-center py-24">
              <span className="text-6xl mb-6 block">🌾</span>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to AgriMit
              </h1>
              <p className="text-xl text-gray-600 max-w-lg mx-auto mb-8">
                Click Sign Up or Sign In to get started with AI-powered field monitoring.
              </p>
            </div>
          )}
        </main>
      </div>

        <footer className="border-t border-gray-200 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-xs text-gray-400">
          ©2026 AgriMit — Precision Agriculture Dashboard
        </div>
      </footer>
    </div>
  );
}

