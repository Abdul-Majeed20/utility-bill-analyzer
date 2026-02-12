import React from 'react';
import { AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const UsageAlert = ({ units }) => {
  const isHighUsage = units > 200;
  const usageLevel = units > 200 ? 'critical' : units > 100 ? 'warning' : 'normal';

  const getAlertStyles = () => {
    switch(usageLevel) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
          message: `Critical Usage Alert: ${units} kWh consumed - Significantly above average!`
        };
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          icon: <Zap className="h-6 w-6 text-orange-600" />,
          message: `High Usage Detected: ${units} kWh consumed - Above average consumption`
        };
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          message: `Normal Usage: ${units} kWh consumed - Within recommended limits`
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`${styles.bg} ${styles.border} border-l-4 rounded-lg p-4 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${styles.text}`}>
            {styles.message}
          </p>
          <div className="mt-2 flex items-center">
            <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-700 ${
                  usageLevel === 'critical' ? 'bg-red-600' : 
                  usageLevel === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((units / 60) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="ml-4 text-xs text-gray-500">
              {units > 200 ? `${units - 200} kWh above` : `${200 - units} kWh below`} average
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageAlert;