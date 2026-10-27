import { ShieldAlertIcon } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function AccessDenied() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShieldAlertIcon className="size-5 text-destructive" />
          Acesso restrito
        </CardTitle>
        <CardDescription>
          Você não tem permissão para acessar esta página. Fale com um
          administrador se precisar desse acesso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Link com aparência de botão: navega sem recarregar a página.
            O cn() resolve as classes conflitantes (ex.: duas cores de borda), como o <Button> faz. */}
        <Link to="/" className={cn(buttonVariants({ variant: 'outline' }))}>
          Voltar para o início
        </Link>
      </CardContent>
    </Card>
  )
}
