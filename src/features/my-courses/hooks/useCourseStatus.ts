import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from '@/app/providers/ToastProvider'
import { getErrorMessage } from '@/shared/api/errors'
import { myCourseService } from '../services/myCourseService'
import { COURSE_STATUS_META, MY_COURSES_QUERY_KEYS } from '../model/constants'
import type { MyCourse } from '../model/types'

/** Trạng thái hiển thị + hành động "vào học" của một khóa */
export function useCourseStatus(course: MyCourse) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const meta = COURSE_STATUS_META[course.status]

  const open = useMutation({
    mutationFn: () => myCourseService.startCourse(course),
    onSuccess: (path) => {
      if (course.status === 'NOT_STARTED') {
        void queryClient.invalidateQueries({ queryKey: MY_COURSES_QUERY_KEYS.all })
      }
      navigate(path)
    },
    onError: (err) => toast.error(getErrorMessage(err))
  })

  return {
    ...meta,
    open: () => open.mutate(),
    isOpening: open.isPending
  }
}