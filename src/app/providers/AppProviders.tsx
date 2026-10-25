import type { ReactNode } from 'react'
import { configureHttp } from '@/shared/api/httpClient'
import { authActions, useAuthStore } from '@/features/auth'
import { QueryProvider, queryClient } from './QueryProvider'
import { ToastProvider } from './ToastProvider'

configureHttp({
  getToken: () => useAuthStore.getState().token,
  onUnauthorized: () => {
    authActions.clearSession()
    queryClient.clear()
  }
})

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ToastProvider>{children}</ToastProvider>
    </QueryProvider>
  )
}