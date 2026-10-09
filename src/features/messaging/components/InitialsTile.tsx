import { getInitials } from '@/features/messaging/format'

interface InitialsTileProps {
  name: string
  /** Sur un fond de couleur principale, la pastille passe en blanc pour rester lisible. */
  onPrimary?: boolean
}

/** Pastille carrée aux initiales du patient. Décorative : le nom complet figure à côté. */
export function InitialsTile({ name, onPrimary = false }: InitialsTileProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-12 shrink-0 items-center justify-center rounded-2xl font-display text-base font-bold ${
        onPrimary ? 'bg-surface text-primary-strong' : 'bg-primary-soft text-primary-strong'
      }`}
    >
      {getInitials(name)}
    </span>
  )
}
