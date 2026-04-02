// Navbar.jsx – Top navigation with role toggle + Language switcher
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import LoginModal from "./LoginModal.jsx";
import RegisterModal from "./RegisterModal.jsx";
import { User, LogOut, LogIn, UserPlus, Globe } from 'lucide-react';

export default function Navbar({ view, setView }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLang, setShowLang] = useState(false);
  
  const { t, i18n } = useTranslation();
  const { user, role, isAuthenticated: isAuthenticatedValue, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLang(false);
  };

  const languages = [
    { code: 'en', name: '🇺🇸 English', native: 'English' },
    { code: 'hi', name: '🇮🇳 हिन्दी', native: 'हिंदी' },
    { code: 'mr', name: '🇮🇳 मराठी', native: 'मराठी' },
    { code: 'kn', name: '🇮🇳 ಕನ್ನಡ', native: 'ಕನ್ನಡ' },
    { code: 'te', name: '🇮🇳 తెలుగు', native: 'తెలుగు' }
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <div className="leading-tight">
              <h1 className="text-base font-extrabold text-agri-dark tracking-tight">
                {t('Agrimit')}
              </h1>
              <p className="text-[10px] font-medium text-gray-400 tracking-wide">
                {t('AI Field Health Assistant')}
              </p>
            </div>
          </div>

          {/* Right side: Language + Auth + Role toggle */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowLang(!showLang)}
                className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-lg transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium text-xs capitalize">{i18n.language}</span>
              </button>
              {showLang && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[120px] z-50">
                  {languages.map(({ code, name }) => (
                    <button
                      key={code}
                      onClick={() => changeLanguage(code)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="w-5">{name.split(' ')[0]}</span>
                      <span>{name.split(' ').slice(1).join(' ')}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role toggle - only shown when authenticated */}
            {isAuthenticatedValue && (
              <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
                <button
                  onClick={() => setView("farmer")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    view === "farmer"
                      ? "bg-white text-agri-dark shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  🧑‍🌾 {t('Farmer')}
                </button>
                <button
                  onClick={() => setView("expert")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    view === "expert"
                      ? "bg-white text-agri-dark shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  🔬 {t('Expert')}
                </button>
              </div>
            )}

            {/* Auth buttons */}
            {isAuthenticatedValue ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <User className="w-5 h-5" />
                  <span>{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-red-600 px-3 py-1.5 bg-gray-100 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  {t('Logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-200 hover:border-gray-300 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  {t('Sign In')}
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="flex items-center gap-1.5 text-sm font-semibold bg-agri-leaf text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:bg-agri-dark transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  {t('Sign Up')}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showLogin && <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />}
    </>
  );
}

