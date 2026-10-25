import { storage } from '@/shared/lib/storage'
import { quizStorageKey, toggleOption } from '../lib/utils'
import type { QuizAnswers, QuizQuestion, QuizResult, QuizSession } from '../model/types'
import { useQuizStore } from './store'

interface Persisted {
  session: QuizSession
  answers: QuizAnswers
  flagged: string[]
  current: number
}

/** Lưu bài làm sau mỗi thao tác — tải lại trang không mất */
const persist = () => {
  const { session, answers, flagged, current } = useQuizStore.getState()
  if (session) storage.set<Persisted>(quizStorageKey(session.courseId), { session, answers, flagged, current })
}

export const quizActions = {
  start(session: QuizSession) {
    useQuizStore.setState({ session, answers: {}, flagged: [], current: 0, result: null })
    persist()
  },

  answer(question: QuizQuestion, optionId: string) {
    useQuizStore.setState((s) => ({
      answers: {
        ...s.answers,
        [question.id]: toggleOption(s.answers[question.id] ?? [], optionId, question.type === 'MULTIPLE')
      }
    }))
    persist()
  },

  toggleFlag(questionId: string) {
    useQuizStore.setState((s) => ({
      flagged: s.flagged.includes(questionId) ? s.flagged.filter((x) => x !== questionId) : [...s.flagged, questionId]
    }))
    persist()
  },

  goTo(index: number) {
    const total = useQuizStore.getState().session?.questions.length ?? 0
    useQuizStore.setState({ current: Math.max(0, Math.min(index, total - 1)) })
    persist()
  },

  next() {
    quizActions.goTo(useQuizStore.getState().current + 1)
  },

  prev() {
    quizActions.goTo(useQuizStore.getState().current - 1)
  },

  setResult(result: QuizResult) {
    storage.remove(quizStorageKey(result.courseId))
    useQuizStore.setState({ session: null, answers: {}, flagged: [], current: 0, result })
  },

  closeResult() {
    useQuizStore.setState({ result: null })
  },

  restore(courseId: string) {
    if (useQuizStore.getState().session?.courseId === courseId) return
    const saved = storage.get<Persisted>(quizStorageKey(courseId))
    if (saved?.session?.courseId === courseId) {
      useQuizStore.setState({
        session: saved.session,
        answers: saved.answers ?? {},
        flagged: saved.flagged ?? [],
        current: saved.current ?? 0,
        result: null
      })
    }
  },

  discard(courseId: string) {
    storage.remove(quizStorageKey(courseId))
    if (useQuizStore.getState().session?.courseId === courseId) {
      useQuizStore.setState({ session: null, answers: {}, flagged: [], current: 0 })
    }
  }
}