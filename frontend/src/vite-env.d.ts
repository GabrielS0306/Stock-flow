/// <reference types="vite/client" />

// Variáveis do .env expostas ao front. Só as que começam com VITE_ chegam aqui.
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
