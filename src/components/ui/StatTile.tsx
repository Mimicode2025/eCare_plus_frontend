type StatTone = 'blue' | 'red' | 'amber' | 'green'

const tones: Record<StatTone, string> = {
  blue: 'text-primary-strong',
  red: 'text-danger',
  amber: 'text-warning',
  green: 'text-success',
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
    <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5">
      <p className={`text-xs font-semibold tracking-wide uppercase ${tones[tone]}`}>{label}</p>
      <p className="font-display text-3xl font-bold text-ink">{value}</p>
      <p className="text-sm text-muted">{hint}</p>
    </div>
  )
}
