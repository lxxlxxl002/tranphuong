import { describe, expect, it } from 'vitest'
import { resolveDocumentSource, resolveVideoSource, toggleOption } from '../../lib/utils'
import { scoringService } from '../../services/scoringService'
import { quizService } from '../../services/quizService'
import { toCourseContent } from '../../adapters/lessonAdapter'
import type { CourseContent, QuizQuestion } from '../../model/types'

const DRIVE_ID = '1AbCdEfGhIjKlMnOpQrStUvWxYz012345'

describe('Nguồn video / tài liệu', () => {
  it('Google Drive → preview', () => {
    expect(resolveVideoSource(`https://drive.google.com/file/d/${DRIVE_ID}/view?usp=sharing`)).toEqual({
      kind: 'drive',
      src: `https://drive.google.com/file/d/${DRIVE_ID}/preview`
    })
    expect(resolveVideoSource(DRIVE_ID).kind).toBe('drive')
  })

  it('YouTube / file / rỗng', () => {
    expect(resolveVideoSource('https://youtu.be/dQw4w9WgXcQ').kind).toBe('youtube')
    expect(resolveVideoSource('https://cdn.example.com/bai-1.mp4')).toEqual({ kind: 'file', src: 'https://cdn.example.com/bai-1.mp4' })
    expect(resolveVideoSource('  ')).toEqual({ kind: 'none', src: null })
  })

  it('Tài liệu Drive dạng open?id=', () => {
    expect(resolveDocumentSource(`https://drive.google.com/open?id=${DRIVE_ID}`)).toBe(`https://drive.google.com/file/d/${DRIVE_ID}/preview`)
    expect(resolveDocumentSource(null)).toBeNull()
  })
})

describe('toggleOption', () => {
  it('1 đáp án thay thế, nhiều đáp án bật/tắt', () => {
    expect(toggleOption(['a'], 'b', false)).toEqual(['b'])
    expect(toggleOption(['a'], 'b', true)).toEqual(['a', 'b'])
    expect(toggleOption(['a', 'b'], 'a', true)).toEqual(['b'])
  })
})

describe('scoringService', () => {
  const questions: QuizQuestion[] = [
    { id: 'q1', text: '', type: 'SINGLE', options: [] },
    { id: 'q2', text: '', type: 'MULTIPLE', options: [] }
  ]
  const key = { q1: ['a'], q2: ['x', 'y'] }

  it('câu nhiều đáp án phải chọn đủ', () => {
    expect(scoringService.grade(questions, { q1: ['a'], q2: ['x'] }, key, 70)).toEqual({ correctCount: 1, total: 2, score: 50, passed: false })
    expect(scoringService.grade(questions, { q1: ['a'], q2: ['y', 'x'] }, key, 70).passed).toBe(true)
    expect(scoringService.unanswered(questions, { q1: ['a'] })).toEqual(['q2'])
  })
})

describe('lessonAdapter', () => {
  it('suy ra loại bài, sắp thứ tự, tiêu đề + điểm đạt mặc định', () => {
    const c = toCourseContent({
      course: { id: 5, title: 'CÔNG TÁC GIÁM SÁT' },
      lessons: [
        { id: 'b', order: 2, title: 'Bài B', document_url: 'https://x.vn/y.pdf', completed: 'x' },
        { id: 'a', order: 1, title: 'Bài A', video_url: 'https://youtu.be/dQw4w9WgXcQ', duration_sec: '600' }
      ],
      quiz: { id: 'q', question_count: '1', duration_min: 10 }
    })
    expect(c.lessons.map((l) => l.id)).toEqual(['a', 'b'])
    expect(c.lessons[0].type).toBe('VIDEO')
    expect(c.lessons[1].type).toBe('DOCUMENT')
    expect(c.lessons[1].completed).toBe(true)
    expect(c.quiz?.title).toBe('Bài kiểm tra: CÔNG TÁC GIÁM SÁT')
    expect(c.quiz?.passScore).toBe(70)
  })
})

describe('quizService.checkEligibility', () => {
  const base: CourseContent = {
    courseId: 'c',
    title: 'C',
    description: null,
    lessons: [
      { id: 'l1', order: 1, title: 'L1', type: 'TEXT', durationSec: 0, videoUrl: null, documentUrl: null, content: null, completed: true },
      { id: 'l2', order: 2, title: 'L2', type: 'TEXT', durationSec: 0, videoUrl: null, documentUrl: null, content: null, completed: false }
    ],
    quiz: { id: 'q', title: 'Q', questionCount: 5, durationMin: 10, passScore: 70, maxAttempts: 3, attemptsUsed: 0, bestScore: null }
  }

  it('chưa học xong → khóa', () => {
    expect(quizService.checkEligibility(base)).toEqual({ ok: false, reason: 'Hoàn thành 1 bài học còn lại để mở bài kiểm tra' })
  })

  it('học xong → mở; hết lượt → khóa', () => {
    const done = { ...base, lessons: base.lessons.map((l) => ({ ...l, completed: true })) }
    expect(quizService.checkEligibility(done).ok).toBe(true)
    expect(quizService.checkEligibility({ ...done, quiz: { ...done.quiz!, attemptsUsed: 3 } }).ok).toBe(false)
  })
})