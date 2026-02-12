import React, { useState, useEffect } from 'react';
import { Sliders, Target, Zap, TrendingDown, RefreshCw, Fan, Lightbulb, Thermometer, Tv } from 'lucide-react';

const InteractiveTips = ({ billData, onSimulationChange }) => {
  const [usageReduction, setUsageReduction] = useState(0);
  const [acTemp, setAcTemp] = useState(24); // Start at 24°C (recommended)
  const [ledBulbs, setLedBulbs] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(100);
  const [standbyDevices, setStandbyDevices] = useState(false);
  const [simulatedBill, setSimulatedBill] = useState(null);

  // Safely extract data with fallbacks
  const units = parseFloat(billData?.units) || 0;
  const tariffRate = parseFloat(billData?.tariffRate) || 35.57;
  const extraCharges = parseFloat(billData?.extraCharges || billData?.fuelAdjustment || 0) + 
                      parseFloat(billData?.fcSurcharge || 0) + 
                      parseFloat(billData?.quarterlyAdjustment || 0) +
                      parseFloat(billData?.meterRent || 0) +
                      parseFloat(billData?.serviceRent || 0);
  const totalBill = parseFloat(billData?.totalBill || billData?.payableWithinDueDate || 0);

  useEffect(() => {
    if (units === 0) return;

    // Calculate simulated bill based on user adjustments
    let adjustedUnits = units * (1 - usageReduction / 100);
    
    // AC temperature impact (each degree above 24°C saves ~6%)
    // In Pakistan, recommended AC temp is 24-26°C
    if (acTemp > 24) {
      const acSavings = (acTemp - 24) * 0.06;
      adjustedUnits = adjustedUnits * (1 - acSavings);
    } else if (acTemp < 24) {
      const acIncrease = (24 - acTemp) * 0.06;
      adjustedUnits = adjustedUnits * (1 + acIncrease);
    }
    
    // LED bulbs save ~75% on lighting (assume lighting is 15% of bill in Pakistan)
    if (ledBulbs) {
      const lightingSavings = 0.75 * 0.15;
      adjustedUnits = adjustedUnits * (1 - lightingSavings);
    }
    
    // Fan speed reduction (lower speed saves energy)
    if (fanSpeed < 100) {
      const fanSavings = ((100 - fanSpeed) / 100) * 0.3 * 0.08; // Fans are ~8% of bill
      adjustedUnits = adjustedUnits * (1 - fanSavings);
    }
    
    // Unplug standby devices saves ~10% on electronics (electronics are 12% of bill in Pakistan)
    if (standbyDevices) {
      adjustedUnits = adjustedUnits * (1 - (0.1 * 0.12));
    }
    
    // Calculate new bill
    const newBaseUsage = adjustedUnits * tariffRate;
    const newTaxes = (newBaseUsage + extraCharges) * 0.05; // 5% GST
    const newTotal = newBaseUsage + extraCharges + newTaxes;
    const savings = totalBill - newTotal;
    
    const newSimulatedBill = {
      units: adjustedUnits,
      baseUsage: newBaseUsage,
      taxes: newTaxes,
      total: newTotal > 0 ? newTotal : 0,
      savings: savings > 0 ? savings : 0
    };
    
    setSimulatedBill(newSimulatedBill);
    
    if (onSimulationChange) {
      onSimulationChange({
        units: adjustedUnits,
        total: newTotal > 0 ? newTotal : 0,
        savings: savings > 0 ? savings : 0
      });
    }
  }, [usageReduction, acTemp, ledBulbs, fanSpeed, standbyDevices, units, tariffRate, extraCharges, totalBill, onSimulationChange]);

  // Don't render if no bill data
  if (!billData || !billData.units) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Target className="h-5 w-5 text-green-600 mr-2" />
          Savings Simulator
        </h3>
        <p className="text-gray-500 text-center py-8">
          Upload a bill first to see potential savings
        </p>
      </div>
    );
  }

  const totalSavings = simulatedBill?.savings || 0;
  const savingsPercentage = totalBill > 0 ? ((totalSavings / totalBill) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Target className="h-5 w-5 text-green-600 mr-2" />
        بجلی بچاؤ کا تخمینہ (Savings Simulator)
      </h3>

      {/* Live Savings Counter */}
      {totalSavings > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 mb-6 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center">
              <TrendingDown className="h-4 w-4 mr-1" />
              ممکنہ بچت
            </span>
            <span className="text-2xl font-bold">Rs {totalSavings.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs opacity-90">کل بل کا {savingsPercentage}%</span>
            <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">
              {simulatedBill?.units.toFixed(0)} یونٹس
            </span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Overall Usage Reduction Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Sliders className="h-4 w-4 text-blue-500 mr-1" />
              مجموعی استعمال میں کمی:
            </label>
            <span className="text-lg font-bold text-blue-600">{usageReduction}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={usageReduction}
            onChange={(e) => setUsageReduction(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
          </div>
        </div>

        {/* AC Temperature Control - Pakistan Recommended Settings */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Thermometer className="h-4 w-4 text-blue-500 mr-1" />
            ایئر کنڈیشنر درجہ حرارت (Recommended: 24-26°C)
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">18°C (بہت ٹھنڈا)</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-blue-700">{acTemp}°C</span>
            </div>
            <span className="text-xs text-gray-600">26°C (بہترین بچت)</span>
          </div>
          <input
            type="range"
            min="18"
            max="26"
            value={acTemp}
            onChange={(e) => setAcTemp(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
          />
          <p className="text-xs text-green-600 mt-1">
            {acTemp >= 24 
              ? `${((acTemp - 24) * 6).toFixed(0)}% بچت ممکن ہے (24°C سے اوپر ہر ڈگری پر 6% بچت)` 
              : 'زیادہ ٹھنڈک = زیادہ بل'}
          </p>
        </div>

        {/* Fan Speed Control */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Fan className="h-4 w-4 text-blue-500 mr-1" />
            پنکھے کی رفتار
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">تیز</span>
            <input
              type="range"
              min="30"
              max="100"
              value={fanSpeed}
              onChange={(e) => setFanSpeed(Number(e.target.value))}
              className="w-2/3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-xs text-gray-600">آہستہ</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 text-center">
            رفتار: {fanSpeed}% | {fanSpeed < 100 ? `${((100 - fanSpeed) * 0.24).toFixed(1)}% بچت` : 'پوری رفتار'}
          </p>
        </div>

        {/* Toggle Switches */}
        <div className="border-t pt-4 space-y-4">
          {/* LED Bulbs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className={`h-4 w-4 ${ledBulbs ? 'text-yellow-500' : 'text-gray-400'}`} />
              <div>
                <h4 className="text-sm font-medium text-gray-700">LED بلب استعمال کریں</h4>
                <p className="text-xs text-gray-500">75% بجلی کی بچت (روشنی میں)</p>
              </div>
            </div>
            <button
              onClick={() => setLedBulbs(!ledBulbs)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                ledBulbs ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  ledBulbs ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Unplug Standby Devices */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tv className={`h-4 w-4 ${standbyDevices ? 'text-purple-500' : 'text-gray-400'}`} />
              <div>
                <h4 className="text-sm font-medium text-gray-700">اسٹینڈ بے آلات بند کریں</h4>
                <p className="text-xs text-gray-500">TV, چارجر، کمپیوٹر مکمل بند کریں</p>
              </div>
            </div>
            <button
              onClick={() => setStandbyDevices(!standbyDevices)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                standbyDevices ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  standbyDevices ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Savings Summary */}
        {simulatedBill && simulatedBill.savings > 0 && (
          <div className="border-t pt-4 mt-2">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-5">
              <div className="text-center mb-3">
                <span className="text-sm font-medium text-green-800 bg-white/60 px-3 py-1 rounded-full">
                  📊 تخمینہ شدہ بچت
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-600">نیا بل</p>
                  <p className="text-base font-bold text-green-700">Rs {simulatedBill.total.toFixed(2)}</p>
                </div>
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-600">بچت</p>
                  <p className="text-base font-bold text-green-700">Rs {simulatedBill.savings.toFixed(2)}</p>
                </div>
                <div className="bg-white/80 rounded-lg p-2 text-center col-span-2">
                  <p className="text-xs text-gray-600">استعمال شدہ یونٹس</p>
                  <p className="text-sm font-semibold text-gray-800">{simulatedBill.units.toFixed(0)} kWh</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={() => {
            setUsageReduction(0);
            setAcTemp(24);
            setLedBulbs(false);
            setFanSpeed(100);
            setStandbyDevices(false);
          }}
          className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          <span>دوبارہ سیٹ کریں (Reset)</span>
        </button>
      </div>
    </div>
  );
};

export default InteractiveTips;