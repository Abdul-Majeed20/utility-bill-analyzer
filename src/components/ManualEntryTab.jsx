import React from 'react';
import InputField from './InputField';

const ManualEntryTab = ({ formData, errors, onInputChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Enter Bill Details (Pakistani Electricity Bill)
      </h2>
      
      <div className="space-y-6">
        {/* Essential Fields - Always Show */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-3">📊 Essential Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="units"
              name="units"
              label="Units Consumed (kWh)"
              value={formData.units}
              onChange={onInputChange}
              error={errors.units}
              placeholder="e.g., 91, 204, 140"
              type="number"
              step="any"
              min="0"
              required
            />

            <InputField
              id="tariffRate"
              name="tariffRate"
              label="Tariff Rate (Rs per unit)"
              value={formData.tariffRate}
              onChange={onInputChange}
              error={errors.tariffRate}
              placeholder="e.g., 35.57, 12.27"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        {/* Additional Charges - Common Across All Bills */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">💰 Additional Charges</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField
              id="fuelAdjustment"
              name="fuelAdjustment"
              label="Fuel Price Adjustment (FPA)"
              value={formData.fuelAdjustment}
              onChange={onInputChange}
              placeholder="e.g., 1320.72"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="fcSurcharge"
              name="fcSurcharge"
              label="F.C Surcharge"
              value={formData.fcSurcharge}
              onChange={onInputChange}
              placeholder="e.g., 293.93"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="quarterlyAdjustment"
              name="quarterlyAdjustment"
              label="Quarterly Tariff Adjustment"
              value={formData.quarterlyAdjustment}
              onChange={onInputChange}
              placeholder="e.g., 298.61"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="meterRent"
              name="meterRent"
              label="Meter Rent"
              value={formData.meterRent}
              onChange={onInputChange}
              placeholder="e.g., 1"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="serviceRent"
              name="serviceRent"
              label="Service Rent"
              value={formData.serviceRent}
              onChange={onInputChange}
              placeholder="e.g., 1"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="electricityDuty"
              name="electricityDuty"
              label="Electricity Duty"
              value={formData.electricityDuty}
              onChange={onInputChange}
              placeholder="e.g., 43"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />

            <InputField
              id="gst"
              name="gst"
              label="GST / Sales Tax"
              value={formData.gst}
              onChange={onInputChange}
              placeholder="e.g., 505"
              type="number"
              prefix="Rs"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Total Extra Charges Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-800">Total Extra Charges:</span>
            <span className="text-xl font-bold text-blue-800">
              Rs {(
                parseFloat(formData.fuelAdjustment || 0) + 
                parseFloat(formData.fcSurcharge || 0) + 
                parseFloat(formData.quarterlyAdjustment || 0) +
                parseFloat(formData.meterRent || 0) +
                parseFloat(formData.serviceRent || 0) +
                parseFloat(formData.electricityDuty || 0) +
                parseFloat(formData.gst || 0)
              ).toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            This amount will be added to your base electricity cost
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryTab;