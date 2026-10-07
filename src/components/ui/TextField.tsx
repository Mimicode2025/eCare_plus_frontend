import { useId, type InputHTMLAttributes } from 'react'
import { describedBy } from '@/components/ui/describedBy'
import { FormField } from '@/components/ui/FormField'
import { controlClassName } from '@/components/ui/styles'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  error?: string
  hint?: string
  showRequirement?: boolean
}

export function TextField({
  label,
  error,
  hint,
  showRequirement,
  id,
  required,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <FormField
      id={fieldId}
      label={label}
      required={required}
      showRequirement={showRequirement}
      error={error}
      hint={hint}
    >
      <input
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, error, hint)}
        className={controlClassName(Boolean(error))}
        {...props}
      />
    </FormField>
  )
}
