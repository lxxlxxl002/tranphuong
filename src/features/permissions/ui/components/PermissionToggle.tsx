import { Toggle } from '@/shared/ui/Toggle'

interface PermissionToggleProps {
  checked: boolean
  label: string
  disabled?: boolean
  onChange: () => void
}

export function PermissionToggle({ checked, label, disabled, onChange }: PermissionToggleProps) {
  return <Toggle size="sm" checked={checked} disabled={disabled} onChange={onChange} aria-label={label} />
}