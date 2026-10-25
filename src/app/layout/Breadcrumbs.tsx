import { Fragment } from 'react'
import { Link, useMatches } from 'react-router'
import { ChevronRight } from 'lucide-react'
import type { RouteMeta } from '@/app/router/paths'

export function Breadcrumbs() {
  const matches = useMatches()
  const meta = [...matches].reverse().find((m) => (m.handle as RouteMeta | undefined)?.crumbs)?.handle as
    | RouteMeta
    | undefined
  const crumbs = meta?.crumbs
  if (!crumbs?.length) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-2 text-[13px]">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1
        return (
          <Fragment key={`${c.label}-${i}`}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-ink-faint" />}
            {c.to && !last ? (
              <Link to={c.to} className="text-ink-muted transition hover:text-brand-600">
                {c.label}
              </Link>
            ) : (
              <span className={last ? 'font-medium text-ink-soft' : 'text-ink-muted'}>{c.label}</span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}