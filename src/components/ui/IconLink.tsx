import { Link } from 'react-router'

interface IconLinkProps {
  to: string
  /** Intitulé de l'action, lu par les lecteurs d'écran et affiché au survol. */
  label: string
  /** Tracé SVG du pictogramme, sur une grille de 24 × 24. */
  iconPath: string
}

/** Pictogramme « dossier », pour l'accès au dossier d'un patient. */
export const recordIconPath =
  'M3 6a2 2 0 0 1 2-2h4.6l2 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z'

/** Navigation présentée comme un bouton rond à pictogramme. */
export function IconLink({ to, label, iconPath }: IconLinkProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      title={label}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-primary-strong hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary"
    >
      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={iconPath} />
      </svg>
    </Link>
  )
}
