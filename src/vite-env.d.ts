/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_ORG_NAME: string
  readonly VITE_REQUEST_TIMEOUT: string
  readonly VITE_SUPPORT_NAME: string
  readonly VITE_SUPPORT_PHONE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}