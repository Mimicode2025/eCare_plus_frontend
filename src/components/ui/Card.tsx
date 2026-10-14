import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  action?: ReactNode
  children: ReactNode
}

export function Card({ title, action, children }: CardProps) {
  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="font-display text-lg font-bold text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
