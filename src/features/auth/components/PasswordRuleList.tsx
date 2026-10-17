import { passwordRules } from '@/features/auth/passwordRules'

function RuleCheck({ label, met }: { label: string; met: boolean }) {
  return (
    <li className={`flex items-center gap-2 text-sm ${met ? 'text-success' : 'text-muted'}`}>
      <span
        aria-hidden="true"
        className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full transition-colors ${
          met ? 'bg-success text-white' : 'border border-control'
        }`}
      >
        {met && (
          <svg
            className="size-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        )}
      </span>
      {label}
      <span className="sr-only">{met ? ' : respecté' : ' : non respecté'}</span>
    </li>
  )
}

/** Règles du mot de passe, cochées au fil de la saisie. */
export function PasswordRuleList({ password }: { password: string }) {
  return (
    <ul className="flex flex-col gap-2" aria-label="Règles du mot de passe">
      {passwordRules.map((rule) => (
        <RuleCheck key={rule.label} label={rule.label} met={rule.test(password)} />
      ))}
    </ul>
  )
}
