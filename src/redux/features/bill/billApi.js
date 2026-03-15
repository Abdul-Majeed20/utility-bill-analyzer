import { createAsyncThunk } from "@reduxjs/toolkit";

let API_BASE_URL = import.meta.env.VITE_BILL_API || "http://localhost:3000/api/v1/bill";
// OCR bill data from image upload
export const getBillData = createAsyncThunk(
  "bill/getBillData",
  async (billImage, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", billImage);

      const response = await fetch(
        `${API_BASE_URL}/get-bill-data`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const data = await response.json(); // 👈 always parse

      if (!response.ok) {
        // 👇 use backend message
        return rejectWithValue(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Submit manual bill data
export const submitManualBillData = createAsyncThunk(
  "bill/submitManualBillData",
  async (billData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analyze-manual`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(billData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit manual bill data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Ai Analysis of manually entered bill data
export const generateBillExplanation = createAsyncThunk(
  "bill/generateExplanation",
  async (billData, { rejectWithValue }) => {
    try {
      console.log("Submitting bill data for explanation:", billData);
      const response = await fetch(
        `${API_BASE_URL}/generate-explanation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(billData),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to analyze manual bill data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);


// GET BILL HISTORY - Fetch user's bill history
export const getBillHistory = createAsyncThunk(
  "bill/getBillHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/history`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch bill history");
      }

      return data.data; // Return the bills array
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);