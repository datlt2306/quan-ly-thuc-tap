import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
 persistReducer,
  persistStore

} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    "cumpus",
    "specialization",
    "students", 
    "users", 
    "major", 
    "students", 
    "narrow", 
    "business",
    "time",
    "semester",
    "reviewer",
    "manager"
  ],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});
export default persistStore(store);
