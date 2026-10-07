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
      className={`rounded-xl border px-5 py-4 text-sm ${variants[variant]}`}
    >
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-1 text-ink">{children}</div>}
    </div>
  )
}
