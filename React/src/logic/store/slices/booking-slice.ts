import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  clientName: string;
  numberOfPeople: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}
export interface BookingState {
  lista: Booking[];
  load: boolean;
  total: number;
  error: string | null;
  filters: {
    search: string;
    page: number;
    limit: number;
    sortBy: string;
    order: "asc" | "desc";
  };
}
const initialState: BookingState = {
  lista: [],
  load: false,
  total: 0,
  error: null,
  filters: {
    search: "",
    page: 1,
    limit: 10,
    sortBy: "date",
    order: "desc",
  },
};
const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setLoading: function (state, action: PayloadAction<boolean>) {
      state.load = action.payload;
      if (action.payload) state.error = null;
    },
    setLista: function (state, action: PayloadAction<Booking[]>) {
      state.lista = action.payload;
      state.total = action.payload.length;
      state.load = false;
    },
    setError: function (state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.load = false;
    },
    addBooking: function (state, action: PayloadAction<Booking>) {
      state.lista.push(action.payload);
      state.total += 1;
    },
    updateBookingInList: function (state, action: PayloadAction<Booking>) {
      const index = state.lista.findIndex(function (b) { return b.id === action.payload.id; });
      if (index !== -1) {
        state.lista[index] = action.payload;
      }
    },
    removeBookingFromList: function (state, action: PayloadAction<string>) {
      state.lista = state.lista.filter(function (b) { return b.id !== action.payload; });
      state.total -= 1;
    },
    setFilters: function (state, action: PayloadAction<Partial<BookingState["filters"]>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: function (state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
  },
});
export const {
  setLoading,
  setLista,
  setError,
  addBooking,
  updateBookingInList,
  removeBookingFromList,
  setFilters,
  setPage,
} = bookingSlice.actions;
export default bookingSlice.reducer;
