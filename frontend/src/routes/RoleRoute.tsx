import { Outlet } from 'react-router'
import { AccessDenied } from '@/components/AccessDenied'
import { useAuth } from '@/hooks/use-auth'
import type { Role } from '@/services/auth'

type RoleRouteProps = {
  roles: Role[]
}

// Envolve rotas restritas a certos papéis. Fica DENTRO do PrivateRoute,
// então aqui o usuário já está carregado.
// Atenção: isso só melhora a experiência (esconde o que a pessoa não pode usar).
// Quem garante a segurança é o backend, que responde 403 de qualquer forma.
export function RoleRoute({ roles }: RoleRouteProps) {
  const { user } = useAuth()

  if (!user || !roles.includes(user.role)) {
    return <AccessDenied />
  }

  return <Outlet />
}
