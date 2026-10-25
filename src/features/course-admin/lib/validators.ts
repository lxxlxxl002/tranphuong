import { courseInputSchema, lessonInputSchema } from '../model/schemas'
import { COVER_ACCEPT, COVER_MAX_BYTES } from '../model/constants'
import type { CourseInput, FieldErrors, LessonInput } from '../model/types'

const collect = <T>(issues: { path: PropertyKey[]; message: string }[]): FieldErrors<T> => {
  const errors: FieldErrors<T> = {}
  for (const issue of issues) {
    const key = issue.path[0] as keyof T | undefined
    if (key != null && !errors[key]) errors[key] = issue.message
  }
  return errors
}

export const validateCourseInput = (input: CourseInput): FieldErrors<CourseInput> => {
  const r = courseInputSchema.safeParse(input)
  return r.success ? {} : collect<CourseInput>(r.error.issues)
}

export const validateLessonInput = (input: LessonInput): FieldErrors<LessonInput> => {
  const r = lessonInputSchema.safeParse(input)
  return r.success ? {} : collect<LessonInput>(r.error.issues)
}

export const validateCoverFile = (file: File): string | null => {
  if (!COVER_ACCEPT.includes(file.type)) return 'Chỉ hỗ trợ ảnh PNG, JPG hoặc WEBP'
  if (file.size > COVER_MAX_BYTES) return 'Ảnh bìa tối đa 2 MB'
  return null
}