import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { buttonClassName } from '@/components/ui/styles'

interface PageProps {
  title: string
  description?: string
  backLink?: { to: string; label: string }
  action?: ReactNode
  children: ReactNode
}

/** Structure d'une page : bandeau de titre blanc, puis contenu sur le fond de page. */
export function Page({ title, description, backLink, action, children }: PageProps) {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-surface px-4 py-4 sm:px-8">
        <div className="flex flex-col gap-1">
          {backLink && (
            <Link to={backLink.to} className={`self-start ${buttonClassName('secondary', 'sm')}`}>
              <span aria-hidden="true">←</span>
              {backLink.label}
            </Link>
          )}
          <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        {action}
      </header>
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8">{children}</div>
    </>
  )
}
