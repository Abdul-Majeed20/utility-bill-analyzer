import React from 'react';

const SubmitButton = ({ isProcessing, onClick }) => {
  return (
    <div className="mt-8">
      <button
        onClick={onClick}
        disabled={isProcessing}
        className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold
          ${isProcessing 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-blue-700 transition-colors'}`}
      >
        {isProcessing ? 'Processing...' : 'View Dashboard'}
      </button>
    </div>
  );
};

export default SubmitButton;