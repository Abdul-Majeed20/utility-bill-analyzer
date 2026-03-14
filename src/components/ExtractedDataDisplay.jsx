import React from 'react';

const ExtractedDataDisplay = ({ extractedData, isProcessing }) => {
  const hasExtractedData = extractedData && Object.keys(extractedData).length > 0;

  if (!hasExtractedData) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📤</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Bill Uploaded</h3>
          <p className="text-gray-600">
            Upload a clear photo of your electricity bill to see extracted information here.
          </p>
        </div>
      </div>
    );
  }

  // Normalize data — handle both field name variants
  const company = extractedData.vendor || extractedData.company || null;
  const billMonth = extractedData.billMonth || null;
  const unitsConsumed = extractedData.unitsConsumed || extractedData.units || 0;
  const baseCost = extractedData.baseCost || 0;
  const tariffRate = extractedData.tariffRate || 0;
  const fuelAdjustment = extractedData.fuelAdjustment || 0;
  const fcSurcharge = extractedData.fcSurcharge || 0;
  const quarterlyAdjustment = extractedData.quarterlyAdjustment || 0;
  const meterRent = extractedData.meterRent || 0;
  const serviceRent = extractedData.serviceRent || 0;
  const electricityDuty = extractedData.electricityDuty || 0;
  const gst = extractedData.gst || 0;
  const totalAmount = extractedData.totalAmount || extractedData.payableWithinDueDate || 0;

  // Count detected fields
  const fields = { unitsConsumed, baseCost, tariffRate, fuelAdjustment, fcSurcharge, quarterlyAdjustment, meterRent, serviceRent, electricityDuty, gst, totalAmount };
  const detectedCount = Object.values(fields).filter(v => v > 0).length;

  if (detectedCount === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📸</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Data Detected</h3>
          <p className="text-yellow-700 mb-4">We couldn't extract bill details from this image.</p>
          <ul className="text-sm text-yellow-700 space-y-2 text-left bg-white/50 p-4 rounded-lg">
            <li>📱 Take photo in good lighting</li>
            <li>✂️ Crop image to show only the bill</li>
            <li>🖊️ Use manual entry instead</li>
          </ul>
        </div>
      </div>
    );
  }

  const FieldRow = ({ label, value, unit = '', isTotal = false }) => {
    if (!value || value === 0) {
      return (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
          <span className="text-gray-600">{label}:</span>
          <span className="text-gray-400 italic text-sm">NOT FOUND</span>
        </div>
      );
    }
    return (
      <div className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${isTotal ? 'bg-blue-50 px-3 rounded-lg mt-2' : ''}`}>
        <span className={isTotal ? 'font-bold text-gray-800' : 'text-gray-600'}>{label}:</span>
        <span className={`font-medium ${isTotal ? 'text-xl text-blue-700' : 'text-gray-900'}`}>
          {typeof value === 'number' ? `Rs ${value.toFixed(2)}` : value}{unit}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Extracted Bill Information</h3>
        {company ? (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
            {company}
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs italic">
            Company NOT FOUND
          </span>
        )}
      </div>

      {/* Detection Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">✓ {detectedCount} fields detected</span>
          <span className="text-xs text-gray-500">
            {detectedCount < 5 ? '⚠️ Partial data' : '✅ Good detection'}
          </span>
        </div>
      </div>

      {/* Core Fields */}
      <div className="space-y-1">
        <FieldRow label="Units Consumed" value={unitsConsumed} unit=" kWh" />
        <FieldRow label="Base Cost" value={baseCost} />
        <FieldRow label="Tariff Rate" value={tariffRate} unit="/unit" />
      </div>

      {/* Additional Charges */}
      {(fuelAdjustment > 0 || fcSurcharge > 0 || quarterlyAdjustment > 0 || meterRent > 0 || serviceRent > 0 || electricityDuty > 0 || gst > 0) && (
        <>
          <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Additional Charges</h4>
          <div className="space-y-1">
            <FieldRow label="Fuel Price Adjustment" value={fuelAdjustment} />
            <FieldRow label="F.C Surcharge" value={fcSurcharge} />
            <FieldRow label="Quarterly Adjustment" value={quarterlyAdjustment} />
            <FieldRow label="Meter Rent" value={meterRent} />
            <FieldRow label="Service Rent" value={serviceRent} />
            <FieldRow label="Electricity Duty" value={electricityDuty} />
            <FieldRow label="GST / Sales Tax" value={gst} />
          </div>
        </>
      )}

      {/* Total */}
      <div className="mt-4">
        <FieldRow label="Payable Within Due Date" value={totalAmount} isTotal={true} />
      </div>

      {/* Bill Month */}
      {billMonth && (
        <div className="mt-3 text-xs text-gray-500 text-right">Bill Month: {billMonth}</div>
      )}

      {detectedCount < 3 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            ⚡ Some fields could not be detected. Switch to <strong>Manual Entry</strong> for accurate data entry.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExtractedDataDisplay;