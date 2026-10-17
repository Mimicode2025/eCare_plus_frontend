import { useEffect, useState, type FormEvent } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PasswordField } from '@/components/ui/PasswordField'
import {
  CodeDeliveryUnavailableError,
  InvalidResetCodeError,
  meetsPasswordRules,
  OtpField,
  PASSWORD_MAX_LENGTH,
  PasswordRuleList,
  requestPasswordCode,
  RESET_CODE_LENGTH,
  resetPassword,
  verifyPasswordCode,
} from '@/features/auth'
import { useFeedback } from '@/hooks/useFeedback'

/** Délai avant de pouvoir redemander un code. */
const RESEND_DELAY_SECONDS = 30

type Step = 'idle' | 'code' | 'password'

const linkClassName =
  'font-semibold text-primary-strong underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60'

const unknownError = {
  title: "La demande n'a pas pu aboutir.",
  hint: 'Vérifiez votre connexion internet puis réessayez.',
}

/**
 * Changement du mot de passe de l'utilisateur connecté : un code est envoyé à son adresse
 * e-mail, comme pour un mot de passe oublié, puis il choisit le nouveau mot de passe.
 */
export function PasswordChangeCard({ email }: { email?: string }) {
  const [step, setStep] = useState<Step>('idle')
  const [code, setCode] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [fieldError, setFieldError] = useState<string>()
  const [failure, setFailure] = useState<{ title: string; hint: string }>()
  const [submitting, setSubmitting] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const feedback = useFeedback()

  useEffect(() => {
    if (resendIn <= 0) return
    const timer = setTimeout(() => setResendIn((current) => current - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendIn])

  const reset = () => {
    setStep('idle')
    setCode('')
    setResetToken('')
    setPassword('')
    setConfirmation('')
    setFieldError(undefined)
    setFailure(undefined)
  }

  const sendCode = async () => {
    if (!email) return
    setSubmitting(true)
    setFailure(undefined)
    setFieldError(undefined)
    try {
      await requestPasswordCode(email)
      setCode('')
      setResendIn(RESEND_DELAY_SECONDS)
      setStep('code')
    } catch (error) {
      setFailure(
        error instanceof CodeDeliveryUnavailableError
          ? {
              title: "L'envoi des codes est momentanément indisponible.",
              hint: "Réessayez plus tard ou contactez l'administrateur de votre structure.",
            }
          : unknownError,
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) return
    if (code.length < RESET_CODE_LENGTH) {
      return setFieldError(`Saisissez les ${RESET_CODE_LENGTH} chiffres du code.`)
    }
    setSubmitting(true)
    setFieldError(undefined)
    setFailure(undefined)
    try {
      setResetToken(await verifyPasswordCode(email, code))
      setStep('password')
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

  const handlePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!meetsPasswordRules(password)) {
      return setFieldError('Le mot de passe ne respecte pas encore toutes les règles.')
    }
    if (password !== confirmation) {
      return setFieldError('Les deux mots de passe ne sont pas identiques.')
    }
    setSubmitting(true)
    setFieldError(undefined)
    setFailure(undefined)
    try {
      await resetPassword(resetToken, password)
      reset()
      feedback.success(
        'Mot de passe modifié',
        'Utilisez votre nouveau mot de passe à la prochaine connexion.',
      )
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

  const failureAlert = failure && (
    <Alert variant="error" title={failure.title}>
      {failure.hint}
    </Alert>
  )

  return (
    <Card title="Mot de passe">
      {!email ? (
        <p className="text-sm text-muted">
          Aucune adresse e-mail n'est associée à votre compte : contactez l'administrateur de votre
          structure pour changer votre mot de passe.
        </p>
      ) : step === 'idle' ? (
        <div className="flex flex-col gap-5">
          {failureAlert}
          <p className="text-sm text-muted">
            Pour protéger votre compte, un code à {RESET_CODE_LENGTH} chiffres sera envoyé à{' '}
            <strong className="font-semibold text-ink">{email}</strong> avant de choisir un nouveau
            mot de passe.
          </p>
          <Button
            variant="secondary"
            loading={submitting}
            onClick={() => void sendCode()}
            aria-label="Changer le mot de passe : recevoir un code par e-mail"
          >
            Changer le mot de passe
          </Button>
        </div>
      ) : step === 'code' ? (
        <form
          noValidate
          onSubmit={(event) => void handleCode(event)}
          className="flex flex-col gap-5"
        >
          {failureAlert}
          <p className="text-sm text-muted">
            Un code vient d'être envoyé à{' '}
            <strong className="font-semibold text-ink">{email}</strong>. Il est valable 10 minutes.
          </p>
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
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <button type="button" onClick={reset} className={linkClassName}>
              Annuler
            </button>
            {resendIn > 0 ? (
              <p className="text-muted tabular-nums">Nouveau code possible dans {resendIn} s</p>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={() => void sendCode()}
                className={linkClassName}
              >
                Renvoyer le code
              </button>
            )}
          </div>
          <Button type="submit" loading={submitting}>
            Vérifier le code
          </Button>
        </form>
      ) : (
        <form
          noValidate
          onSubmit={(event) => void handlePassword(event)}
          className="flex flex-col gap-5"
        >
          {failureAlert}
          <fieldset disabled={submitting} className="flex min-w-0 flex-col gap-5">
            <PasswordField
              label="Nouveau mot de passe"
              autoComplete="new-password"
              showRequirement={false}
              maxLength={PASSWORD_MAX_LENGTH}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <PasswordRuleList password={password} />
            <PasswordField
              label="Confirmez le mot de passe"
              autoComplete="new-password"
              showRequirement={false}
              maxLength={PASSWORD_MAX_LENGTH}
              value={confirmation}
              error={fieldError}
              onChange={(event) => {
                setConfirmation(event.target.value)
                if (fieldError) setFieldError(undefined)
              }}
            />
          </fieldset>
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" disabled={submitting} onClick={reset}>
              Annuler
            </Button>
            <Button type="submit" loading={submitting}>
              Enregistrer le mot de passe
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}
