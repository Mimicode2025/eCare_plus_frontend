import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import logoMark from '@/assets/logo-mark.png'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { PasswordField } from '@/components/ui/PasswordField'
import { TextField } from '@/components/ui/TextField'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  InvalidCredentialsError,
  UnsupportedRoleError,
} from '@/features/auth/services/authService'

type LoginField = 'identifier' | 'password'
type LoginErrors = Partial<Record<LoginField, string>>
type LoginFailure = 'credentials' | 'role' | 'unknown'

const fieldOrder: LoginField[] = ['identifier', 'password']
const fieldId = (field: LoginField) => `login-${field}`

const requiredMessages: Record<LoginField, string> = {
  identifier: 'Saisissez votre adresse e-mail ou votre numéro de téléphone.',
  password: 'Saisissez votre mot de passe.',
}

const failureMessages: Record<LoginFailure, { title: string; hint: string }> = {
  credentials: {
    title: 'Identifiant ou mot de passe incorrect.',
    hint: 'Vérifiez votre saisie puis réessayez.',
  },
  role: {
    title: "Ce compte n'a pas accès au portail professionnel.",
    hint: 'Rapprochez-vous de votre structure sanitaire pour vérifier vos droits.',
  },
  unknown: {
    title: "La connexion n'a pas pu aboutir.",
    hint: 'Vérifiez votre connexion internet puis réessayez.',
  },
}

function toFailure(error: unknown): LoginFailure {
  if (error instanceof InvalidCredentialsError) return 'credentials'
  if (error instanceof UnsupportedRoleError) return 'role'
  return 'unknown'
}

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState<Record<LoginField, string>>({
    identifier: '',
    password: '',
  })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [failure, setFailure] = useState<LoginFailure | null>(null)

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
      setFailure(toFailure(error))
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
            <Alert variant="error" title={failureMessages[failure].title}>
              {failureMessages[failure].hint}
            </Alert>
          )}

          <fieldset disabled={submitting} className="flex min-w-0 flex-col gap-5">
            <TextField
              label="E-mail ou numéro de téléphone"
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
        </form>
      </div>
    </main>
  )
}
