import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../redux/features/bill/Bill_Slice';
import { Camera, Edit3 } from 'lucide-react';

const TabNavigation = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector(state => state.bill);

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100/80 rounded-2xl">
      <button
        type="button"
        onClick={() => handleTabChange('upload')}
        className={`
          relative flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-medium text-sm sm:text-base
          transition-all duration-300 transform
          ${activeTab === 'upload' 
            ? 'bg-white text-blue-700 shadow-lg scale-[1.02]' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }
        `}
      >
        <Camera className={`h-5 w-5 ${activeTab === 'upload' ? 'text-blue-600' : 'text-gray-500'}`} />
        <span>Upload Photo</span>
        {activeTab === 'upload' && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        )}
      </button>
      
      <button
        type="button"
        onClick={() => handleTabChange('manual')}
        className={`
          relative flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-medium text-sm sm:text-base
          transition-all duration-300 transform
          ${activeTab === 'manual' 
            ? 'bg-white text-purple-700 shadow-lg scale-[1.02]' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }
        `}
      >
        <Edit3 className={`h-5 w-5 ${activeTab === 'manual' ? 'text-purple-600' : 'text-gray-500'}`} />
        <span>Manual Entry</span>
        {activeTab === 'manual' && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default TabNavigation;
