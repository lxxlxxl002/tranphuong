import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/app/providers/ToastProvider'
import { getErrorMessage } from '@/shared/api/errors'
import { courseService } from '../services/courseService'
import { lessonService } from '../services/lessonService'
import { COURSE_ADMIN_QUERY_KEYS, RELATED_QUERY_ROOTS } from '../model/constants'
import type { CourseDetail, CourseInput, LessonInput, PublishStatus } from '../model/types'

/** Toàn bộ thao tác ghi của khóa học + bài học */
export function useCourseMutation() {
  const qc = useQueryClient()

  const refresh = useCallback(() => {
    void qc.invalidateQueries({ queryKey: COURSE_ADMIN_QUERY_KEYS.all })
    RELATED_QUERY_ROOTS.forEach((root) => void qc.invalidateQueries({ queryKey: [root] }))
  }, [qc])

  const onError = (err: unknown) => toast.error(getErrorMessage(err))
  const done = (message: string) => () => {
    toast.success(message)
    refresh()
  }

  const create = useMutation({
    mutationFn: (input: CourseInput) => courseService.create(input),
    onSuccess: done('Đã tạo khóa học'),
    onError
  })

  const update = useMutation({
    mutationFn: (v: { courseId: string; input: CourseInput }) => courseService.update(v.courseId, v.input),
    onSuccess: done('Đã lưu khóa học'),
    onError
  })

  const remove = useMutation({
    mutationFn: (courseId: string) => courseService.remove(courseId),
    onSuccess: done('Đã xóa khóa học'),
    onError
  })

  const setStatus = useMutation({
    mutationFn: (v: { courseId: string; status: PublishStatus }) => courseService.setStatus(v.courseId, v.status),
    onSuccess: (_d, v) => {
      toast.success(v.status === 'PUBLISHED' ? 'Đã xuất bản khóa học' : 'Đã cập nhật trạng thái')
      refresh()
    },
    onError
  })

  const createLesson = useMutation({
    mutationFn: (v: { courseId: string; input: LessonInput }) => lessonService.create(v.courseId, v.input),
    onSuccess: done('Đã thêm bài học'),
    onError
  })

  const updateLesson = useMutation({
    mutationFn: (v: { lessonId: string; input: LessonInput }) => lessonService.update(v.lessonId, v.input),
    onSuccess: done('Đã lưu bài học'),
    onError
  })

  const deleteLesson = useMutation({
    mutationFn: (lessonId: string) => lessonService.remove(lessonId),
    onSuccess: done('Đã xóa bài học'),
    onError
  })

  const reorder = useMutation({
    mutationFn: (v: { courseId: string; lessonIds: string[] }) => lessonService.reorder(v.courseId, v.lessonIds),
    onMutate: async (v) => {
      const key = COURSE_ADMIN_QUERY_KEYS.detail(v.courseId)
      await qc.cancelQueries({ queryKey: key })
      const snapshot = qc.getQueryData<CourseDetail>(key)
      qc.setQueryData<CourseDetail>(key, (d) => (d ? { ...d, lessons: lessonService.applyOrder(d.lessons, v.lessonIds) } : d))
      return { snapshot, key }
    },
    onError: (err, _v, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(ctx.key, ctx.snapshot)
      onError(err)
    },
    onSettled: refresh
  })

  const uploadCover = useCallback((file: File) => courseService.uploadCover(file), [])

  return {
    createCourse: create.mutateAsync,
    updateCourse: update.mutateAsync,
    deleteCourse: remove.mutateAsync,
    setStatus: setStatus.mutateAsync,
    createLesson: createLesson.mutateAsync,
    updateLesson: updateLesson.mutateAsync,
    deleteLesson: deleteLesson.mutateAsync,
    reorderLessons: reorder.mutate,
    uploadCover,
    isSavingCourse: create.isPending || update.isPending,
    isDeletingCourse: remove.isPending,
    isSettingStatus: setStatus.isPending,
    isSavingLesson: createLesson.isPending || updateLesson.isPending,
    isDeletingLesson: deleteLesson.isPending,
    isReordering: reorder.isPending
  }
}