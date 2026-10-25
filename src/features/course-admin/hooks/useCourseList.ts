import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { courseService } from '../services/courseService'
import { useCourseAdminStore } from '../state/store'
import { selectDrawer, selectSearch, selectStatus } from '../state/selectors'
import { courseAdminActions } from '../state/actions'
import { COURSE_ADMIN_QUERY_KEYS } from '../model/constants'
import { COURSE_ADMIN_CONFIG } from '../config/course-admin.config'

export function useCourseList() {
  const query = useQuery({
    queryKey: COURSE_ADMIN_QUERY_KEYS.list,
    queryFn: () => courseService.list(),
    staleTime: COURSE_ADMIN_CONFIG.staleTime
  })
  const status = useCourseAdminStore(selectStatus)
  const search = useCourseAdminStore(selectSearch)
  const drawer = useCourseAdminStore(selectDrawer)

  const courses = useMemo(() => courseService.filter(query.data ?? [], status, search), [query.data, status, search])
  const counts = useMemo(() => courseService.countByStatus(query.data ?? []), [query.data])
  const editingCourse = useMemo(
    () => (drawer.courseId ? (query.data ?? []).find((c) => c.id === drawer.courseId) ?? null : null),
    [query.data, drawer.courseId]
  )

  return {
    courses,
    total: query.data?.length ?? 0,
    counts,
    status,
    search,
    drawer,
    editingCourse,
    ...courseAdminActions,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}