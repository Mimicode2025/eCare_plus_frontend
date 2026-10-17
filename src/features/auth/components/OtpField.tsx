import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'

interface OtpFieldProps {
  /** Nombre de chiffres du code. */
  length: number
  value: string
  onChange: (value: string) => void
  label: string
  error?: string
  disabled?: boolean
  autoFocus?: boolean
}

/** Saisie d'un code à usage unique : une case par chiffre, avec avance automatique et collage. */
export function OtpField({
  length,
  value,
  onChange,
  label,
  error,
  disabled,
  autoFocus,
}: OtpFieldProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const digits = Array.from({ length }, (_, index) => value[index] ?? '')
  const errorId = `${label}-erreur`.replace(/\s+/g, '-')

  const focus = (index: number) =>
    inputsRef.current[Math.max(0, Math.min(length - 1, index))]?.focus()

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice()
    next[index] = digit
    onChange(next.join('').slice(0, length))
  }

  const handleInput = (index: number, raw: string) => {
    const typed = raw.replace(/\D/g, '')
    if (!typed) return setDigit(index, '')
    // Plusieurs chiffres d'un coup (saisie automatique du code) : ils remplissent les cases suivantes.
    const next = digits.slice()
    for (const [offset, digit] of [...typed].entries()) {
      if (index + offset < length) next[index + offset] = digit
    }
    onChange(next.join('').slice(0, length))
    focus(index + typed.length)
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index]) {
      event.preventDefault()
      setDigit(index - 1, '')
      focus(index - 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focus(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      focus(index + 1)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    event.preventDefault()
    onChange(pasted)
    focus(pasted.length)
  }

  return (
    <fieldset disabled={disabled} className="flex min-w-0 flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold text-ink">{label}</legend>
      <div className="flex w-full gap-3">
        {digits.map((digit, index) => (
          <input
            // Les cases ne changent jamais d'ordre : leur position sert d'identifiant.
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element
            }}
            type="text"
            inputMode="numeric"
            size={1}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={length}
            autoFocus={autoFocus && index === 0}
            aria-label={`Chiffre ${index + 1} sur ${length}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            value={digit}
            onChange={(event) => handleInput(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(event) => event.target.select()}
            // Les cases se partagent toute la largeur du formulaire.
            className={`h-14 min-w-0 flex-1 rounded-2xl border bg-page text-center font-display text-2xl font-bold text-ink transition-colors focus:bg-surface focus:outline-2 focus:outline-primary disabled:text-muted sm:h-16 ${
              error ? 'border-danger' : digit ? 'border-primary' : 'border-control'
            }`}
          />
        ))}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}
