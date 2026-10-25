import { isResultFilter, isReviewFilter } from '../lib/validators'
import { useExamResultsStore } from './store'

export const examResultsActions = {
  setListFilter(value: string) {
    if (isResultFilter(value)) useExamResultsStore.setState({ listFilter: value })
  },
  setReviewFilter(value: string) {
    if (isReviewFilter(value)) useExamResultsStore.setState({ reviewFilter: value })
  }
}