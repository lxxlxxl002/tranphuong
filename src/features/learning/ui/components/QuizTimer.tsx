import { useEffect, useRef, useState } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { formatClock } from '@/shared/lib/date'

interface QuizTimerProps {
  /** epoch ms */
  deadline: number
  onExpire: () => void
  warnAtSec?: number
}

export function QuizTimer({ deadline, onExpire, warnAtSec = 60 }: QuizTimerProps) {
  const [now, setNow] = useState(() => Date.now())
  const expired = useRef(false)
  const remaining = Math.max(0, Math.round((deadline - now) / 1000))

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (remaining === 0 && !expired.current) {
      expired.current = true
      onExpire()
    }
  }, [remaining, onExpire])

  const danger = remaining <= warnAtSec
  return (
    <div
      role="timer"
      aria-label="Thời gian còn lại"
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-base font-bold tabular-nums ring-1 ring-inset',
        danger ? 'animate-pulse bg-rose-50 text-rose-600 ring-rose-200' : 'bg-brand-50 text-brand-700 ring-brand-100'
      )}
    >
      <Clock className="h-4 w-4" />
      {formatClock(remaining)}
    </div>
  )
}