import { Navigate, Outlet, useLocation } from 'react-router'
import { FullScreenLoader } from '@/components/FullScreenLoader'
import { useAuth } from '@/hooks/use-auth'

// Envolve rotas que só fazem sentido deslogado (o login): quem já entrou é redirecionado.
export function PublicOnlyRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <FullScreenLoader />
  }

  if (status === 'authenticated') {
    // Volta para a página que a pessoa tentou abrir antes do login (guardada pelo PrivateRoute)
    const from = (location.state as { from?: string } | null)?.from ?? '/'
    return <Navigate to={from} replace />
  }

  return <Outlet />
}
