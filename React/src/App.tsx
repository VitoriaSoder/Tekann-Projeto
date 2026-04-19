import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'
import AppRoutes from './routes/AppRoutes'
function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  )
}
export default App
