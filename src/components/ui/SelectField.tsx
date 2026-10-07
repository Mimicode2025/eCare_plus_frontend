import { useId, type SelectHTMLAttributes } from 'react'
import { describedBy } from '@/components/ui/describedBy'
import { FormField } from '@/components/ui/FormField'
import { controlClassName } from '@/components/ui/styles'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'children'> {
  label: string
  options: SelectOption[]
  placeholder: string
  error?: string
  hint?: string
  showRequirement?: boolean
}

export function SelectField({
  label,
  options,
  placeholder,
  error,
  hint,
  showRequirement,
  id,
  required,
  ...props
}: SelectFieldProps) {
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
      <select
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, error, hint)}
        className={controlClassName(Boolean(error))}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}
