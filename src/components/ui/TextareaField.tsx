import { useId, type TextareaHTMLAttributes } from 'react'
import { describedBy } from '@/components/ui/describedBy'
import { FormField } from '@/components/ui/FormField'

interface TextareaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string
  error?: string
  hint?: string
}

export function TextareaField({ label, error, hint, id, required, ...props }: TextareaFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <FormField id={fieldId} label={label} required={required} error={error} hint={hint}>
      <textarea
        id={fieldId}
        rows={4}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, error, hint)}
        className={`w-full rounded-lg border ${
          error ? 'border-danger' : 'border-control'
        } bg-page px-3 py-2 text-sm text-ink placeholder:text-muted focus:bg-surface focus:outline-2 focus:outline-primary disabled:text-muted`}
        {...props}
      />
    </FormField>
  )
}
