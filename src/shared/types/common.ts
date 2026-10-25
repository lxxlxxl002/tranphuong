export type ID = string
export type ISODateString = string
export type SortDir = 'asc' | 'desc'

export interface Option<T extends string | number = string> {
  label: string
  value: T
}

export interface SortState<K extends string = string> {
  key: K
  dir: SortDir
}

export type Nullable<T> = T | null

export type ActiveStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED'