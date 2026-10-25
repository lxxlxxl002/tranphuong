import type { SettingsState } from './store'

export const selectApplied = (s: SettingsState) => s.applied
export const selectDraft = (s: SettingsState) => s.draft
export const selectErrors = (s: SettingsState) => s.errors
export const selectTab = (s: SettingsState) => s.tab