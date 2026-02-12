import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async action
export const fetchBillData = createAsyncThunk(
  "fetchBillData", async () => {
    const result = await getBillData()
    return result
  }
)

const billSlice = createSlice({
  name: "billData",
  initialState: {
    Bill_Data: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillData.pending, (state) => {
        state.loading = true;
        state.error = null
        state.movies = []
      })
      .addCase(fetchBillData.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload || [];
      })
      .addCase(fetchBillData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default billSlice.reducer;
