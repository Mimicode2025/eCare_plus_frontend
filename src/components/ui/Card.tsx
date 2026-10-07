import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  action?: ReactNode
  children: ReactNode
}

export function Card({ title, action, children }: CardProps) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="font-display text-base font-bold text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
