import React from 'react';

const ProcessingIndicator = ({ isProcessing, progress }) => {
  if (!isProcessing) return null;
  
  return (
    <div className="text-center py-4">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      <p className="mt-2 text-gray-600">Processing image... {progress}%</p>
      {progress > 0 && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 max-w-md mx-auto">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ProcessingIndicator;