import { useState, type SubmitEvent } from 'react'
import { CircleAlertIcon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { ApiError } from '@/services/api'
import { roleLabels, type Role } from '@/services/auth'
import { createUser } from '@/services/users'

export function NewUserPage() {
  const { token, logout } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    // A página só abre logado (PrivateRoute); a checagem é para o TypeScript
    if (!token) {
      return
    }
    // Guardado antes do await: depois dele o React já não garante o event.currentTarget
    const formElement = event.currentTarget
    const form = new FormData(formElement)

    setSubmitting(true)
    setErrors([])
    try {
      const user = await createUser(token, {
        name: String(form.get('name')),
        email: String(form.get('email')),
        password: String(form.get('password')),
        role: form.get('role') as Role,
      })
      toast.success(`Usuário ${user.name} criado`)
      // Limpa o formulário para cadastrar o próximo
      formElement.reset()
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Token expirou enquanto a pessoa preenchia: volta para o login
        toast.error('Sua sessão expirou. Entre novamente.')
        logout()
        return
      }
      setErrors(
        error instanceof ApiError ? error.messages : ['Erro inesperado'],
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-xl">Novo usuário</CardTitle>
        <CardDescription>
          A pessoa vai entrar com o e-mail e a senha definidos aqui.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" maxLength={100} required autoFocus />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="off"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              // new-password: o navegador sugere uma senha forte em vez de preencher a do ADMIN
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
              aria-describedby="password-hint"
            />
            <p id="password-hint" className="text-xs text-muted-foreground">
              Entre 8 e 72 caracteres.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Papel</Label>
            {/* select nativo com o visual do Input: acessível e sem dependência extra */}
            <select
              id="role"
              name="role"
              defaultValue="OPERATOR"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {errors.length > 0 && (
            // role="alert": leitores de tela anunciam o erro assim que ele aparece
            <div
              role="alert"
              className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
              <ul className="flex flex-col gap-1">
                {errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          <Button type="submit" size="lg" disabled={submitting}>
            {submitting && <Loader2Icon className="animate-spin" />}
            {submitting ? 'Criando...' : 'Criar usuário'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
