import type { CourseStatus, StatusFilter } from '../model/types'

const STATUSES: CourseStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']

export const isCourseStatus = (v: unknown): v is CourseStatus => typeof v === 'string' && STATUSES.includes(v as CourseStatus)

export const isStatusFilter = (v: unknown): v is StatusFilter => v === 'ALL' || isCourseStatus(v)