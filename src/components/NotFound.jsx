import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  Zap, 
  Search, 
  FileQuestion,
  Compass,
  AlertTriangle,
  RefreshCw,
  MapPin
} from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(10);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can implement search logic here
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl w-full">
        {/* Animated 404 Text */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-[12rem] md:text-[16rem] font-black leading-none select-none">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                4
              </span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-bounce inline-block">
                0
              </span>
              <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent animate-pulse">
                4
              </span>
            </h1>
            <div className="absolute -top-4 -right-4 animate-spin-slow">
              <Compass className="h-12 w-12 text-gray-400 opacity-50" />
            </div>
            <div className="absolute -bottom-4 -left-4 animate-bounce-slow">
              <MapPin className="h-10 w-10 text-blue-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Error Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          <div className="text-center mb-8">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl mb-6 shadow-lg">
              <FileQuestion className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 max-w-lg mx-auto mb-6">
              The page you're looking for doesn't exist or has been moved. 
              Don't worry, even the best explorers get lost sometimes!
            </p>

            {/* Animated Divider */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="h-1 w-12 bg-blue-200 rounded-full animate-pulse"></div>
              <div className="h-1 w-12 bg-indigo-200 rounded-full animate-pulse animation-delay-200"></div>
              <div className="h-1 w-12 bg-purple-200 rounded-full animate-pulse animation-delay-400"></div>
            </div>

            {/* Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                <Home className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Go Home</h3>
                <p className="text-xs text-gray-500">Return to dashboard</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                <ArrowLeft className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Go Back</h3>
                <p className="text-xs text-gray-500">Previous page</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                <Zap className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Dashboard</h3>
                <p className="text-xs text-gray-500">View your bills</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
              <span>Go to Homepage</span>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="group bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border border-gray-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Auto-redirect Counter */}
          <div className="text-center text-sm text-gray-500 mb-6">
            <p>
              Redirecting to homepage in{' '}
              <span className="inline-flex items-center justify-center bg-blue-100 text-blue-600 px-2 py-1 rounded-lg font-bold min-w-[2.5rem]">
                {counter}s
              </span>
            </p>
          </div>

          {/* Search Toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center space-x-1 mx-auto"
            >
              <Search className="h-4 w-4" />
              <span>{showSearch ? 'Hide Search' : 'Try Searching'}</span>
            </button>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <form onSubmit={handleSearch} className="mt-4 animate-slideDown">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for pages, bills, or help..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Go
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Helpful Links */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <a
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            Dashboard
          </a>
          <a
            href="/profile"
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            Profile
          </a>
          <a
            href="/bill-history"
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            Bill History
          </a>
          <a
            href="/support"
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            Support
          </a>
        </div>

        {/* Fun Fact */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            HTTP 404 - Page Not Found
            <span className="mx-2">•</span>
            <RefreshCw className="h-3 w-3 mr-1 animate-spin-slow" />
            Don't worry, we'll get you back on track!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 7s infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NotFound;