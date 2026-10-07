import type { ReactNode } from 'react'

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  /** À désactiver quand tous les champs du formulaire sont obligatoires. */
  showRequirement?: boolean
  error?: string
  hint?: string
  children: ReactNode
}

export function FormField({
  id,
  label,
  required = false,
  showRequirement = true,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-muted">
        {label}
        {showRequirement &&
          (required ? (
            <span className="text-danger" aria-hidden="true">
              {' '}
              *
            </span>
          ) : (
            <span className="font-normal"> (facultatif)</span>
          ))}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-sm text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
