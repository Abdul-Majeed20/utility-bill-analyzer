import React from 'react';
import { Zap, IndianRupee, TrendingUp, Battery } from 'lucide-react';

const SummaryCards = ({ summaryData, formatCurrency }) => {
  const {
    units,
    baseUsage,
    extraCharges,
    taxes,
    totalBill,
    averageRatePerUnit,
    percentageChange
  } = summaryData;

  const cards = [
    {
      title: 'Units Consumed',
      value: `${units} kWh`,
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      subtitle: `${percentageChange}% vs threshold`
    },
    {
      title: 'Base Usage',
      value: formatCurrency(baseUsage),
      icon: <Battery className="h-6 w-6 text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      subtitle: `${units} kWh × ${(baseUsage/units).toFixed(2)}/kWh`
    },
    {
      title: 'Taxes (5%)',
      value: formatCurrency(taxes),
      icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      subtitle: '5% of (base + extra)'
    },
    {
      title: 'Extra Charges',
      value: formatCurrency(extraCharges),
      icon:  <p className="h-6 w-6 text-red-500 font-bold">PKR</p>,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      subtitle: 'Additional fees & surcharges'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.borderColor} border rounded-xl p-6 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 ${card.bgColor} rounded-lg`}>
              {card.icon}
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {card.title}
            </span>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${card.textColor}`}>
              {card.value}
            </p>
            <p className="text-xs text-gray-600">
              {card.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;