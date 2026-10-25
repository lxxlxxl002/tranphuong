import { DEFAULT_ROLE_PERMISSIONS } from '@/shared/constants/permissions'
import { ROLE_ORDER } from '@/shared/constants/roles'
import { SYSTEM_ROLE_DESCRIPTIONS, SYSTEM_ROLE_NAMES } from '../model/constants'
import type { RoleDef } from '../model/types'

const demo: RoleDef[] = ROLE_ORDER.map((key) => ({
  key,
  name: SYSTEM_ROLE_NAMES[key],
  description: SYSTEM_ROLE_DESCRIPTIONS[key],
  system: true,
  locked: key === 'ADMIN',
  permissions: [...DEFAULT_ROLE_PERMISSIONS[key]],
  userCount: 0
}))

export const PERMISSIONS_CONFIG = {
  timeout: 20_000,
  staleTime: 60_000,
  demoDelayMs: 300,
  demo
}