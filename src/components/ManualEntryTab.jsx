import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateManualField, autoFillFromExtracted } from '../redux/features/bill/Bill_Slice';
import InputField from './InputField';

const ManualEntryTab = () => {
  const dispatch = useDispatch();
  const { manualData, extractedData, loading, error } = useSelector(state => state.bill);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateManualField({ name, value }));
  };

  // Calculate total extra charges
  const totalExtraCharges = (
    parseFloat(manualData.fuelAdjustment || 0) + 
    parseFloat(manualData.fcSurcharge || 0) + 
    parseFloat(manualData.quarterlyAdjustment || 0) +
    parseFloat(manualData.meterRent || 0) +
    parseFloat(manualData.serviceRent || 0) +
    parseFloat(manualData.electricityDuty || 0) +
    parseFloat(manualData.gst || 0)
  ).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Bill Details
        </h2>
        <p className="text-gray-600">
          Fill in the details from your Pakistani electricity bill
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Essential Information Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Essential Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="units"
              name="units"
              label="Units Consumed (kWh)"
              value={manualData.units}
              onChange={handleInputChange}
              placeholder="e.g., 91, 204, 140"
              type="number"
              step="any"
              min="0"
              required
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />

            <InputField
              id="tariffRate"
              name="tariffRate"
              label="Tariff Rate (Rs per unit)"
              value={manualData.tariffRate}
              onChange={handleInputChange}
              placeholder="e.g., 35.57"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
              required
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Additional Charges Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-purple-600 rounded-lg p-1.5">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Additional Charges</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField
              id="fuelAdjustment"
              name="fuelAdjustment"
              label="Fuel Price Adjustment (FPA)"
              value={manualData.fuelAdjustment}
              onChange={handleInputChange}
              placeholder="1320.72"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="fcSurcharge"
              name="fcSurcharge"
              label="F.C Surcharge"
              value={manualData.fcSurcharge}
              onChange={handleInputChange}
              placeholder="293.93"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="quarterlyAdjustment"
              name="quarterlyAdjustment"
              label="Quarterly Adjustment"
              value={manualData.quarterlyAdjustment}
              onChange={handleInputChange}
              placeholder="298.61"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="meterRent"
              name="meterRent"
              label="Meter Rent"
              value={manualData.meterRent}
              onChange={handleInputChange}
              placeholder="1"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="serviceRent"
              name="serviceRent"
              label="Service Rent"
              value={manualData.serviceRent}
              onChange={handleInputChange}
              placeholder="1"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="electricityDuty"
              name="electricityDuty"
              label="Electricity Duty"
              value={manualData.electricityDuty}
              onChange={handleInputChange}
              placeholder="43"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="gst"
              name="gst"
              label="GST / Sales Tax"
              value={manualData.gst}
              onChange={handleInputChange}
              placeholder="505"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Total Extra Charges Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Extra Charges</p>
              <p className="text-3xl font-bold text-white">Rs {totalExtraCharges}</p>
              <p className="text-blue-100 text-xs mt-1">This amount will be added to your base electricity cost</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-start space-x-3">
            <div className="bg-amber-200 rounded-lg p-2">
              <svg className="h-5 w-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">Quick Tip</p>
              <p className="text-xs text-amber-700 mt-1">
                Most Pakistani bills include FPA (Fuel Price Adjustment) and FC Surcharge. 
                Check your bill carefully for these charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryTab;
