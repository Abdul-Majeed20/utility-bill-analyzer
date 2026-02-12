import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';

const BillBreakdownChart = ({ breakdownData, totalBill, formatCurrency }) => {
  const [chartType, setChartType] = useState('pie');

  const COLORS = ['#3B82F6', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-blue-600">{formatCurrency(data.value)}</p>
          <p className="text-sm text-gray-500">
            {((data.value / totalBill) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={breakdownData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {breakdownData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={breakdownData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value">
          {breakdownData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Bill Breakdown</h3>
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setChartType('pie')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'pie' 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            aria-label="Pie chart"
          >
            <PieChartIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'bar' 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            aria-label="Bar chart"
          >
            <BarChartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {chartType === 'pie' ? renderPieChart() : renderBarChart()}

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Bill Amount:</span>
          <span className="text-lg font-bold text-gray-900">{formatCurrency(totalBill)}</span>
        </div>
      </div>
    </div>
  );
};

export default BillBreakdownChart;