import type { ReactNode } from 'react'
import { Link } from 'react-router'
import logoMark from '@/assets/logo-mark.png'
import { LandingPage } from '@/features/landing'

/** Tracé de battements sur un électrocardiogramme, en accent sous le logo. */
const ecgPath =
  'M0 22h40l4-6 4 6h6l3 4 5-20 5 26 4-10h9l5-4 5 4h40l4-6 4 6h6l3 4 5-20 5 26 4-10h9l5-4 5 4h40'

interface AuthLayoutProps {
  title: string
  description?: ReactNode
  children: ReactNode
}

/** Écrans d'accès : le formulaire apparaît devant la page d'accueil, floutée en arrière-plan. */
export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-page">
      {/* Arrière-plan décoratif : inactif et ignoré des lecteurs d'écran. */}
      <div
        aria-hidden="true"
        inert
        className="pointer-events-none fixed inset-0 scale-105 overflow-hidden blur-md select-none"
      >
        <LandingPage />
      </div>
      <div aria-hidden="true" className="fixed inset-0 bg-ink/45" />

      <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md animate-pop rounded-3xl bg-surface p-6 shadow-2xl shadow-ink/30 sm:p-10">
          <div className="flex flex-col items-center gap-3">
            <Link
              to="/"
              aria-label="Revenir à l'accueil eCare+"
              className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <img src={logoMark} alt="" className="size-11" />
              <span className="font-display text-3xl font-extrabold text-primary">ecare+</span>
            </Link>
            <svg
              aria-hidden="true"
              className="h-7 w-48"
              viewBox="0 0 220 32"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d={ecgPath}
                stroke="var(--color-primary-soft-hover)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d={ecgPath}
                pathLength="1"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0.35 0.65"
                className="animate-ecg"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-center font-display text-2xl font-bold text-ink sm:text-3xl">
            {title}
          </h1>
          {description && (
            <div className="mt-2 text-center text-sm leading-relaxed text-muted">{description}</div>
          )}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
