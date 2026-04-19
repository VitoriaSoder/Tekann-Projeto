import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  getBookingsWorker,
  createBookingWorker,
  patchBookingStatusWorker,
  deleteBookingWorker,
} from "../workers/booking-worker";
import { setFilters, setPage } from "../store/slices/booking-slice";
import type { ApiCallback } from "../../services/api";
export function useReservations() {
  const dispatch = useDispatch<AppDispatch>();
  const bookingsState = useSelector(function (state: RootState) {
    return state.bookings;
  });
  return {
    reservations: bookingsState.lista.map(res => ({
      ...res,
      date: new Date(res.date)
    })),
    isLoading: bookingsState.load,
    total: bookingsState.total,
    error: bookingsState.error,
    filters: bookingsState.filters,
    getBookings: function (params?: any, callback?: ApiCallback) {
      getBookingsWorker(dispatch, params || bookingsState.filters, callback);
    },
    setFilters: function (filters: any) {
      dispatch(setFilters(filters));
    },
    setPage: function (page: number) {
      dispatch(setPage(page));
    },
    createReservation: function (data: any, callback?: ApiCallback) {
      createBookingWorker(data, dispatch, callback);
    },
    editReservation: function (id: string, status: string, callback?: ApiCallback) {
      patchBookingStatusWorker(id, status, dispatch, callback);
    },
    deleteReservation: function (id: string, callback?: ApiCallback) {
      deleteBookingWorker(id, dispatch, callback);
    },
  };
}
