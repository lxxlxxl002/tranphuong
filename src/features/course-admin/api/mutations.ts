import type { UploadPayload } from '@/shared/types/api'
import { courseAdminClient } from './client'
import { COURSE_ADMIN_ENDPOINTS as E } from './endpoints'

export const createCourseRequest = (input: Record<string, unknown>) => courseAdminClient.mutate<unknown>(E.create, { input })

export const updateCourseRequest = (courseId: string, input: Record<string, unknown>) =>
  courseAdminClient.mutate<unknown>(E.update, { courseId, input })

export const deleteCourseRequest = (courseId: string) => courseAdminClient.mutate<void>(E.remove, { courseId })

export const setCourseStatusRequest = (courseId: string, status: string) =>
  courseAdminClient.mutate<unknown>(E.setStatus, { courseId, status })

export const uploadCoverRequest = (file: UploadPayload) => courseAdminClient.mutate<unknown>(E.uploadCover, file, { timeout: 60_000 })

export const createLessonRequest = (courseId: string, input: Record<string, unknown>) =>
  courseAdminClient.mutate<unknown>(E.lessonCreate, { courseId, input })

export const updateLessonRequest = (lessonId: string, input: Record<string, unknown>) =>
  courseAdminClient.mutate<unknown>(E.lessonUpdate, { lessonId, input })

export const deleteLessonRequest = (lessonId: string) => courseAdminClient.mutate<void>(E.lessonRemove, { lessonId })

export const reorderLessonsRequest = (courseId: string, lessonIds: string[]) =>
  courseAdminClient.mutate<void>(E.lessonReorder, { courseId, lessonIds })