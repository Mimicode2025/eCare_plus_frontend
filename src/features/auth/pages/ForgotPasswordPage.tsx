import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { PasswordField } from '@/components/ui/PasswordField'
import { buttonClassName } from '@/components/ui/styles'
import { TextField } from '@/components/ui/TextField'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { OtpField } from '@/features/auth/components/OtpField'
import { PasswordRuleList } from '@/features/auth/components/PasswordRuleList'
import {
  PASSWORD_MAX_LENGTH,
  passwordRules,
  RESET_CODE_LENGTH,
} from '@/features/auth/passwordRules'
import {
  CodeDeliveryUnavailableError,
  InvalidResetCodeError,
  requestPasswordCode,
  resetPassword,
  verifyPasswordCode,
} from '@/features/auth/services/authService'

/** Délai avant de pouvoir redemander un code. */
const RESEND_DELAY_SECONDS = 30

type Step = 'email' | 'code' | 'password' | 'done'
const stepNumbers: Record<Exclude<Step, 'done'>, number> = { email: 1, code: 2, password: 3 }

const linkClassName =
  'font-semibold text-primary-strong underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-primary'

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

function StepIndicator({ step }: { step: Exclude<Step, 'done'> }) {
  const current = stepNumbers[step]
  return (
    <div className="mb-6 flex flex-col gap-2">
      <p className="text-xs font-semibold text-muted">Étape {current} sur 3</p>
      <div aria-hidden="true" className="flex gap-2">
        {[1, 2, 3].map((number) => (
          <span
            key={number}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              number <= current ? 'bg-primary' : 'bg-line'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

const unknownError = {
  title: "La demande n'a pas pu aboutir.",
  hint: 'Vérifiez votre connexion internet puis réessayez.',
}

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [fieldError, setFieldError] = useState<string>()
  const [failure, setFailure] = useState<{ title: string; hint: string }>()
  const [submitting, setSubmitting] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    if (resendIn <= 0) return
    const timer = setTimeout(() => setResendIn((current) => current - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendIn])

  const goTo = (next: Step) => {
    setStep(next)
    setFieldError(undefined)
    setFailure(undefined)
  }

  /** Envoi (ou renvoi) du code ; renvoie `true` si la demande a été acceptée. */
  const sendCode = async () => {
    setSubmitting(true)
    setFailure(undefined)
    try {
      await requestPasswordCode(email)
      setResendIn(RESEND_DELAY_SECONDS)
      return true
    } catch (error) {
      setFailure(
        error instanceof CodeDeliveryUnavailableError
          ? {
              title: "L'envoi des codes est momentanément indisponible.",
              hint: "Réessayez plus tard ou contactez l'administrateur de votre structure.",
            }
          : unknownError,
      )
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const handleEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return setFieldError('Saisissez votre adresse e-mail.')
    if (!isValidEmail(email))
      return setFieldError('Saisissez une adresse e-mail valide, par exemple nom@exemple.com.')
    setFieldError(undefined)
    if (await sendCode()) {
      setCode('')
      setResent(false)
      goTo('code')
    }
  }

  const handleResend = async () => {
    setCode('')
    setFieldError(undefined)
    setResent(await sendCode())
  }

  const handleCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (code.length < RESET_CODE_LENGTH)
      return setFieldError(`Saisissez les ${RESET_CODE_LENGTH} chiffres du code.`)
    setSubmitting(true)
    setFieldError(undefined)
    setFailure(undefined)
    try {
      setResetToken(await verifyPasswordCode(email, code))
      goTo('password')
    } catch (error) {
      if (error instanceof InvalidResetCodeError) {
        setFieldError('Code incorrect ou expiré. Vérifiez le code reçu, ou demandez-en un nouveau.')
      } else {
        setFailure(unknownError)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const unmetRule = passwordRules.find((rule) => !rule.test(password))

  const handlePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (unmetRule) return setFieldError('Le mot de passe ne respecte pas encore toutes les règles.')
    if (password !== confirmation)
      return setFieldError('Les deux mots de passe ne sont pas identiques.')
    setSubmitting(true)
    setFieldError(undefined)
    setFailure(undefined)
    try {
      await resetPassword(resetToken, password)
      goTo('done')
    } catch (error) {
      setFailure(
        error instanceof InvalidResetCodeError
          ? {
              title: 'Le délai pour changer votre mot de passe est dépassé.',
              hint: 'Demandez un nouveau code pour recommencer.',
            }
          : unknownError,
      )
    } finally {
      setSubmitting(false)
    }
  }

  const backToLogin = (
    <p className="mt-6 text-center text-sm text-muted">
      <Link to="/connexion" className={linkClassName}>
        Revenir à la connexion
      </Link>
    </p>
  )

  if (step === 'done') {
    return (
      <AuthLayout title="Mot de passe modifié">
        <div className="flex flex-col items-center gap-6 text-center">
          <span
            aria-hidden="true"
            className="flex size-20 items-center justify-center rounded-full bg-success-soft text-success"
          >
            <svg
              className="size-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="m5 12.5 4.5 4.5L19 7.5"
                pathLength="1"
                strokeDasharray="1"
                className="animate-draw"
              />
            </svg>
          </span>
          <p className="text-sm text-muted">
            Votre nouveau mot de passe est enregistré. Connectez-vous avec celui-ci dès maintenant.
          </p>
          <Link
            to="/connexion"
            state={{ identifier: email.trim() }}
            className={`${buttonClassName('primary', 'lg')} w-full`}
          >
            Se connecter
          </Link>
        </div>
      </AuthLayout>
    )
  }

  const failureAlert = failure && (
    <Alert variant="error" title={failure.title}>
      {failure.hint}
    </Alert>
  )

  if (step === 'code') {
    return (
      <AuthLayout
        title="Saisissez le code reçu"
        description={
          <>
            Si un compte correspond à{' '}
            <strong className="font-semibold text-ink">{email.trim()}</strong>, un code à{' '}
            {RESET_CODE_LENGTH} chiffres vient d'y être envoyé. Il est valable 10 minutes.
          </>
        }
      >
        <StepIndicator step="code" />
        <form
          noValidate
          onSubmit={(event) => void handleCode(event)}
          className="flex flex-col gap-6"
        >
          {failureAlert}
          {resent && !failure && (
            <Alert variant="success" title="Un nouveau code a été envoyé.">
              Seul le dernier code reçu est valable.
            </Alert>
          )}
          <OtpField
            length={RESET_CODE_LENGTH}
            label="Code de vérification"
            value={code}
            onChange={(next) => {
              setCode(next)
              if (fieldError) setFieldError(undefined)
            }}
            error={fieldError}
            disabled={submitting}
            autoFocus
          />
          <Button type="submit" size="lg" fullWidth loading={submitting}>
            Vérifier le code
          </Button>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <button type="button" onClick={() => goTo('email')} className={linkClassName}>
              Modifier l'adresse e-mail
            </button>
            {resendIn > 0 ? (
              <p className="text-muted tabular-nums">Nouveau code possible dans {resendIn} s</p>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleResend()}
                className={`${linkClassName} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                Renvoyer le code
              </button>
            )}
          </div>
        </form>
        {backToLogin}
      </AuthLayout>
    )
  }

  if (step === 'password') {
    return (
      <AuthLayout
        title="Choisissez un nouveau mot de passe"
        description="Il remplacera votre ancien mot de passe."
      >
        <StepIndicator step="password" />
        <form
          noValidate
          onSubmit={(event) => void handlePassword(event)}
          className="flex flex-col gap-5"
        >
          {failureAlert}
          {failure && (
            <button
              type="button"
              onClick={() => goTo('email')}
              className={`${linkClassName} self-start text-sm`}
            >
              Demander un nouveau code
            </button>
          )}
          <fieldset disabled={submitting} className="flex min-w-0 flex-col gap-5">
            <PasswordField
              label="Nouveau mot de passe"
              autoComplete="new-password"
              maxLength={PASSWORD_MAX_LENGTH}
              showRequirement={false}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <PasswordRuleList password={password} />
            <PasswordField
              label="Confirmez le mot de passe"
              autoComplete="new-password"
              maxLength={PASSWORD_MAX_LENGTH}
              showRequirement={false}
              value={confirmation}
              error={fieldError}
              onChange={(event) => {
                setConfirmation(event.target.value)
                if (fieldError) setFieldError(undefined)
              }}
            />
          </fieldset>
          <Button type="submit" size="lg" fullWidth loading={submitting}>
            Enregistrer le mot de passe
          </Button>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Mot de passe oublié"
      description="Indiquez l'adresse e-mail de votre compte : nous vous enverrons un code pour choisir un nouveau mot de passe."
    >
      <StepIndicator step="email" />
      <form
        noValidate
        onSubmit={(event) => void handleEmail(event)}
        className="flex flex-col gap-5"
      >
        {failureAlert}
        <TextField
          label="Adresse e-mail"
          type="email"
          autoComplete="email"
          autoFocus
          required
          showRequirement={false}
          disabled={submitting}
          value={email}
          error={fieldError}
          onChange={(event) => {
            setEmail(event.target.value)
            if (fieldError) setFieldError(undefined)
          }}
        />
        <Button type="submit" size="lg" fullWidth loading={submitting}>
          Recevoir un code
        </Button>
      </form>
      {backToLogin}
    </AuthLayout>
  )
}
