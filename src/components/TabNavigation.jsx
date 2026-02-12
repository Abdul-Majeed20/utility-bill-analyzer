import React from 'react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200 mb-8">
      <button
        className={`px-6 py-3 font-medium text-sm sm:text-base transition-colors
          ${activeTab === 'upload' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        onClick={() => onTabChange('upload')}
      >
        Upload Photo
      </button>
      <button
        className={`px-6 py-3 font-medium text-sm sm:text-base transition-colors
          ${activeTab === 'manual' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        onClick={() => onTabChange('manual')}
      >
        Manual Entry
      </button>
    </div>
  );
};

export default TabNavigation;