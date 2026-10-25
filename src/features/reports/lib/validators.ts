import { isRole } from '@/shared/constants/roles'
import type { RateFilter, RoleFilter } from '../model/types'

export const isRateFilter = (v: unknown): v is RateFilter => v === 'ALL' || v === 'DONE' || v === 'PARTIAL' || v === 'NONE'

export const isRoleFilter = (v: unknown): v is RoleFilter => v === 'ALL' || isRole(v)