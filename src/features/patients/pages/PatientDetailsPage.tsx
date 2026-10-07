import type { ReactNode } from 'react'
import { useLocation, useParams } from 'react-router'
import { Page } from '@/components/layouts/Page'
import { Alert } from '@/components/ui/Alert'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { ConditionBadges } from '@/features/patients/components/ConditionBadges'
import { PatientUnavailable } from '@/features/patients/components/PatientUnavailable'
import { usePatient } from '@/features/patients/hooks/usePatients'
import { conditionLabels, sexLabels } from '@/features/patients/labels'
import { formatDate } from '@/utils/formatDate'
import { getAge } from '@/utils/getAge'

const backLink = { to: '/patients', label: 'Retour à la liste des patients' }

function Details({ children }: { children: ReactNode }) {
  return <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">{children}</dl>
}

function Item({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</dt>
      <dd className={`text-sm ${value ? 'text-ink' : 'text-muted'}`}>{value ?? 'Non renseigné'}</dd>
    </div>
  )
}

export function PatientDetailsPage() {
  const { patientId } = useParams()
  const location = useLocation()
  const state = usePatient(patientId)
  // Présent uniquement quand on arrive ici juste après une création ou une modification.
  const notice: unknown = location.state?.notice

  if (state.status !== 'success') {
    return (
      <Page title="Dossier patient" backLink={backLink}>
        <PatientUnavailable status={state.status} />
      </Page>
    )
  }

  const { patient } = state
  const fullName = `${patient.firstName} ${patient.lastName}`
  const initials = `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`.toUpperCase()
  const born = patient.sex === 'F' ? 'Née' : 'Né'

  return (
    <Page
      title="Dossier patient"
      description={`Dossier n° ${patient.fileNumber}, créé le ${formatDate(patient.createdAt)}`}
      backLink={backLink}
    >
      {notice === 'created' && (
        <Alert variant="success" title="Le dossier patient a été créé.">
          Dossier n° {patient.fileNumber} enregistré pour {fullName}.
        </Alert>
      )}
      {notice === 'updated' && (
        <Alert variant="success" title="Le dossier patient a été modifié.">
          Les nouvelles informations sont enregistrées.
        </Alert>
      )}

      <Card>
        <div className="flex flex-wrap items-center gap-5">
          <Avatar initials={initials} size="lg" />
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-2xl font-bold text-ink">{fullName}</h2>
              <ConditionBadges condition={patient.condition} />
            </div>
            <p className="text-sm text-muted">
              {born} le {formatDate(patient.birthDate)} ({getAge(patient.birthDate)} ans) • Dossier n°{' '}
              {patient.fileNumber}
              {patient.address && ` • ${patient.address}`}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Informations personnelles">
          <Details>
            <Item label="Nom" value={patient.lastName} />
            <Item label="Prénom(s)" value={patient.firstName} />
            <Item label="Sexe" value={sexLabels[patient.sex]} />
            <Item label="Date de naissance" value={formatDate(patient.birthDate)} />
          </Details>
        </Card>

        <Card title="Coordonnées">
          <Details>
            <Item label="Téléphone" value={patient.phone} />
            <Item label="Adresse e-mail" value={patient.email} />
            <Item label="Adresse" value={patient.address} />
          </Details>
        </Card>

        <Card title="Suivi">
          <Details>
            <Item label="Pathologie suivie" value={conditionLabels[patient.condition]} />
          </Details>
        </Card>

        <Card title="Personne à prévenir">
          <Details>
            <Item label="Nom complet" value={patient.emergencyContactName} />
            <Item label="Téléphone" value={patient.emergencyContactPhone} />
          </Details>
        </Card>
      </div>
    </Page>
  )
}
