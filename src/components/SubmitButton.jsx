import React from 'react';
import { useSelector } from 'react-redux';
import { ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubmitButton = () => {
  const navigate = useNavigate();
  const { loading, submitting, error } = useSelector(state => state.bill);
  const isProcessing = loading || submitting;

  const handleClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="relative group">
      {/* Gradient Background Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
      
      {/* Button */}
      <button
        type="submit"
        disabled={isProcessing}
        onClick={handleClick}
        className={`
          relative w-full py-4 px-8 rounded-2xl text-lg font-semibold
          flex items-center justify-center space-x-3
          transition-all duration-300 transform
          ${isProcessing 
            ? 'bg-gray-600 cursor-not-allowed scale-100' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] hover:shadow-2xl'
          }
          text-white
        `}
      >
        {isProcessing ? (
          <>
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing Your Bill...</span>
          </>
        ) : (
          <>
            <Zap className="h-5 w-5" />
            <span>Analyze My Bill</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
      
      {/* Processing Progress Indicator */}
      {isProcessing && (
        <div className="absolute -bottom-6 left-0 right-0">
          <div className="flex justify-center">
            <span className="text-xs text-gray-500 animate-pulse">
              Please wait while we analyze your bill...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitButton;
