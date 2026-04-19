import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { getCookie } from "@/helpers/cookie-utils"
export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}
export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
}
const initialState: AuthState = {
  user: null,
  token: getCookie("token"),
  isAuthenticated: !!getCookie("token"),
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: function (state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    clearAuth: function (state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
})
export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
