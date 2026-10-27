import { api } from './api'
import type { Role, User } from './auth'

export type CreateUserInput = {
  name: string
  email: string
  password: string
  role: Role
}

// Só ADMIN consegue: o backend responde 403 para qualquer outro papel
export function createUser(token: string, data: CreateUserInput) {
  return api<User>('/users', { method: 'POST', body: data, token })
}
