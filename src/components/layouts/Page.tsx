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

/** Structure d'une page : titre, puis contenu, sur le fond de page. */
export function Page({ title, description, backLink, action, children }: PageProps) {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 px-4 pt-6 sm:px-8 sm:pt-8">
        <div className="flex animate-enter flex-col gap-1.5">
          {backLink && (
            <Link to={backLink.to} className={`self-start ${buttonClassName('secondary', 'sm')}`}>
              <span aria-hidden="true">←</span>
              {backLink.label}
            </Link>
          )}
          <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        {action}
      </header>
      <div className="animate-stagger flex flex-col gap-6 px-4 py-6 sm:px-8 sm:pb-8">{children}</div>
    </>
  )
}
