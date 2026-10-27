import { LogOutIcon, PackageIcon } from 'lucide-react'
import { Outlet } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { roleLabels } from '@/services/auth'

// Estrutura comum das páginas logadas: cabeçalho fixo + conteúdo da rota atual.
export function AppLayout() {
  const { user, logout } = useAuth()

  // Só é renderizado dentro do PrivateRoute, então o usuário já foi carregado.
  // A checagem existe para o TypeScript (user é User | null no contexto).
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2 font-semibold">
            <PackageIcon className="size-5" />
            Stock Flow
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-sm sm:flex">
              <span>{user.name}</span>
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                {roleLabels[user.role]}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOutIcon />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  )
}
