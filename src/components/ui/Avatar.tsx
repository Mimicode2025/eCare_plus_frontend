type AvatarSize = 'md' | 'lg'

const sizes: Record<AvatarSize, string> = {
  md: 'size-9 text-sm',
  lg: 'size-16 text-xl',
}

/** Pastille ronde affichant des initiales. Décorative : le nom complet doit figurer à côté. */
export function Avatar({ initials, size = 'md' }: { initials: string; size?: AvatarSize }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-display font-bold text-white ${sizes[size]}`}
    >
      {initials}
    </span>
  )
}
