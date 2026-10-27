import { createContext } from 'react'
import type { User } from '@/services/auth'

// loading: existe um token, mas o usuário ainda está sendo carregado da API
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  status: AuthStatus
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// null = componente usado fora do <AuthProvider> (o useAuth avisa com um erro claro)
export const AuthContext = createContext<AuthContextValue | null>(null)
