import { useQuestionBankStore } from './store'
import type { TypeFilter } from '../model/types'

const TYPES: TypeFilter[] = ['ALL', 'SINGLE', 'MULTIPLE']

export const questionBankActions = {
  setBankSearch(bankSearch: string) {
    useQuestionBankStore.setState({ bankSearch })
  },
  setQuestionSearch(questionSearch: string) {
    useQuestionBankStore.setState({ questionSearch })
  },
  setTypeFilter(value: string) {
    if (TYPES.includes(value as TypeFilter)) useQuestionBankStore.setState({ typeFilter: value as TypeFilter })
  },
  resetFilters() {
    useQuestionBankStore.setState({ questionSearch: '', typeFilter: 'ALL' })
  },
  openCreate() {
    useQuestionBankStore.setState({ editor: { open: true, questionId: null } })
  },
  openEdit(questionId: string) {
    useQuestionBankStore.setState({ editor: { open: true, questionId } })
  },
  closeEditor() {
    useQuestionBankStore.setState({ editor: { open: false, questionId: null } })
  },
  openImport() {
    useQuestionBankStore.setState({ importOpen: true })
  },
  closeImport() {
    useQuestionBankStore.setState({ importOpen: false })
  }
}