import { isDemoMode } from '@/features/auth'
import { courseService } from '@/features/course-admin'
import { ApiError } from '@/shared/api/errors'
import { normalizeText } from '@/shared/lib/format'
import { fetchBankQuestions, fetchBanks } from '../api/queries'
import { bulkCreateQuestionsRequest, createQuestionRequest, deleteQuestionRequest, updateQuestionRequest } from '../api/mutations'
import { toBankQuestions, toBanks, toQuestionOne, toQuestionPayload } from '../adapters/questionAdapter'
import { QUESTION_BANK_CONFIG } from '../config/question-bank.config'
import { demoId, newOptionKey } from '../lib/utils'
import { MIN_OPTIONS } from '../model/constants'
import type { BankQuestions, Question, QuestionBank, QuestionInput, QuestionType, TypeFilter } from '../model/types'

/* ---------- Demo ---------- */
let db: Question[] | null = null
const qdb = (): Question[] => (db ??= structuredClone(QUESTION_BANK_CONFIG.demo.questions))
export const resetDemoQuestions = () => {
  db = null
}

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), QUESTION_BANK_CONFIG.demoDelayMs))

const renumber = (courseId: string) => {
  qdb()
    .filter((q) => q.courseId === courseId)
    .sort((a, b) => a.order - b.order)
    .forEach((q, i) => (q.order = i + 1))
}

const fromInput = (courseId: string, input: QuestionInput, order: number, id = demoId('q')): Question => ({
  id,
  courseId,
  order,
  text: input.text.trim(),
  type: input.type,
  options: input.options.map((o, i) => ({ id: `${id}-${i}`, text: o.text.trim(), correct: o.correct })),
  explanation: input.explanation.trim() || null,
  updatedAt: new Date().toISOString()
})

const parse = <T>(fn: () => T, message: string): T => {
  try {
    return fn()
  } catch {
    throw new ApiError('SERVER', message)
  }
}

export const questionService = {
  async getBanks(): Promise<QuestionBank[]> {
    if (isDemoMode()) {
      const courses = await courseService.list()
      const banks = courses.map((c) => ({
        courseId: c.id,
        courseTitle: c.title,
        coverUrl: c.coverUrl,
        questionCount: qdb().filter((q) => q.courseId === c.id).length
      }))
      return questionService.sortBanks(banks)
    }
    const raw = await fetchBanks()
    return questionService.sortBanks(parse(() => toBanks(raw), 'Dữ liệu ngân hàng câu hỏi không hợp lệ'))
  },

  async getQuestions(courseId: string): Promise<BankQuestions> {
    if (isDemoMode()) {
      const { course } = await courseService.detail(courseId)
      const questions = qdb()
        .filter((q) => q.courseId === courseId)
        .sort((a, b) => a.order - b.order)
      return delay({ course: { id: course.id, title: course.title }, questions })
    }
    const raw = await fetchBankQuestions(courseId)
    return parse(() => toBankQuestions(raw), 'Dữ liệu câu hỏi không hợp lệ')
  },

  async create(courseId: string, input: QuestionInput): Promise<Question> {
    const clean = questionService.normalizeInput(input)
    if (isDemoMode()) {
      const q = fromInput(courseId, clean, qdb().filter((x) => x.courseId === courseId).length + 1)
      qdb().push(q)
      return delay(q)
    }
    const raw = await createQuestionRequest(courseId, toQuestionPayload(clean))
    return parse(() => toQuestionOne(raw, courseId), 'Dữ liệu câu hỏi không hợp lệ')
  },

  async update(questionId: string, input: QuestionInput): Promise<Question> {
    const clean = questionService.normalizeInput(input)
    if (isDemoMode()) {
      const i = qdb().findIndex((q) => q.id === questionId)
      if (i < 0) throw new ApiError('NOT_FOUND', 'Không tìm thấy câu hỏi')
      const cur = qdb()[i]
      qdb()[i] = fromInput(cur.courseId, clean, cur.order, cur.id)
      return delay(qdb()[i])
    }
    const raw = await updateQuestionRequest(questionId, toQuestionPayload(clean))
    return parse(() => toQuestionOne(raw, ''), 'Dữ liệu câu hỏi không hợp lệ')
  },

  async remove(questionId: string): Promise<void> {
    if (isDemoMode()) {
      const q = qdb().find((x) => x.id === questionId)
      if (!q) throw new ApiError('NOT_FOUND', 'Không tìm thấy câu hỏi')
      db = qdb().filter((x) => x.id !== questionId)
      renumber(q.courseId)
      return delay(undefined)
    }
    await deleteQuestionRequest(questionId)
  },

  async bulkCreate(courseId: string, inputs: QuestionInput[]): Promise<number> {
    const clean = inputs.map((i) => questionService.normalizeInput(i))
    if (isDemoMode()) {
      const start = qdb().filter((x) => x.courseId === courseId).length
      clean.forEach((input, i) => qdb().push(fromInput(courseId, input, start + i + 1)))
      return delay(clean.length)
    }
    const raw = await bulkCreateQuestionsRequest(courseId, clean.map(toQuestionPayload))
    const created = Number((raw as { created?: unknown } | null)?.created)
    return Number.isFinite(created) ? created : clean.length
  },

  /* ---------- Thuần ---------- */

  sortBanks(list: QuestionBank[]): QuestionBank[] {
    return [...list].sort((a, b) => b.questionCount - a.questionCount || a.courseTitle.localeCompare(b.courseTitle, 'vi'))
  },

  filterBanks(list: QuestionBank[], search: string): QuestionBank[] {
    const q = normalizeText(search)
    return q ? list.filter((b) => normalizeText(b.courseTitle).includes(q)) : list
  },

  filter(list: Question[], type: TypeFilter, search: string): Question[] {
    const q = normalizeText(search)
    return list.filter(
      (x) =>
        (type === 'ALL' || x.type === type) &&
        (!q || normalizeText(`${x.text} ${x.options.map((o) => o.text).join(' ')}`).includes(q))
    )
  },

  countByType(list: Question[]): Record<TypeFilter, number> {
    const counts: Record<TypeFilter, number> = { ALL: list.length, SINGLE: 0, MULTIPLE: 0 }
    for (const q of list) counts[q.type]++
    return counts
  },

  emptyInput(type: QuestionType = 'SINGLE'): QuestionInput {
    return {
      text: '',
      type,
      options: Array.from({ length: 4 }, () => ({ key: newOptionKey(), text: '', correct: false })),
      explanation: ''
    }
  },

  toInput(q: Question): QuestionInput {
    return {
      text: q.text,
      type: q.type,
      options: q.options.map((o) => ({ key: newOptionKey(), text: o.text, correct: o.correct })),
      explanation: q.explanation ?? ''
    }
  },

  /** Đổi loại câu: về 1 đáp án thì chỉ giữ đáp án đúng đầu tiên */
  setType(input: QuestionInput, type: QuestionType): QuestionInput {
    if (type === 'MULTIPLE') return { ...input, type }
    let kept = false
    return {
      ...input,
      type,
      options: input.options.map((o) => {
        if (o.correct && !kept) {
          kept = true
          return o
        }
        return { ...o, correct: false }
      })
    }
  },

  toggleCorrect(input: QuestionInput, key: string): QuestionInput {
    return {
      ...input,
      options: input.options.map((o) =>
        input.type === 'MULTIPLE' ? (o.key === key ? { ...o, correct: !o.correct } : o) : { ...o, correct: o.key === key }
      )
    }
  },

  /** Trim + bỏ đáp án rỗng */
  normalizeInput(input: QuestionInput): QuestionInput {
    return {
      ...input,
      text: input.text.trim(),
      explanation: input.explanation.trim(),
      options: input.options.map((o) => ({ ...o, text: o.text.trim() })).filter((o) => o.text)
    }
  },

  minOptions: MIN_OPTIONS
}