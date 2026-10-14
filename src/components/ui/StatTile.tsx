type StatTone = 'blue' | 'red' | 'amber' | 'green'

const tones: Record<StatTone, string> = {
  blue: 'bg-primary-soft text-primary-strong',
  red: 'bg-danger-soft text-danger',
  amber: 'bg-warning-soft text-warning',
  green: 'bg-success-soft text-success',
}

interface StatTileProps {
  label: string
  value: string
  hint: string
  tone?: StatTone
}

/** Indicateur chiffré : libellé, valeur mise en avant et précision. */
export function StatTile({ label, value, hint, tone = 'blue' }: StatTileProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p
        className={`self-start rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${tones[tone]}`}
      >
        {label}
      </p>
      <p className="font-display text-3xl font-bold text-ink">{value}</p>
      <p className="text-sm text-muted">{hint}</p>
    </div>
  )
}
