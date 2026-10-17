interface LoadingProps {
  /** Message lu par les lecteurs d'écran pendant le chargement. */
  label: string
}

/** Chargement d'un écran : silhouette des indicateurs puis du contenu principal. */
export function PageSkeleton({ label }: LoadingProps) {
  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="grid gap-4 md:grid-cols-3">
        <div className="skeleton h-32 rounded-3xl" />
        <div className="skeleton h-32 rounded-3xl" />
        <div className="skeleton h-32 rounded-3xl" />
      </div>
      <div aria-hidden="true" className="skeleton h-72 rounded-3xl" />
    </div>
  )
}

/** Chargement d'une liste : silhouette de quelques lignes. */
export function ListSkeleton({ label }: LoadingProps) {
  return (
    <div role="status" className="flex flex-col gap-3">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="skeleton h-14" />
      <div aria-hidden="true" className="skeleton h-14" />
      <div aria-hidden="true" className="skeleton h-14" />
    </div>
  )
}
