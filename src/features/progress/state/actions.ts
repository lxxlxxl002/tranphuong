import { isSortBy } from '../lib/validators'
import { useProgressStore } from './store'

export const progressActions = {
  setSortBy(value: string) {
    if (isSortBy(value)) useProgressStore.setState({ sortBy: value })
  }
}