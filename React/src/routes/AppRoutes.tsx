import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthLayout from '@/pages/auth/auth-layout'
import Login from '@/pages/auth/login'
import Register from '@/pages/auth/register'
import LandingPage from '@/pages/landing/landing-page'
import { ProtectedRoute } from '@/components/common/protected-route'
import { AppLayout } from '@/components/common/app-layout'
import DashboardPage from '@/pages/dashboard/dashboard-page'
import SchedulePage from '@/pages/schedule/schedule-page'
import CourtList from '@/pages/courts/court-list/court-list'
import CourtDetail from '@/pages/courts/court-detail/court-detail'
import ReservationPage from '@/pages/reservations/reservation-page'
import ProfilePage from '@/pages/profile/profile-page'
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/courts" element={<CourtList />} />
            <Route path="/courts/:id" element={<CourtDetail />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/reservations" element={<ReservationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default AppRoutes
