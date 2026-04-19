import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface Court {
  id: string;
  name: string;
  type: string;
  region: string;
  capacity: number;
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  isActive: boolean;
  sports?: { id: string; name: string }[];
}
export interface CourtState {
  lista: Court[];
  load: boolean;
  total: number;
  error: string | null;
}
const initialState: CourtState = {
  lista: [],
  load: false,
  total: 0,
  error: null,
};
const courtSlice = createSlice({
  name: "courts",
  initialState,
  reducers: {
    setLoading: function (state, action: PayloadAction<boolean>) {
      state.load = action.payload;
      if (action.payload) state.error = null;
    },
    setLista: function (state, action: PayloadAction<Court[]>) {
      state.lista = action.payload;
      state.total = action.payload.length;
      state.load = false;
    },
    setError: function (state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.load = false;
    },
    addCourt: function (state, action: PayloadAction<Court>) {
      state.lista.push(action.payload);
      state.total += 1;
    },
    updateCourtInList: function (state, action: PayloadAction<Court>) {
      const index = state.lista.findIndex(function (c) { return c.id === action.payload.id; });
      if (index !== -1) {
        state.lista[index] = action.payload;
      }
    },
    removeCourtFromList: function (state, action: PayloadAction<string>) {
      state.lista = state.lista.filter(function (c) { return c.id !== action.payload; });
      state.total -= 1;
    },
  },
});
export const {
  setLoading,
  setLista,
  setError,
  addCourt,
  updateCourtInList,
  removeCourtFromList,
} = courtSlice.actions;
export default courtSlice.reducer;
