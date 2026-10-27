import { Navigate, Route, Routes } from 'react-router'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { PrivateRoute } from './PrivateRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

// Mapa de URLs da aplicação. Rotas "sem path" com element agrupam as filhas sob um porteiro.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Qualquer URL desconhecida volta para o início (que manda para o login se preciso) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
