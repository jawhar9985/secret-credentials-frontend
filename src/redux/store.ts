import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import ReduxLogger from 'redux-logger';
import authReducer from './slices/authSlice';

// Configuration for persistence
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['auth'], // Fixed typo here
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ],
      },
    }).concat(ReduxLogger),
});

export const persistor = persistStore(store);

// Define and export RootState
export type RootState = ReturnType<typeof store.getState>;
