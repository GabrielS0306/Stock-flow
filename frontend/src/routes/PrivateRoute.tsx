import { Navigate, Outlet, useLocation } from 'react-router'
import { FullScreenLoader } from '@/components/FullScreenLoader'
import { useAuth } from '@/hooks/use-auth'

// Envolve as rotas que exigem login.
export function PrivateRoute() {
  const { status } = useAuth()
  const location = useLocation()

  // Ainda conferindo o token salvo: não decide nada para não "piscar" a tela de login
  if (status === 'loading') {
    return <FullScreenLoader />
  }

  if (status === 'unauthenticated') {
    // Guarda a página que a pessoa tentou abrir, para voltar a ela depois do login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // Outlet = "renderize aqui a rota filha que combinou com a URL"
  return <Outlet />
}
