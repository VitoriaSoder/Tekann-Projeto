import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'
import AppRoutes from './routes/AppRoutes'
import { HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </HelmetProvider>
  )
}
export default App

