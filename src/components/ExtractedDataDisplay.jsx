import React from 'react';

const ExtractedDataDisplay = ({ extractedData }) => {
  // Check if ANY data was detected at all
  const hasAnyDetection = extractedData?.detectionStatus && 
    Object.values(extractedData.detectionStatus).some(v => v === true);

  // If absolutely nothing was detected
  if (!hasAnyDetection) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📸</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            No Data Detected
          </h3>
          <p className="text-yellow-700 mb-4">
            The image was not clear enough to extract any bill details.
          </p>
          <ul className="text-sm text-yellow-700 space-y-2 text-left bg-white/50 p-4 rounded-lg">
            <li className="flex items-start">
              <span className="mr-2">📱</span>
              Take photo in good lighting
            </li>
            <li className="flex items-start">
              <span className="mr-2">✂️</span>
              Crop image to show only the bill
            </li>
            <li className="flex items-start">
              <span className="mr-2">🖊️</span>
              Use manual entry instead
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Helper component for displaying field with "NOT FOUND" state
  const FieldRow = ({ label, value, detected, isTotal = false }) => {
    if (!detected) {
      return (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
          <span className="text-gray-600">{label}:</span>
          <span className="text-gray-400 italic text-sm">NOT FOUND</span>
        </div>
      );
    }
    
    return (
      <div className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${isTotal ? 'bg-blue-50 px-3 rounded-lg' : ''}`}>
        <span className={isTotal ? 'font-bold text-gray-800' : 'text-gray-600'}>
          {label}:
        </span>
        <span className={`font-medium ${isTotal ? 'text-xl text-blue-700' : 'text-gray-900'}`}>
          {isTotal ? `Rs ${value}` : value}
          {label === 'Units Consumed' && ' kWh'}
          {label === 'Tariff Rate' && ' /unit'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header with Company Badge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Extracted Bill Information
        </h3>
        {extractedData.company ? (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
            {extractedData.company}
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
          <span className="text-sm text-gray-600">
            ✓ {Object.values(extractedData.detectionStatus).filter(v => v).length} fields detected
          </span>
          <span className="text-xs text-gray-500">
            {Object.values(extractedData.detectionStatus).filter(v => v).length === 0 
              ? '❌ No data' 
              : '✅ Partial data'}
          </span>
        </div>
      </div>

      {/* Core Bill Information - Always show these, with NOT FOUND if missing */}
      <div className="space-y-1">
        <FieldRow 
          label="Units Consumed" 
          value={extractedData.units} 
          detected={extractedData.detectionStatus?.units} 
        />
        
        <FieldRow 
          label="Base Cost" 
          value={extractedData.baseCost ? `Rs ${extractedData.baseCost}` : ''} 
          detected={extractedData.detectionStatus?.baseCost} 
        />
        
        <FieldRow 
          label="Tariff Rate" 
          value={extractedData.tariffRate ? `Rs ${extractedData.tariffRate}` : ''} 
          detected={extractedData.detectionStatus?.tariffRate} 
        />
      </div>

      {/* Additional Charges Section */}
      {(extractedData.detectionStatus?.fuelAdjustment ||
        extractedData.detectionStatus?.fcSurcharge ||
        extractedData.detectionStatus?.quarterlyAdjustment ||
        extractedData.detectionStatus?.meterRent ||
        extractedData.detectionStatus?.serviceRent ||
        extractedData.detectionStatus?.electricityDuty ||
        extractedData.detectionStatus?.gst) && (
        <>
          <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">
            Additional Charges
          </h4>
          <div className="space-y-1">
            <FieldRow 
              label="Fuel Price Adjustment" 
              value={extractedData.fuelAdjustment ? `Rs ${extractedData.fuelAdjustment}` : ''} 
              detected={extractedData.detectionStatus?.fuelAdjustment} 
            />
            
            <FieldRow 
              label="F.C Surcharge" 
              value={extractedData.fcSurcharge ? `Rs ${extractedData.fcSurcharge}` : ''} 
              detected={extractedData.detectionStatus?.fcSurcharge} 
            />
            
            <FieldRow 
              label="Quarterly Adjustment" 
              value={extractedData.quarterlyAdjustment ? `Rs ${extractedData.quarterlyAdjustment}` : ''} 
              detected={extractedData.detectionStatus?.quarterlyAdjustment} 
            />
            
            <FieldRow 
              label="Meter Rent" 
              value={extractedData.meterRent ? `Rs ${extractedData.meterRent}` : ''} 
              detected={extractedData.detectionStatus?.meterRent} 
            />
            
            <FieldRow 
              label="Service Rent" 
              value={extractedData.serviceRent ? `Rs ${extractedData.serviceRent}` : ''} 
              detected={extractedData.detectionStatus?.serviceRent} 
            />
            
            <FieldRow 
              label="Electricity Duty" 
              value={extractedData.electricityDuty ? `Rs ${extractedData.electricityDuty}` : ''} 
              detected={extractedData.detectionStatus?.electricityDuty} 
            />
            
            <FieldRow 
              label="GST/Sales Tax" 
              value={extractedData.gst ? `Rs ${extractedData.gst}` : ''} 
              detected={extractedData.detectionStatus?.gst} 
            />
          </div>
        </>
      )}

      {/* Total Bill Amount - Most Important */}
      <div className="mt-6">
        <FieldRow 
          label="Payable Within Due Date" 
          value={extractedData.payableWithinDueDate ? `Rs ${extractedData.payableWithinDueDate}` : ''} 
          detected={extractedData.detectionStatus?.payableWithinDueDate} 
          isTotal={true}
        />
      </div>

      {/* Bill Month */}
      {extractedData.billMonth && (
        <div className="mt-3 text-xs text-gray-500 text-right">
          Bill Month: {extractedData.billMonth}
        </div>
      )}

      {/* Manual Entry Suggestion */}
      {Object.values(extractedData.detectionStatus).filter(v => v).length < 3 && (
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