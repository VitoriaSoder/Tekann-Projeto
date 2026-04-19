import { apiGet, apiPost, apiPut, apiDelete, ApiCallback } from "../../services/api";
import { 
  setLoading, 
  setLista, 
  setError, 
  addCourt, 
  updateCourtInList, 
  removeCourtFromList 
} from "../store/slices/court-slice";
import type { AppDispatch } from "../store";
export function getCourtsWorker(dispatch: AppDispatch, callback?: ApiCallback): void {
  dispatch(setLoading(true));
  apiGet("/courts", function (result: any, error: any) {
    if (error) {
      dispatch(setError(error.msg || "Erro ao buscar quadras"));
      if (callback) callback(undefined, error);
      return;
    }
    dispatch(setLista(result));
    if (callback) callback(result, undefined);
  });
}
export function createCourtWorker(data: any, dispatch: AppDispatch, callback?: ApiCallback): void {
  dispatch(setLoading(true));
  apiPost("/courts", data, function (result: any, error: any) {
    if (error) {
      dispatch(setError(error.msg || "Erro ao criar quadra"));
      if (callback) callback(undefined, error);
      return;
    }
    dispatch(addCourt(result));
    dispatch(setLoading(false));
    if (callback) callback(result, undefined);
  });
}
export function updateCourtWorker(id: string, data: any, dispatch: AppDispatch, callback?: ApiCallback): void {
  dispatch(setLoading(true));
  apiPut(`/courts/${id}`, data, function (result: any, error: any) {
    if (error) {
      dispatch(setError(error.msg || "Erro ao atualizar quadra"));
      if (callback) callback(undefined, error);
      return;
    }
    dispatch(updateCourtInList(result || { ...data, id }));
    dispatch(setLoading(false));
    if (callback) callback(result, undefined);
  });
}
export function deleteCourtWorker(id: string, dispatch: AppDispatch, callback?: ApiCallback): void {
  dispatch(setLoading(true));
  apiDelete(`/courts/${id}`, function (result: any, error: any) {
    if (error) {
      dispatch(setError(error.msg || "Erro ao deletar quadra"));
      if (callback) callback(undefined, error);
      return;
    }
    dispatch(removeCourtFromList(id));
    dispatch(setLoading(false));
    if (callback) callback(result, undefined);
  });
}
