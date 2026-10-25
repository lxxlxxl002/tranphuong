export interface GeneralSection {
  systemName: string
  orgName: string
  parentOrg: string
  defaultPassScore: number
  defaultDurationMin: number
  defaultMaxAttempts: number
}

export interface SupportSection {
  name: string
  phone: string
  email: string
  workingHours: string
}

export interface CertificateSection {
  issuePlace: string
  signerTitle: string
  signerName: string
}

export interface AppSettings {
  general: GeneralSection
  support: SupportSection
  certificate: CertificateSection
  updatedAt: string | null
}

export type SectionKey = 'general' | 'support' | 'certificate'
export type SettingsTab = SectionKey

/** Khóa phẳng: "support.phone" */
export type FlatKey = {
  [S in SectionKey]: `${S}.${Extract<keyof AppSettings[S], string>}`
}[SectionKey]

export type FlatSettings = Record<FlatKey, string | number>
export type SettingsErrors = Partial<Record<FlatKey, string>>