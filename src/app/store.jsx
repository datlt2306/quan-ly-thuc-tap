import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';
const persistConfig = {
	key: 'root',
	storage,
	blacklist: [
		'cumpus',
		'specialization',
		'students',
		'users',
		'major',
		'students',
		'narrow',
		'business',
		'time',
		'semester',
		'reviewer',
		'manager',
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

// * This is for redux query
// import { setupListeners } from '@reduxjs/toolkit/query'
// import { _authAPI } from "../features/authSlice";

// export const store = configureStore({
//   reducer: {
//     [_authAPI.reducerPath]: _authAPI.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(_authAPI.middleware),
// })

// setupListeners(store.dispatch)
