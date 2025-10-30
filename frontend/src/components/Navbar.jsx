import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-blue-500/30 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl">🦋</div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all">
              Wanderer's Journal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link to="/posts" className="text-gray-300 hover:text-blue-400 transition-colors">
              Explore
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/create" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Write
                </Link>
                <Link to="/saved" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Saved
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    <img 
                      src={user?.avatar} 
                      alt={user?.username}
                      className="w-8 h-8 rounded-full border-2 border-blue-500"
                    />
                    <span>{user?.username}</span>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-blue-500/30 rounded-lg shadow-xl py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-blue-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block text-gray-300 hover:text-blue-400 py-2">
              Home
            </Link>
            <Link to="/posts" className="block text-gray-300 hover:text-blue-400 py-2">
              Explore
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/create" className="block text-gray-300 hover:text-blue-400 py-2">
                  Write
                </Link>
                <Link to="/saved" className="block text-gray-300 hover:text-blue-400 py-2">
                  Saved
                </Link>
                <Link to="/profile" className="block text-gray-300 hover:text-blue-400 py-2">
                  My Profile
                </Link>
                <Link to="/settings" className="block text-gray-300 hover:text-blue-400 py-2">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-400 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-300 hover:text-blue-400 py-2">
                  Login
                </Link>
                <Link to="/register" className="block text-blue-400 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;