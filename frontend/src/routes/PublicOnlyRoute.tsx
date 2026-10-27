import { Navigate, Outlet } from 'react-router'
import { FullScreenLoader } from '@/components/FullScreenLoader'
import { useAuth } from '@/hooks/use-auth'

// Envolve rotas que só fazem sentido deslogado (o login): quem já entrou vai para o início.
export function PublicOnlyRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <FullScreenLoader />
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
