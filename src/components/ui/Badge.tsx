import type { ReactNode } from 'react'

type BadgeTone = 'blue' | 'violet' | 'red' | 'amber' | 'green'

const tones: Record<BadgeTone, string> = {
  blue: 'bg-primary-soft text-primary-strong',
  violet: 'bg-violet-soft text-violet',
  red: 'bg-danger-soft text-danger',
  amber: 'bg-warning-soft text-warning',
  green: 'bg-success-soft text-success',
}

export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
