import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/userService'
import { USERS_QUERY_KEYS } from '../model/constants'
import { USERS_CONFIG } from '../config/users.config'

export function useUserDetail(userId: string) {
  const query = useQuery({
    queryKey: USERS_QUERY_KEYS.detail(userId),
    queryFn: () => userService.detail(userId),
    enabled: !!userId,
    staleTime: USERS_CONFIG.staleTime
  })
  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}