interface WaveformBarsProps {
  /** Hauteur de chaque barre, de 0 à 1. */
  values: number[]
  /** Part déjà lue, de 0 à 1 : les barres correspondantes prennent la couleur pleine. */
  progress?: number
  /** Sur une bulle de couleur principale, les barres passent en blanc pour rester lisibles. */
  onPrimary?: boolean
}

/** Barres verticales dont la hauteur suit le volume de la voix. Décoratives. */
export function WaveformBars({ values, progress = 1, onPrimary = false }: WaveformBarsProps) {
  const played = onPrimary ? 'bg-white' : 'bg-primary'
  const unplayed = onPrimary ? 'bg-white/40' : 'bg-control'
  return (
    <div aria-hidden="true" className="flex h-8 w-full items-center gap-0.5">
      {values.map((value, index) => (
        <span
          // Les barres ne changent jamais d'ordre : leur position sert d'identifiant.
          key={index}
          className={`min-w-0.5 flex-1 rounded-full transition-[height] duration-75 ${
            (index + 0.5) / values.length <= progress ? played : unplayed
          }`}
          // Hauteur minimale : un silence reste visible sous forme de point.
          style={{ height: `${Math.max(10, value * 100)}%` }}
        />
      ))}
    </div>
  )
}
