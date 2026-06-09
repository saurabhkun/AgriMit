import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  return (
    <nav className="bg-abstract-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-abstract-blue rounded-lg flex items-center justify-center">
          <span className="font-bold text-lg">A</span>
        </div>
        <Link to="/" className="text-xl font-bold tracking-tight">AgriMit <span className="font-normal text-gray-300">| Help Center</span></Link>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/" className="px-4 py-2 hover:bg-gray-800 rounded transition-colors">Home</Link>
        {currentUser ? (
          <>
            <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-800 rounded transition-colors">Dashboard</Link>
            <Link to="/analyze" className="px-4 py-2 hover:bg-gray-800 rounded transition-colors">Analyze</Link>
            <Link to="/history" className="px-4 py-2 hover:bg-gray-800 rounded transition-colors">History</Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 hover:bg-gray-800 rounded transition-colors">Sign In</Link>
            <Link to="/register" className="px-4 py-2 bg-abstract-blue hover:bg-opacity-90 rounded font-medium transition-colors">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
