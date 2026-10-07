import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Page } from '@/components/layouts/Page'
import { Alert } from '@/components/ui/Alert'
import { PatientForm } from '@/features/patients/components/PatientForm'
import { createPatient } from '@/features/patients/services/patientService'
import type { PatientInput } from '@/features/patients/types/patient'

export function CreatePatientPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [submitFailed, setSubmitFailed] = useState(false)

  const handleSubmit = async (input: PatientInput) => {
    setSubmitting(true)
    setSubmitFailed(false)
    try {
      const patient = await createPatient(input)
      await navigate(`/patients/${patient.id}`, { state: { notice: 'created' } })
    } catch {
      setSubmitFailed(true)
      setSubmitting(false)
    }
  }

  return (
    <Page
      title="Nouveau dossier patient"
      description="Renseignez les informations essentielles du patient"
      backLink={{ to: '/patients', label: 'Retour à la liste des patients' }}
    >
      <div className="flex w-full max-w-4xl flex-col gap-6">
        {submitFailed && (
          <Alert variant="error" title="Le dossier n'a pas pu être créé.">
            Vos informations sont conservées. Vérifiez votre connexion puis réessayez.
          </Alert>
        )}

        <PatientForm
          submitting={submitting}
          onSubmit={(input) => void handleSubmit(input)}
          onCancel={() => void navigate('/patients')}
        />
      </div>
    </Page>
  )
}
