import {configureStore} from "@reduxjs/toolkit"
import billSlice from "../redux/UtilityBill/Bill_Slice"
export const store = configureStore({
  reducer: {
    billData: billSlice
  }
})