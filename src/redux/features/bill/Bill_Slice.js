import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  generateBillExplanation,
  getBillData,
  submitManualBillData,
  getBillHistory,
} from "./billApi";

const initialState = {
  activeTab: "upload",
  pendingImage: null,
  uploadedImage: null,
  extractedData: {},
  billExplanation: "",
  manualData: {
    units: "",
    tariffRate: "35.57",
    fuelAdjustment: "0",
    fcSurcharge: "0",
    quarterlyAdjustment: "0",
    meterRent: "1",
    serviceRent: "1",
    electricityDuty: "0",
    gst: "0",
  },
  billHistory: {
    bills: [], // Array of bill records
    loading: false, // Loading state for history fetch
    error: null, // Error state for history
    selectedBill: null, // For viewing single bill details
    stats: {
      // Aggregated statistics
      totalBills: 0,
      totalAmount: 0,
      totalUnits: 0,
      averageBill: 0,
      highestBill: 0,
      lowestBill: Infinity,
      lastBillDate: null,
    },
  },
  loading: false,
  submitting: false,
  error: null,
  success: false,
};

const calculateStats = (bills) => {
  if (!bills || bills.length === 0) {
    return {
      totalBills: 0,
      totalAmount: 0,
      totalUnits: 0,
      averageBill: 0,
      highestBill: 0,
      lowestBill: 0,
      lastBillDate: null,
    };
  }

  const amounts = bills.map((bill) => bill.totalAmount || 0);
  const units = bills.map((bill) => bill.unitsConsumed || 0);

  return {
    totalBills: bills.length,
    totalAmount: amounts.reduce((a, b) => a + b, 0),
    totalUnits: units.reduce((a, b) => a + b, 0),
    averageBill: amounts.reduce((a, b) => a + b, 0) / bills.length,
    highestBill: Math.max(...amounts),
    lowestBill: Math.min(...amounts.filter((a) => a > 0)),
    lastBillDate: bills[0]?.createdAt || null,
  };
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.error = null;
    },
    setUploadedImage: (state, action) => {
      state.uploadedImage = action.payload;
    },
    clearUploadedImage: (state) => {
      state.uploadedImage = null;
    },
    setExtractedData: (state, action) => {
      state.extractedData = action.payload;
    },
    clearExtractedData: (state) => {
      state.extractedData = {};
    },
    setManualData: (state, action) => {
      state.manualData = action.payload;
    },
    updateManualField: (state, action) => {
      const { name, value } = action.payload;
      state.manualData[name] = value;
    },
    autoFillFromExtracted: (state) => {
      if (state.extractedData.units) {
        state.manualData = {
          units: state.extractedData.units || "",
          tariffRate: state.extractedData.tariffRate || "35.57",
          fuelAdjustment: state.extractedData.fuelAdjustment || "0",
          fcSurcharge: state.extractedData.fcSurcharge || "0",
          quarterlyAdjustment: state.extractedData.quarterlyAdjustment || "0",
          meterRent: state.extractedData.meterRent || "1",
          serviceRent: state.extractedData.serviceRent || "1",
          electricityDuty: state.extractedData.electricityDuty || "0",
          gst: state.extractedData.gst || "0",
        };
      }
    },
    clearBillData: (state) => {
      state.uploadedImage = null;
      state.extractedData = {};
      state.manualData = initialState.manualData;
      state.billExplanation = "";
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    // NEW: Bill History Reducers
    setSelectedBill: (state, action) => {
      state.billHistory.selectedBill = action.payload;
    },
    clearSelectedBill: (state) => {
      state.billHistory.selectedBill = null;
    },
    clearBillHistory: (state) => {
      state.billHistory = initialState.billHistory;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBillData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBillData.fulfilled, (state, action) => {
        state.loading = false;
        state.extractedData = action.payload?.data || action.payload || {};
        state.success = true;
      })
      .addCase(getBillData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(submitManualBillData.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitManualBillData.fulfilled, (state, action) => {
        state.submitting = false;
        state.success = true;
        state.extractedData = action.payload?.data || action.payload || {};
      })
      .addCase(submitManualBillData.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(generateBillExplanation.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.billExplanation = ""; 
      })

      .addCase(generateBillExplanation.fulfilled, (state, action) => {
        state.submitting = false;
        state.billExplanation = action.payload?.data || "";
      })

      .addCase(generateBillExplanation.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getBillHistory.pending, (state) => {
        if (!state.billHistory) {
          state.billHistory = { ...initialState.billHistory };
        }
        state.billHistory.loading = true;
        state.billHistory.error = null;
      })

      .addCase(getBillHistory.fulfilled, (state, action) => {
        if (!state.billHistory) {
          state.billHistory = { ...initialState.billHistory };
        }

        state.billHistory.loading = false;
        state.billHistory.bills = action.payload || [];
        state.billHistory.stats = calculateStats(action.payload || []);
      })

      .addCase(getBillHistory.rejected, (state, action) => {
        if (!state.billHistory) {
          state.billHistory = { ...initialState.billHistory };
        }

        state.billHistory.loading = false;
        state.billHistory.error = action.payload || action.error.message;
        state.billHistory.bills = [];
      });
  },
});

export const {
  setActiveTab,
  setUploadedImage,
  clearUploadedImage,
  setExtractedData,
  clearExtractedData,
  setManualData,
  updateManualField,
  autoFillFromExtracted,
  clearBillData,
  clearError,
  resetSuccess,
  setSelectedBill, // NEW
  clearSelectedBill, // NEW
  clearBillHistory, // NEW
} = billSlice.actions;

export default billSlice.reducer;
