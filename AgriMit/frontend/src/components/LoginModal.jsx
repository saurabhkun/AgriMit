import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock login
    setTimeout(() => {
      login({ name: 'Ishant Gangwal', email, role: 'Farmer' });
      setLoading(false);
      onClose();
    }, 1500);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-leaf focus:border-transparent transition"
              placeholder="farmer@agrimit.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-leaf focus:border-transparent transition"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-agri-leaf text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-agri-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="spinner" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="p-8 pt-0 border-t border-gray-100 text-center text-sm">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

