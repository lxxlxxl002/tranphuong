import { useQuery } from '@tanstack/react-query'
import { courseService } from '../services/courseService'
import { COURSE_ADMIN_QUERY_KEYS } from '../model/constants'
import { COURSE_ADMIN_CONFIG } from '../config/course-admin.config'
import type { AdminLesson } from '../model/types'

const EMPTY: AdminLesson[] = []

export function useCourseDetail(courseId: string) {
  const query = useQuery({
    queryKey: COURSE_ADMIN_QUERY_KEYS.detail(courseId),
    queryFn: () => courseService.detail(courseId),
    enabled: !!courseId,
    staleTime: COURSE_ADMIN_CONFIG.staleTime
  })

  return {
    course: query.data?.course ?? null,
    lessons: query.data?.lessons ?? EMPTY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}