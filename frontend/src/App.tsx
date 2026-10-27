import { BrowserRouter } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      {/* Onde as notificações (toast) aparecem, para a aplicação inteira */}
      <Toaster position="top-center" />
    </BrowserRouter>
  )
}
