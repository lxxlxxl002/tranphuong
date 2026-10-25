import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { hasPermission, type PermissionKey } from '@/shared/constants/permissions'
import { useAuthStore } from '../state/store'
import { selectIsAuthenticated, selectPermissions, selectRole, selectToken, selectUser } from '../state/selectors'
import { sessionService } from '../services/sessionService'
import { AUTH_QUERY_KEYS } from '../model/constants'
import { AUTH_CONFIG } from '../config/auth.config'

/** sync: true → định kỳ đồng bộ hồ sơ/quyền với server (gắn 1 lần ở AppLayout) */
export function useSession(options: { sync?: boolean } = {}) {
  const user = useAuthStore(selectUser)
  const role = useAuthStore(selectRole)
  const permissions = useAuthStore(selectPermissions)
  const token = useAuthStore(selectToken)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  const can = useCallback((key?: PermissionKey) => !key || hasPermission(permissions, key, role), [permissions, role])

  const query = useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: () => sessionService.sync(),
    enabled: !!options.sync && isAuthenticated && !sessionService.isDemo(token),
    staleTime: AUTH_CONFIG.sessionSyncStaleMs,
    refetchInterval: options.sync ? AUTH_CONFIG.sessionSyncStaleMs : false
  })

  return { user, role, permissions, isAuthenticated, can, isSyncing: query.isFetching }
}