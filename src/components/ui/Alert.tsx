import type { ReactNode } from 'react'

type AlertVariant = 'success' | 'error'

interface AlertProps {
  variant: AlertVariant
  title: string
  children?: ReactNode
}

const variants: Record<AlertVariant, string> = {
  success: 'border-success-line bg-success-soft text-success',
  error: 'border-danger-line bg-danger-soft text-danger',
}

export function Alert({ variant, title, children }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex animate-pop items-start gap-3 rounded-2xl border px-5 py-4 text-sm ${variants[variant]}`}
    >
      <svg
        className="mt-0.5 size-5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        {variant === 'success' ? <path d="m8 12.5 2.5 2.5L16 9.5" /> : <path d="M12 7.5v5m0 3.5v.01" />}
      </svg>
      <div>
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-1 text-ink">{children}</div>}
      </div>
    </div>
  )
}
