import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

export function HomePage() {
  const { user } = useAuth()
  // Primeiro nome, para uma saudação mais natural
  const firstName = user?.name.split(' ')[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Olá, {firstName}!</CardTitle>
        <CardDescription>
          Bem-vindo ao Stock Flow. Em breve, aqui você vai gerenciar produtos e
          movimentações de estoque.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
