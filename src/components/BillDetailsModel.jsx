import React from 'react';
import {
  X,
  Zap,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const BillDetailsModal = ({ bill, onClose, formatCurrency }) => {
  if (!bill) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUsageStatus = (units) => {
    if (units > 50) return { text: 'Very High', color: 'red', icon: TrendingUp };
    if (units > 30) return { text: 'High', color: 'orange', icon: TrendingUp };
    if (units > 15) return { text: 'Normal', color: 'green', icon: TrendingDown };
    return { text: 'Low', color: 'blue', icon: TrendingDown };
  };

  const status = getUsageStatus(bill.units || 0);
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sticky top-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Bill Details
            </h2>
            <button
              onClick={onClose}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-xl hover:bg-white/30 transition-all"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {bill.company || 'Electricity Bill'}
              </h3>
              <p className="text-gray-500 flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(bill.billMonth || bill.createdAt)}
              </p>
            </div>
            <div className={`bg-${status.color}-100 px-4 py-2 rounded-xl`}>
              <p className={`text-${status.color}-600 font-medium flex items-center`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {status.text} Usage
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <Zap className="h-5 w-5 text-blue-600 mb-2" />
              <p className="text-xs text-gray-500">Units Consumed</p>
              <p className="text-xl font-bold text-gray-900">{bill.unitsConsumed || 0} kWh</p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4">
              <DollarSign className="h-5 w-5 text-green-600 mb-2" />
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(bill.totalAmount)}
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4">
              <Clock className="h-5 w-5 text-purple-600 mb-2" />
              <p className="text-xs text-gray-500">Tariff Rate</p>
              <p className="text-xl font-bold text-gray-900">
                Rs {Math.round(bill?.tariffRate) || '35.57'}/unit
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-4">
              <TrendingUp className="h-5 w-5 text-orange-600 mb-2" />
              <p className="text-xs text-gray-500">Avg. Rate</p>
              <p className="text-xl font-bold text-gray-900">
                Rs {((bill.totalAmount || 0) / (bill.units || 1)).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
              Detailed Breakdown
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Base Electricity Cost</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(bill.baseCost || bill.units * (bill.tariffRate || 35.57))}
                </span>
              </div>
              
              {bill.fuelAdjustment > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Fuel Price Adjustment (FPA)</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(bill.fuelAdjustment)}
                  </span>
                </div>
              )}
              
              {bill.fcSurcharge > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">FC Surcharge</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(bill.fcSurcharge)}
                  </span>
                </div>
              )}
              
              {bill.quarterlyAdjustment > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Quarterly Adjustment</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(bill.quarterlyAdjustment)}
                  </span>
                </div>
              )}
              
              {bill.meterRent > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Meter Rent</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(bill.meterRent)}
                  </span>
                </div>
              )}
              
              {bill.serviceRent > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Service Rent</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(bill.serviceRent)}
                  </span>
                </div>
              )}
              
              {bill.electricityDuty > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Electricity Duty</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(bill.electricityDuty)}
                  </span>
                </div>
              )}
              
              {bill.gst > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">GST / Sales Tax</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(bill.gst)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-3 mt-2 bg-blue-50 rounded-lg px-3">
                <span className="font-bold text-gray-800">Total Payable</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(bill.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* AI Explanation (if available) */}
          {bill.explanation && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <span className="bg-purple-600 rounded-lg p-1 mr-2">
                  <span className="text-white text-xs">AI</span>
                </span>
                AI Analysis
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {bill.explanation}
              </p>
            </div>
          )}

          {/* Savings Tip */}
          {bill.savedAmount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">
                    You saved {formatCurrency(bill.savedAmount)} on this bill!
                  </h4>
                  <p className="text-xs text-green-700 mt-1">
                    Great job following our energy-saving tips. Keep it up!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetailsModal;