import { api } from './api'

export type Role = 'ADMIN' | 'OPERATOR'

// Formato que o backend devolve (nunca inclui a senha)
export type User = {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
  updatedAt: string
}

export async function login(email: string, password: string) {
  const { accessToken } = await api<{ accessToken: string }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  return accessToken
}

export function getMe(token: string) {
  return api<User>('/users/me', { token })
}
