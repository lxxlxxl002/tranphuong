import { progressClient } from './client'
import { PROGRESS_ENDPOINTS } from './endpoints'

/** Ghi nhận thời gian học (gửi định kỳ khi đang xem bài) */
export const sendStudyHeartbeat = (payload: { courseId: string; lessonId: string; seconds: number }) =>
  progressClient.mutate<void>(PROGRESS_ENDPOINTS.heartbeat, payload)