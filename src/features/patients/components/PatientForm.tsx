import type { FormEvent, ReactNode } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SelectField } from '@/components/ui/SelectField'
import { TextField } from '@/components/ui/TextField'
import {
  patientFormFields,
  todayIsoDate,
  usePatientForm,
  type PatientFormField,
} from '@/features/patients/hooks/usePatientForm'
import { conditionLabels, sexLabels } from '@/features/patients/labels'
import type { PatientInput } from '@/features/patients/types/patient'

interface PatientFormProps {
  /** Patient à modifier. Absent, le formulaire sert à créer un dossier. */
  initialPatient?: PatientInput
  submitting: boolean
  onSubmit: (input: PatientInput) => void
  onCancel: () => void
}

const sexOptions = Object.entries(sexLabels).map(([value, label]) => ({ value, label }))
const conditionOptions = Object.entries(conditionLabels).map(([value, label]) => ({ value, label }))

const fieldId = (field: PatientFormField) => `patient-${field}`

const texts = {
  create: {
    errorHelp: 'Corrigez les champs signalés avant de créer le dossier.',
    cancelConfirm: 'Abandonner la création du dossier ? Les informations saisies seront perdues.',
    submit: 'Créer le dossier',
    submitting: 'Création en cours…',
  },
  edit: {
    errorHelp: "Corrigez les champs signalés avant d'enregistrer.",
    cancelConfirm: 'Abandonner les modifications ? Elles ne seront pas enregistrées.',
    submit: 'Enregistrer les modifications',
    submitting: 'Enregistrement en cours…',
  },
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card title={title}>
      <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">{children}</div>
    </Card>
  )
}

export function PatientForm({ initialPatient, submitting, onSubmit, onCancel }: PatientFormProps) {
  const { values, errors, isDirty, setValue, validateOnBlur, submit } =
    usePatientForm(initialPatient)
  const text = initialPatient ? texts.edit : texts.create
  const errorCount = Object.keys(errors).length

  /** Propriétés communes à tous les champs, liées à l'état du formulaire. */
  const bind = (field: PatientFormField) => ({
    id: fieldId(field),
    name: field,
    value: values[field],
    error: errors[field],
    onChange: (event: { target: { value: string } }) => setValue(field, event.target.value),
    onBlur: () => validateOnBlur(field),
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = submit()
    if ('input' in result) {
      onSubmit(result.input)
      return
    }
    const firstInvalid = patientFormFields.find((field) => result.errors[field])
    if (firstInvalid) document.getElementById(fieldId(firstInvalid))?.focus()
  }

  const handleCancel = () => {
    if (!isDirty || window.confirm(text.cancelConfirm)) onCancel()
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
      <p className="text-sm text-muted">
        Les champs marqués d'un astérisque (<span className="text-danger">*</span>) sont obligatoires.
      </p>

      {errorCount > 0 && (
        <Alert
          variant="error"
          title={
            errorCount === 1
              ? 'Le formulaire contient 1 erreur.'
              : `Le formulaire contient ${errorCount} erreurs.`
          }
        >
          {text.errorHelp}
        </Alert>
      )}

      <fieldset disabled={submitting} className="flex min-w-0 flex-col gap-6">
        <FormSection title="Identité">
          <TextField label="Nom" required autoComplete="off" {...bind('lastName')} />
          <TextField label="Prénom(s)" required autoComplete="off" {...bind('firstName')} />
          <SelectField
            label="Sexe"
            required
            placeholder="Sélectionner"
            options={sexOptions}
            {...bind('sex')}
          />
          <TextField
            label="Date de naissance"
            type="date"
            required
            max={todayIsoDate()}
            {...bind('birthDate')}
          />
        </FormSection>

        <FormSection title="Coordonnées">
          <TextField
            label="Téléphone"
            type="tel"
            required
            autoComplete="off"
            hint="Exemple : +228 90 00 00 00"
            {...bind('phone')}
          />
          <TextField label="Adresse e-mail" type="email" autoComplete="off" {...bind('email')} />
          <div className="md:col-span-2">
            <TextField
              label="Adresse"
              autoComplete="off"
              hint="Quartier, ville"
              {...bind('address')}
            />
          </div>
        </FormSection>

        <FormSection title="Suivi">
          <SelectField
            label="Pathologie suivie"
            required
            placeholder="Sélectionner"
            options={conditionOptions}
            {...bind('condition')}
          />
        </FormSection>

        <FormSection title="Personne à prévenir">
          <TextField label="Nom complet" autoComplete="off" {...bind('emergencyContactName')} />
          <TextField
            label="Téléphone"
            type="tel"
            autoComplete="off"
            {...bind('emergencyContactPhone')}
          />
        </FormSection>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={handleCancel} disabled={submitting}>
          Annuler
        </Button>
        <Button type="submit" loading={submitting}>
          {submitting ? text.submitting : text.submit}
        </Button>
      </div>
    </form>
  )
}
