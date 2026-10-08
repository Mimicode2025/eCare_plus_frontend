import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import logoMark from '@/assets/logo-mark.png'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { PasswordField } from '@/components/ui/PasswordField'
import { SelectField } from '@/components/ui/SelectField'
import { TextField } from '@/components/ui/TextField'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { roleLabels } from '@/features/auth/labels'
import {
  demoAccounts,
  InvalidCredentialsError,
  structures,
} from '@/features/auth/services/authService'

type LoginField = 'structureId' | 'identifier' | 'password'
type LoginErrors = Partial<Record<LoginField, string>>

const fieldOrder: LoginField[] = ['structureId', 'identifier', 'password']
const fieldId = (field: LoginField) => `login-${field}`
const structureOptions = structures.map(({ id, name }) => ({ value: id, label: name }))

const requiredMessages: Record<LoginField, string> = {
  structureId: 'Sélectionnez votre structure sanitaire.',
  identifier: 'Saisissez votre identifiant professionnel.',
  password: 'Saisissez votre mot de passe.',
}

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState<Record<LoginField, string>>({
    structureId: '',
    identifier: '',
    password: '',
  })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [failure, setFailure] = useState<'credentials' | 'unknown' | null>(null)

  // Page demandée avant la redirection vers la connexion, s'il y en a une.
  const from: unknown = location.state?.from
  const destination = typeof from === 'string' ? from : '/'

  if (user) return <Navigate to={destination} replace />

  const bind = (field: LoginField) => ({
    id: fieldId(field),
    name: field,
    value: values[field],
    error: errors[field],
    required: true,
    showRequirement: false,
    onChange: (event: { target: { value: string } }) => {
      const { value } = event.target
      setValues((current) => ({ ...current, [field]: value }))
      if (errors[field] && value) setErrors(({ [field]: _fixed, ...rest }) => rest)
    },
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: LoginErrors = {}
    for (const field of fieldOrder) {
      if (!values[field].trim()) nextErrors[field] = requiredMessages[field]
    }
    setErrors(nextErrors)
    const firstInvalid = fieldOrder.find((field) => nextErrors[field])
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus()
      return
    }

    setSubmitting(true)
    setFailure(null)
    try {
      await login(values)
      await navigate(destination, { replace: true })
    } catch (error) {
      setFailure(error instanceof InvalidCredentialsError ? 'credentials' : 'unknown')
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <div className="flex items-center gap-3">
        <img src={logoMark} alt="" className="size-12" />
        <span className="font-display text-3xl font-extrabold text-primary">ecare+</span>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 sm:p-10">
        <h1 className="font-display text-2xl font-bold text-ink">Connexion professionnelle</h1>
        <p className="mt-2 text-sm text-muted">Saisissez vos identifiants d'accès.</p>

        <form
          noValidate
          onSubmit={(event) => void handleSubmit(event)}
          className="mt-6 flex flex-col gap-5"
        >
          {failure && (
            <Alert
              variant="error"
              title={
                failure === 'credentials'
                  ? 'Identifiant ou mot de passe incorrect.'
                  : "La connexion n'a pas pu aboutir."
              }
            >
              {failure === 'credentials'
                ? 'Vérifiez votre saisie puis réessayez.'
                : 'Vérifiez votre connexion internet puis réessayez.'}
            </Alert>
          )}

          <fieldset disabled={submitting} className="flex min-w-0 flex-col gap-5">
            <SelectField
              label="Structure sanitaire de rattachement"
              placeholder="Sélectionner"
              options={structureOptions}
              {...bind('structureId')}
            />
            <TextField
              label="Identifiant professionnel"
              autoComplete="username"
              {...bind('identifier')}
            />
            <PasswordField
              label="Mot de passe"
              autoComplete="current-password"
              {...bind('password')}
            />
          </fieldset>

          <Button type="submit" size="lg" fullWidth loading={submitting}>
            {submitting ? 'Connexion en cours…' : 'Se connecter au portail'}
          </Button>

          <p className="rounded-lg border border-warning-line bg-warning-soft px-4 py-3 text-xs leading-relaxed text-warning">
            Rappel de confidentialité : en accédant à ce portail de télésuivi, vous vous engagez à
            respecter strictement le secret médical et la protection des données de santé des
            patients.
          </p>
        </form>
      </div>

      {import.meta.env.DEV && (
        <div className="max-w-md text-center text-xs text-muted">
          <p>Comptes de démonstration (affichés en développement uniquement) :</p>
          {demoAccounts.map((account) => (
            <p key={account.identifier}>
              {roleLabels[account.role]} : {account.identifier} / {account.password}
            </p>
          ))}
        </div>
      )}
    </main>
  )
}
