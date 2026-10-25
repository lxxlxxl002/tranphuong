import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { PATHS } from '@/app/router/paths'
import { authService } from '../services/authService'

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => authService.logout(),
    onSettled: () => {
      queryClient.clear()
      navigate(PATHS.login, { replace: true })
    }
  })
}