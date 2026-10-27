import { Loader2Icon } from 'lucide-react'

export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2Icon
        className="size-8 animate-spin text-muted-foreground"
        aria-label="Carregando"
      />
    </div>
  )
}
