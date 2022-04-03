import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
  FLUSH, PAUSE,
  PERSIST, persistReducer,
  persistStore, PURGE,
  REGISTER, REHYDRATE
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["cumpus","specialization","students", "users"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  ],
});
export default persistStore(store);
