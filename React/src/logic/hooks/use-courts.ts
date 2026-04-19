import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  getCourtsWorker,
  createCourtWorker,
  updateCourtWorker,
  deleteCourtWorker,
} from "../workers/court-worker";
import type { ApiCallback } from "../../services/api";
export function useCourts() {
  const dispatch = useDispatch<AppDispatch>();
  const courtsState = useSelector(function (state: RootState) {
    return state.courts;
  });
  return {
    courts: courtsState.lista,
    isLoading: courtsState.load,
    total: courtsState.total,
    error: courtsState.error,
    getCourts: function (callback?: ApiCallback) {
      getCourtsWorker(dispatch, callback);
    },
    createCourt: function (data: any, callback?: ApiCallback) {
      createCourtWorker(data, dispatch, callback);
    },
    updateCourt: function (id: string, data: any, callback?: ApiCallback) {
      updateCourtWorker(id, data, dispatch, callback);
    },
    deleteCourt: function (id: string, callback?: ApiCallback) {
      deleteCourtWorker(id, dispatch, callback);
    },
  };
}
