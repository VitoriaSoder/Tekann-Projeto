import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { getCookie } from "@/helpers/cookie-utils"

const USER_STORAGE_KEY = "auth_user"

function loadUserFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function saveUserToStorage(user: AuthUser): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

function removeUserFromStorage(): void {
  localStorage.removeItem(USER_STORAGE_KEY)
}

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

const storedToken = getCookie("token")
const storedUser = storedToken ? loadUserFromStorage() : null

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: function (state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      saveUserToStorage(action.payload.user)
    },
    clearAuth: function (state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      removeUserFromStorage()
    },
  },
})
export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
