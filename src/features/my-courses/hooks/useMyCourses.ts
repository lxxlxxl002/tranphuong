import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { myCourseService } from '../services/myCourseService'
import { useMyCoursesStore } from '../state/store'
import { selectSearch, selectStatusFilter } from '../state/selectors'
import { myCoursesActions } from '../state/actions'
import { MY_COURSES_QUERY_KEYS } from '../model/constants'
import { MY_COURSES_CONFIG } from '../config/my-courses.config'

export function useMyCourses() {
  const query = useQuery({
    queryKey: MY_COURSES_QUERY_KEYS.list,
    queryFn: () => myCourseService.getMyCourses(),
    staleTime: MY_COURSES_CONFIG.staleTime
  })
  const status = useMyCoursesStore(selectStatusFilter)
  const search = useMyCoursesStore(selectSearch)

  const courses = useMemo(
    () => myCourseService.filter(query.data ?? [], status, search),
    [query.data, status, search]
  )
  const counts = useMemo(() => myCourseService.countByStatus(query.data ?? []), [query.data])

  return {
    courses,
    total: query.data?.length ?? 0,
    counts,
    status,
    search,
    setStatus: myCoursesActions.setStatus,
    setSearch: myCoursesActions.setSearch,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}