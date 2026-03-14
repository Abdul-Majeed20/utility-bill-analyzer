import { configureStore, combineReducers } from "@reduxjs/toolkit";
import billReducer from "./features/bill/Bill_Slice";
import authReducer from "./features/auth/authSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  bill: billReducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 2,
  whitelist: ["bill", "auth"], // states to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);