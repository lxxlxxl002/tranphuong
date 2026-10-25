import { storage, STORAGE_KEYS } from '@/shared/lib/storage'
import type { PermissionKey } from '@/shared/constants/permissions'
import { useAuthStore } from './store'
import type { PersistedSession, Session, SessionUser } from '../model/types'

const persist = (user: SessionUser, permissions: PermissionKey[]) =>
  storage.set<PersistedSession>(STORAGE_KEYS.user, { user, permissions })

export const authActions = {
  setSession(session: Session, remember = true) {
    useAuthStore.setState({
      token: session.token,
      user: session.user,
      permissions: session.permissions,
      status: 'authenticated'
    })
    if (remember) {
      storage.set(STORAGE_KEYS.token, session.token)
      persist(session.user, session.permissions)
    } else {
      storage.remove(STORAGE_KEYS.token)
      storage.remove(STORAGE_KEYS.user)
    }
  },

  updateUser(patch: Partial<SessionUser>) {
    const { user, permissions } = useAuthStore.getState()
    if (!user) return
    const next = { ...user, ...patch }
    useAuthStore.setState({ user: next })
    if (storage.get(STORAGE_KEYS.user)) persist(next, permissions)
  },

  setPermissions(permissions: PermissionKey[]) {
    const { user } = useAuthStore.getState()
    useAuthStore.setState({ permissions })
    if (user && storage.get(STORAGE_KEYS.user)) persist(user, permissions)
  },

  clearSession() {
    useAuthStore.setState({ token: null, user: null, permissions: [], status: 'unauthenticated' })
    storage.remove(STORAGE_KEYS.token)
    storage.remove(STORAGE_KEYS.user)
  }
}