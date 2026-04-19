import { apiGet, apiPost, apiDelete, apiPatch, ApiCallback } from "../../services/api";
import {
  setLoading,
  setLista,
  setError,
  addBooking,
  updateBookingInList,
  removeBookingFromList
} from "../store/slices/booking-slice";
import type { AppDispatch } from "../store";
export function getBookingsWorker(
  dispatch: AppDispatch, 
  params?: any,
  callback?: ApiCallback
): void {
  dispatch(setLoading(true));
  const queryParams = params ? `?${new URLSearchParams(params).toString()}` : "";
  apiGet(`/bookings${queryParams}`, function (result: any, error: any) {
    if (error) {
      dispatch(setError(error.msg || "Erro ao buscar reservas"));
      if (callback) callback(undefined, error);
      return;
    }
    const data = result.data || result;
    const total = result.total || (Array.isArray(result) ? result.length : 0);
    dispatch(setLista(data));
    if (callback) callback(result, undefined);
  });
}
export function getBookingsByCourtAndDateWorker(
  courtId: string,
  date: string,
  callback: (bookings: any[]) => void
): void {
  apiGet(`/bookings/court/${courtId}/date/${date}`, function (result: any, error: any) {
    if (error) {
      callback([]);
      return;
    }
    callback(result);
  });
}
export function createBookingWorker(data: any, dispatch: AppDispatch, callback?: ApiCallback): void {
  dispatch(setLoading(true));
  apiPost("/bookings", data, function (result: any, error: any) {
    if (error) {
      dispatch(setError(error.msg || "Erro ao criar reserva"));
      if (callback) callback(undefined, error);
      return;
    }
    dispatch(addBooking(result));
    dispatch(setLoading(false));
    if (callback) callback(result, undefined);
  });
}
export function patchBookingStatusWorker(id: string, status: string, dispatch: AppDispatch, callback?: ApiCallback): void {
  dispatch(setLoading(true));
  apiPatch(`/bookings/${id}/status`, { status }, function (result: any, error: any) {
    if (error) {
      dispatch(setError(error.msg || "Erro ao atualizar reserva"));
      if (callback) callback(undefined, error);
      return;
    }
    dispatch(updateBookingInList(result));
    dispatch(setLoading(false));
    if (callback) callback(result, undefined);
  });
}
export function deleteBookingWorker(id: string, dispatch: AppDispatch, callback?: ApiCallback): void {
  dispatch(setLoading(true));
  apiDelete(`/bookings/${id}`, function (result: any, error: any) {
    if (error) {
      dispatch(setError(error.msg || "Erro ao deletar reserva"));
      if (callback) callback(undefined, error);
      return;
    }
    dispatch(removeBookingFromList(id));
    dispatch(setLoading(false));
    if (callback) callback(result, undefined);
  });
}
