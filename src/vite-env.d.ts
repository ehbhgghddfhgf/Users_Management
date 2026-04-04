/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_PAGE_LIMIT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
