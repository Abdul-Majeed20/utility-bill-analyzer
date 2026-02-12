import React from 'react';

const BreakdownTable = ({ breakdownData, formatCurrency }) => {
  const total = breakdownData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Component
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {breakdownData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div 
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {item.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                {formatCurrency(item.value)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                {((item.value / total) * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
              Total
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
              {formatCurrency(total)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
              100%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default BreakdownTable;