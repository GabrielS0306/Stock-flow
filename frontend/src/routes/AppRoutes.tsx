import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '@/components/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NewUserPage } from '@/pages/NewUserPage'
import { PrivateRoute } from './PrivateRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'
import { RoleRoute } from './RoleRoute'

// Mapa de URLs da aplicação. Rotas "sem path" com element agrupam as filhas sob um porteiro.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        {/* Todas as páginas logadas compartilham o cabeçalho do AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />

          {/* Só ADMIN: o mesmo padrão de porteiro, agora checando o papel */}
          <Route element={<RoleRoute roles={['ADMIN']} />}>
            <Route path="/usuarios/novo" element={<NewUserPage />} />
          </Route>
        </Route>
      </Route>

      {/* Qualquer URL desconhecida volta para o início (que manda para o login se preciso) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
