import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state of the auth slice
const initialState = {
  accessToken: null as string | null,
  refreshToken: null as string | null,
  user: null as { isSuperAdmin: boolean } | null
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ isSuperAdmin: boolean }>) {
      state.user = action.payload;
    },
    setCredentials(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    resetCredentials(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    }
  }
});

// Export actions and reducer
export const { setUser, setCredentials, resetCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
