import { configureStore } from '@reduxjs/toolkit';
import courtReducer from './slices/court-slice';
import bookingReducer from './slices/booking-slice';
import authReducer from './slices/auth-slice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    courts: courtReducer,
    bookings: bookingReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
