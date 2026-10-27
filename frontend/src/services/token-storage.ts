const KEY = 'stockflow:token'

// O localStorage pode estar bloqueado (aba anônima, cookies desativados) e lançar erro.
// Nesses casos o login funciona normalmente, só não sobrevive ao recarregar a página.
export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(KEY)
    } catch {
      return null
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(KEY, token)
    } catch {
      // segue só com o token em memória
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY)
    } catch {
      // nada a limpar
    }
  },
}
