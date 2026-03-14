import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, LogOut, Menu, X, ChevronDown, Home, BarChart3, Info } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/auth/authApi';
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const {isLoggedIn: authLoggedIn, user} = useSelector(state => state.auth);
  // Check login status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(authLoggedIn);
      if (authLoggedIn) {
        setUserName(user?.name || 'User');
      }
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2.5">
                <Zap className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Bill<span className="text-blue-600">Wise</span>
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Pakistan's Bill Analyzer</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/how-it-works" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <Info className="h-4 w-4" />
              <span>How it Works</span>
            </Link>
            
            {isLoggedIn ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors"
                >
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">{userName}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/history"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Bill History
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/how-it-works"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="h-4 w-4" />
                <span>How it Works</span>
              </Link>
              
              {isLoggedIn ? (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <div className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500">{localStorage.getItem('userEmail') || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/saved-bills"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Saved Bills
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;