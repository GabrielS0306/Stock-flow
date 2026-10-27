import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as authService from '@/services/auth'
import type { User } from '@/services/auth'
import { tokenStorage } from '@/services/token-storage'
import { AuthContext, type AuthStatus } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lê o token salvo uma única vez, ao abrir a aplicação
  const [token, setToken] = useState(() => tokenStorage.get())
  const [user, setUser] = useState<User | null>(null)

  // O status é calculado a partir do token e do usuário, não guardado à parte:
  // assim os três nunca ficam fora de sincronia.
  const status: AuthStatus = !token
    ? 'unauthenticated'
    : user
      ? 'authenticated'
      : 'loading'

  const logout = useCallback(() => {
    tokenStorage.clear()
    setToken(null)
    setUser(null)
  }, [])

  // Sempre que o token muda (abriu a página logado ou acabou de logar), busca o usuário.
  useEffect(() => {
    if (!token) {
      return
    }

    // Evita atualizar o estado com uma resposta antiga, se o token mudar no meio do caminho
    let active = true
    authService
      .getMe(token)
      .then((me) => {
        if (active) setUser(me)
      })
      .catch(() => {
        // Token expirado, usuário apagado ou API fora do ar: volta para o login
        if (active) logout()
      })

    return () => {
      active = false
    }
  }, [token, logout])

  const login = useCallback(async (email: string, password: string) => {
    // Se as credenciais estiverem erradas, a ApiError sobe para a tela de login exibir
    const newToken = await authService.login(email, password)
    tokenStorage.set(newToken)
    setUser(null)
    setToken(newToken)
  }, [])

  const value = useMemo(
    () => ({ status, user, token, login, logout }),
    [status, user, token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
