import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  IndianRupee,
  FileText,
  PlusCircle,
  Battery,
  Activity,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import UsageAlert from "./UsageAlert";
import BillBreakdownChart from "./BillBreakdownChart";
import SummaryCards from "./SummaryCards";
import BreakdownTable from "./BreakdownTable";
import AIExplanationPanel from "./AIExplanationPanel";
import InteractiveTips from "./InteractiveTips";
import { useSelector } from "react-redux";
import Header from "./Header";
const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { extractedData } = useSelector((state) => state.bill);

  // Use redux extractedData OR location.state (whichever is available)
  const rawData = extractedData || location.state?.billData;

  console.log("Dashboard - rawData:", rawData);

  // If no data, redirect to home
  if (!rawData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No Bill Data Found
          </h2>
          <p className="text-gray-600 mb-6">
            Please upload a bill or enter details first.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const billData = {
    company: rawData.vendor || rawData.company || "",
    billMonth: rawData.billMonth || "",
    units: rawData.unitsConsumed || rawData.units || 0, // API sends unitsConsumed
    tariffRate: rawData.tariffRate || 0,
    baseCost: rawData.baseCost || 0,
    fuelAdjustment: rawData.fuelAdjustment || 0,
    fcSurcharge: rawData.fcSurcharge || 0,
    quarterlyAdjustment: rawData.quarterlyAdjustment || 0,
    meterRent: rawData.meterRent || 0,
    serviceRent: rawData.serviceRent || 0,
    electricityDuty: rawData.electricityDuty || 0,
    gst: rawData.gst || 0,
    payableWithinDueDate:
      rawData.totalAmount || rawData.payableWithinDueDate || 0,
    billId: rawData._id || null, // Include bill ID if available
  };

  // SAFELY extract values - use what was ACTUALLY detected, NO HARDCODED FALLBACKS!
  const units = parseFloat(billData?.units) || 0;
  const tariffRate = parseFloat(billData?.tariffRate) || 0;

  // Extract charges only if they exist in the bill data
  const fuelAdjustment = parseFloat(billData?.fuelAdjustment) || 0;
  const fcSurcharge = parseFloat(billData?.fcSurcharge) || 0;
  const quarterlyAdjustment = parseFloat(billData?.quarterlyAdjustment) || 0;
  const meterRent = parseFloat(billData?.meterRent) || 0;
  const serviceRent = parseFloat(billData?.serviceRent) || 0;

  // Get the actual payable amount from the bill - THIS IS THE REAL TOTAL!
  const payableAmount =
    parseFloat(billData?.payableWithinDueDate || billData?.totalCharges) || 0;

  // Calculate bill components only if we have valid data
  let baseUsage = 0;
  let totalExtraCharges = 0;
  let taxes = 0;
  let totalBill = 0;

  if (units > 0 && tariffRate > 0) {
    baseUsage = units * tariffRate;
    totalExtraCharges =
      fuelAdjustment +
      fcSurcharge +
      quarterlyAdjustment +
      meterRent +
      serviceRent;
    const taxRate = 0.05; // 5% tax
    taxes = (baseUsage + totalExtraCharges) * taxRate;
    totalBill = baseUsage + totalExtraCharges + taxes;
  }

  // Use the ACTUAL payable amount from the bill if available (more accurate)
  if (payableAmount > 0) {
    totalBill = payableAmount;
  }

  // Format currency
  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "Rs 0.00";
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Prepare data for charts - ONLY include items with value > 0
  const breakdownData = [
    ...(baseUsage > 0
      ? [{ name: "Base Usage", value: baseUsage, color: "#3B82F6" }]
      : []),
    ...(taxes > 0
      ? [{ name: "Taxes (5%)", value: taxes, color: "#F59E0B" }]
      : []),
    ...(totalExtraCharges > 0
      ? [{ name: "Extra Charges", value: totalExtraCharges, color: "#EF4444" }]
      : []),
  ];

  const detailedBreakdownData = [
    ...(baseUsage > 0
      ? [{ name: "Base Electricity Cost", value: baseUsage, color: "#3B82F6" }]
      : []),
    ...(fuelAdjustment > 0
      ? [
          {
            name: "Fuel Price Adjustment",
            value: fuelAdjustment,
            color: "#8B5CF6",
          },
        ]
      : []),
    ...(fcSurcharge > 0
      ? [{ name: "FC Surcharge", value: fcSurcharge, color: "#EC4899" }]
      : []),
    ...(quarterlyAdjustment > 0
      ? [
          {
            name: "Quarterly Adjustment",
            value: quarterlyAdjustment,
            color: "#14B8A6",
          },
        ]
      : []),
    ...(meterRent > 0
      ? [{ name: "Meter Rent", value: meterRent, color: "#F97316" }]
      : []),
    ...(serviceRent > 0
      ? [{ name: "Service Rent", value: serviceRent, color: "#6B7280" }]
      : []),
    ...(taxes > 0
      ? [{ name: "Taxes (5%)", value: taxes, color: "#F59E0B" }]
      : []),
  ];

  const summaryData = {
    units,
    baseUsage,
    extraCharges: totalExtraCharges,
    taxes,
    totalBill,
    averageRatePerUnit: units > 0 ? totalBill / units : 0,
    percentageChange: units > 0 ? (((units - 30) / 30) * 100).toFixed(1) : 0,
  };

  const [simulatedBill, setSimulatedBill] = useState(null);

  // Show warning if essential data is missing
  const hasEssentialData = units > 0 && (tariffRate > 0 || payableAmount > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <Header />
      {/* <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Zap className="h-6 w-6 text-yellow-500 mr-2" />
                  Pakistani Electricity Bill Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {billData?.company || "Electricity Bill"} - Bill Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-lg font-semibold text-blue-700">
                {formatCurrency(simulatedBill?.total || totalBill)}
              </span>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Missing Data Warning */}
        {!hasEssentialData && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Incomplete Bill Data
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Some essential information could not be extracted from your
                  bill. Please switch to manual entry for accurate analysis.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-2 text-sm bg-white text-yellow-800 px-3 py-1.5 rounded-lg hover:bg-yellow-50 transition-colors"
                >
                  ← Go Back to Manual Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* High Usage Alert - Only show if we have units */}
        {units > 0 && <UsageAlert units={simulatedBill?.units || units} />}

        {/* Summary Cards Row - Only show if we have data */}
        {units > 0 && (
          <div className="mt-6">
            <SummaryCards
              summaryData={{
                ...summaryData,
                totalBill: simulatedBill?.total || totalBill,
                units: simulatedBill?.units || units,
              }}
              formatCurrency={formatCurrency}
            />
          </div>
        )}

        {/* Charts and Analysis Section - Only show if we have breakdown data */}
        {breakdownData.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bill Breakdown Chart */}
            <div className="lg:col-span-2">
              <BillBreakdownChart
                breakdownData={breakdownData}
                totalBill={simulatedBill?.total || totalBill}
                formatCurrency={formatCurrency}
              />
            </div>

            {/* Quick Stats Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Activity className="h-5 w-5 text-blue-500 mr-2" />
                  Consumption Analysis
                </h3>
                <div className="space-y-4">
                  {units > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Units Consumed
                        </span>
                        <span className="text-lg font-bold text-blue-700">
                          {(simulatedBill?.units || units).toFixed(0)} kWh
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(((simulatedBill?.units || units) / 50) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {(simulatedBill?.units || units) > 30
                          ? `⚠ ${((simulatedBill?.units || units) - 30).toFixed(0)} kWh above average`
                          : `✓ ${(30 - (simulatedBill?.units || units)).toFixed(0)} kWh below average`}
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Rate Analysis
                    </h4>
                    <div className="space-y-2">
                      {tariffRate > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tariff Rate:</span>
                          <span className="font-medium">
                            Rs {tariffRate.toFixed(2)}/unit
                          </span>
                        </div>
                      )}
                      {units > 0 && totalBill > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Effective Rate:</span>
                          <span className="font-medium">
                            Rs {(totalBill / units).toFixed(2)}/unit
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {simulatedBill && simulatedBill.savings > 0 && (
                    <div className="border-t pt-4">
                      <div className="bg-green-100 rounded-lg p-3">
                        <div className="flex items-center text-green-800">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">
                            Savings: {formatCurrency(simulatedBill.savings)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Breakdown Section - Only show if we have detailed data */}
        {detailedBreakdownData.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detailed Breakdown Table */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                Detailed Bill Breakdown{" "}
                {billData?.company ? `(${billData.company})` : ""}
              </h3>
              <BreakdownTable
                breakdownData={detailedBreakdownData}
                formatCurrency={formatCurrency}
              />
            </div>

            {/* Interactive Tips - Only show if we have units */}
            {units > 0 && (
              <div>
                <InteractiveTips
                  billData={{
                    ...billData,
                    totalBill,
                    units,
                    tariffRate: tariffRate || 35.57,
                    extraCharges: totalExtraCharges,
                  }}
                  onSimulationChange={setSimulatedBill}
                />
              </div>
            )}
          </div>
        )}

        {/* AI Explanation Panel - Only show if we have essential data */}
        {hasEssentialData && (
          <div className="mt-8">
            <AIExplanationPanel
              billData={{
                ...billData,
                units,
                tariffRate: tariffRate || 35.57,
                totalBill: simulatedBill?.total || totalBill,
                fuelAdjustment,
                fcSurcharge,
                quarterlyAdjustment,
                extraCharges: totalExtraCharges,
                company: billData?.company || "LESCO",
              }}
              formatCurrency={formatCurrency}
            />
          </div>
        )}

        {/* New Bill Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Analyze New Bill</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
