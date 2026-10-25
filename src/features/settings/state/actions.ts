import { useSettingsStore } from './store'
import type { AppSettings, SectionKey, SettingsErrors, SettingsTab } from '../model/types'

export const settingsActions = {
  setApplied(applied: AppSettings) {
    useSettingsStore.setState({ applied })
  },
  setField<S extends SectionKey, K extends keyof AppSettings[S]>(section: S, key: K, value: AppSettings[S][K]) {
    useSettingsStore.setState((s) => {
      const base = s.draft ?? s.applied
      const { [`${section}.${String(key)}`]: _cleared, ...errors } = s.errors as Record<string, string>
      return {
        draft: { ...base, [section]: { ...base[section], [key]: value } },
        errors: errors as SettingsErrors
      }
    })
  },
  setErrors(errors: SettingsErrors) {
    useSettingsStore.setState({ errors })
  },
  discard() {
    useSettingsStore.setState({ draft: null, errors: {} })
  },
  setTab(tab: SettingsTab) {
    useSettingsStore.setState({ tab })
  }
}

/* ---------- Đọc đồng bộ cho feature khác ---------- */

export const getAppSettings = (): AppSettings => useSettingsStore.getState().applied

export const getCertificateSettings = () => {
  const { general, certificate } = getAppSettings()
  return {
    parentOrg: general.parentOrg,
    orgName: general.orgName,
    issuePlace: certificate.issuePlace,
    signerTitle: certificate.signerTitle,
    signerName: certificate.signerName
  }
}

export const getCourseDefaults = () => {
  const { general } = getAppSettings()
  return { passScore: general.defaultPassScore, durationMin: general.defaultDurationMin, maxAttempts: general.defaultMaxAttempts }
}