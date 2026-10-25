import { create } from 'zustand'
import { storage, STORAGE_KEYS } from '@/shared/lib/storage'
import type { PermissionKey } from '@/shared/constants/permissions'
import type { AuthStatus, PersistedSession, SessionUser } from '../model/types'

export interface AuthState {
  token: string | null
  user: SessionUser | null
  permissions: PermissionKey[]
  status: AuthStatus
}

const savedToken = storage.get<string>(STORAGE_KEYS.token)
const saved = storage.get<PersistedSession>(STORAGE_KEYS.user)
const hydrated = !!savedToken && !!saved?.user

export const useAuthStore = create<AuthState>(() => ({
  token: hydrated ? savedToken : null,
  user: hydrated ? (saved?.user ?? null) : null,
  permissions: hydrated ? (saved?.permissions ?? []) : [],
  status: hydrated ? 'authenticated' : 'unauthenticated'
}))