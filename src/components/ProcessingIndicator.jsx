import React from 'react';
import { Loader, Zap } from 'lucide-react';

const ProcessingIndicator = ({ isProcessing, progress }) => {
  if (!isProcessing) return null;
  
  return (
    <div className="relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl animate-pulse"></div>
      
      {/* Content */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-xl">
        <div className="flex items-center space-x-4">
          {/* Animated Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-md animate-ping"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3">
              <Loader className="h-6 w-6 text-white animate-spin" />
            </div>
          </div>
          
          {/* Progress Info */}
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              Processing Your Bill
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Extracting text and analyzing bill details...
            </p>
            
            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            {/* Progress Percentage */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500 flex items-center">
                <Zap className="h-3 w-3 mr-1 text-blue-500" />
                OCR Engine v2.0
              </span>
              <span className="text-sm font-bold text-blue-600">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ProcessingIndicator;