import { useId, useState, type InputHTMLAttributes } from 'react'
import { describedBy } from '@/components/ui/describedBy'
import { FormField } from '@/components/ui/FormField'
import { controlClassName } from '@/components/ui/styles'

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  label: string
  error?: string
  showRequirement?: boolean
}

/** Champ mot de passe avec un bouton pour afficher ou masquer la saisie. */
export function PasswordField({
  label,
  error,
  showRequirement,
  id,
  required,
  disabled,
  ...props
}: PasswordFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const [visible, setVisible] = useState(false)

  return (
    <FormField
      id={fieldId}
      label={label}
      required={required}
      showRequirement={showRequirement}
      error={error}
    >
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? 'text' : 'password'}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, error)}
          className={`${controlClassName(Boolean(error))} pr-11`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          aria-pressed={visible}
          aria-label="Afficher le mot de passe"
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
            {visible && (
              <path d="M4 4l16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
    </FormField>
  )
}
