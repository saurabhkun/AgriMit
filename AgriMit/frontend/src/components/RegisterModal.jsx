import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function RegisterModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [loading, setLoading] = useState(false);
  
  const register = useAuthStore((state) => state.register);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock register
    setTimeout(() => {
      register({ name, email, role });
      setLoading(false);
      onClose();
    }, 1500);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Join AgriMit</h2>
          <p className="text-gray-500">Create your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-leaf focus:border-transparent transition"
              placeholder="John Doe"
              required
            />
          </div>
          
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-all flex-1 text-sm">
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={role === 'farmer'}
                  onChange={() => setRole('farmer')}
                  className="w-5 h-5 text-agri-leaf focus:ring-agri-leaf"
                />
                <span>🧑‍🌾 Farmer</span>
              </label>
              <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-all flex-1 text-sm">
                <input
                  type="radio"
                  name="role"
                  value="expert"
                  checked={role === 'expert'}
                  onChange={() => setRole('expert')}
                  className="w-5 h-5 text-agri-leaf focus:ring-agri-leaf"
                />
                <span>🔬 Expert</span>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-agri-leaf text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-agri-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="spinner" />
                Creating account...
              </>
            ) : (
              'Create Account'
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

