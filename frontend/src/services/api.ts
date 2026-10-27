const API_URL = import.meta.env.VITE_API_URL

// Erro padronizado: as telas só precisam olhar status e messages,
// sem conhecer o formato de erro do NestJS.
export class ApiError extends Error {
  readonly status: number
  readonly messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages[0])
    this.name = 'ApiError'
    this.status = status
    this.messages = messages
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string | null
}

export async function api<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    // fetch só lança erro quando nem houve resposta (API fora do ar, sem internet, CORS)
    throw new ApiError(0, ['Não foi possível conectar ao servidor'])
  }

  // Algumas respostas não têm corpo; nesse caso data fica null
  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, extractMessages(data))
  }
  return data as T
}

// O NestJS responde erros como { message: string | string[] }.
// O ValidationPipe manda uma lista (uma mensagem por campo); os outros erros, uma string.
function extractMessages(data: unknown): string[] {
  if (data && typeof data === 'object' && 'message' in data) {
    const { message } = data
    if (Array.isArray(message)) {
      return message.map(String)
    }
    if (typeof message === 'string') {
      return [message]
    }
  }
  return ['Erro inesperado. Tente novamente.']
}
