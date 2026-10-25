import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { AUTH_CONFIG } from '../config/auth.config'
import type { LoginInput } from '../model/types'

export function useLogin() {
  const mutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (input: LoginInput) => authService.login(input)
  })
  const loginDemo = useCallback(() => authService.loginDemo(), [])
  return { ...mutation, loginDemo, canDemo: AUTH_CONFIG.allowDemo }
}