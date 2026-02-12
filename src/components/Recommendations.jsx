import React from 'react';
import {
  Lightbulb,
  Clock,
  Thermometer,
  WashingMachine,
  Tv,
  ChevronRight
} from 'lucide-react';

const Recommendations = ({ units, totalBill }) => {
  const recommendations = [
    {
      icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
      title: 'Switch to LED Bulbs',
      description: 'Replace traditional bulbs with LEDs to save up to 75% energy',
      saving: '~₹500/month'
    },
    {
      icon: <Thermometer className="h-5 w-5 text-blue-500" />,
      title: 'Optimize AC Usage',
      description: 'Set AC to 24°C instead of 18°C to save 30% electricity',
      saving: '~₹800/month'
    },
    {
      icon: <Clock className="h-5 w-5 text-green-500" />,
      title: 'Use Timer for Appliances',
      description: 'Schedule appliances during off-peak hours for lower rates',
      saving: '~₹300/month'
    },
    {
      icon: <WashingMachine className="h-5 w-5 text-purple-500" />,
      title: 'Full Load Washing',
      description: 'Run washing machine only with full load',
      saving: '~₹200/month'
    },
    {
      icon: <Tv className="h-5 w-5 text-red-500" />,
      title: 'Unplug Standby Devices',
      description: 'Electronics consume power even when turned off',
      saving: '~₹150/month'
    }
  ];

  // Calculate potential savings
  const potentialSavings = totalBill * 0.2; // 20% potential savings

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
        Energy Saving Recommendations
      </h3>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-green-800 font-medium">
          💰 Potential Monthly Savings
        </p>
        <p className="text-2xl font-bold text-green-600">
          ₹{potentialSavings.toFixed(2)}
        </p>
        <p className="text-xs text-green-700 mt-1">
          Based on your current consumption of {units} kWh
        </p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="group bg-gray-50 rounded-lg p-3 hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-200"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                {rec.icon}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {rec.title}
                  </p>
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {rec.saving}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {rec.description}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default Recommendations;