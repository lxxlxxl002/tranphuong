import { Avatar } from '@/shared/ui/Avatar'

export function UserAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  return <Avatar name={name} size={size} />
}