import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { useDismiss } from '@/hooks/useDismiss'

export interface NotificationItem {
  id: string
  title: string
  description: string
  /** Écran ouvert par un clic sur la notification. */
  to: string
  /** Tracé SVG du pictogramme, sur une grille de 24 × 24. */
  iconPath: string
  tone: 'blue' | 'red' | 'amber' | 'green'
}

const tones: Record<NotificationItem['tone'], string> = {
  blue: 'bg-primary-soft text-primary-strong',
  red: 'bg-danger-soft text-danger',
  amber: 'bg-warning-soft text-warning',
  green: 'bg-success-soft text-success',
}

const countLabel = (count: number) =>
  count === 0 ? 'Aucune notification' : count === 1 ? '1 notification' : `${count} notifications`

/** Cloche de notifications : pastille de décompte, et volet listant les éléments à traiter. */
export function NotificationMenu({ items }: { items: NotificationItem[] }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const containerRef = useDismiss<HTMLDivElement>(open, close)

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={`Notifications : ${countLabel(items.length).toLowerCase()}`}
        title="Notifications"
        className={`relative flex size-11 items-center justify-center rounded-full border transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.95] ${
          open
            ? 'border-primary-strong bg-primary-strong text-white shadow-md'
            : 'border-transparent bg-page text-ink hover:border-line hover:bg-surface hover:shadow-md'
        }`}
      >
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z" />
          <path d="M10 20a2.2 2.2 0 0 0 4 0" />
        </svg>
        {items.length > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full border-2 border-surface bg-danger px-1 text-xs font-bold text-white"
          >
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-40 mt-3 w-[min(22rem,calc(100vw-2rem))] animate-pop overflow-hidden rounded-3xl border border-line bg-surface shadow-xl">
          <div className="flex items-baseline justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="font-display text-base font-bold text-ink">Notifications</h2>
            <p className="text-xs font-semibold text-muted">{countLabel(items.length)}</p>
          </div>
          {items.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">Vous êtes à jour.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto p-2">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    onClick={close}
                    className="flex items-start gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${tones[item.tone]}`}
                    >
                      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d={item.iconPath} />
                      </svg>
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-sm font-semibold text-ink">{item.title}</span>
                      <span className="text-sm text-muted">{item.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
