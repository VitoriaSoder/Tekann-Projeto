import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "@/logic/store/hooks"
export function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}
