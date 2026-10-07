import { Link } from 'react-router'
import { Page } from '@/components/layouts/Page'
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { buttonClassName } from '@/components/ui/styles'
import { ConditionBadges } from '@/features/patients/components/ConditionBadges'
import { usePatients } from '@/features/patients/hooks/usePatients'
import type { Patient } from '@/features/patients/types/patient'
import { formatDate } from '@/utils/formatDate'
import { getAge } from '@/utils/getAge'

const headClassName =
  'bg-page px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted uppercase first:rounded-l-lg last:rounded-r-lg'
const cellClassName =
  'border-y border-line px-4 py-3 first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r'

function PatientsTable({ patients }: { patients: Patient[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-176 border-separate border-spacing-y-2 text-sm">
        <thead>
          <tr>
            <th scope="col" className={headClassName}>
              Patient
            </th>
            <th scope="col" className={headClassName}>
              Pathologie
            </th>
            <th scope="col" className={headClassName}>
              Téléphone
            </th>
            <th scope="col" className={headClassName}>
              Dossier créé le
            </th>
            <th scope="col" className={headClassName}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            const fullName = `${patient.firstName} ${patient.lastName}`
            return (
              <tr key={patient.id}>
                <td className={cellClassName}>
                  <p className="font-semibold text-ink">{fullName}</p>
                  <p className="text-xs text-muted">
                    N° {patient.fileNumber} • {getAge(patient.birthDate)} ans
                  </p>
                </td>
                <td className={cellClassName}>
                  <ConditionBadges condition={patient.condition} />
                </td>
                <td className={`${cellClassName} whitespace-nowrap`}>{patient.phone}</td>
                <td className={`${cellClassName} whitespace-nowrap`}>
                  {formatDate(patient.createdAt)}
                </td>
                <td className={cellClassName}>
                  <div className="flex gap-2">
                    <Link
                      to={`/patients/${patient.id}`}
                      aria-label={`Consulter le dossier : ${fullName}`}
                      className={buttonClassName('primary', 'sm')}
                    >
                      Consulter
                    </Link>
                    <Link
                      to={`/patients/${patient.id}/modifier`}
                      aria-label={`Modifier le dossier : ${fullName}`}
                      className={buttonClassName('secondary', 'sm')}
                    >
                      Modifier
                    </Link>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function countLabel(count: number) {
  if (count === 0) return 'Aucun patient enregistré'
  return count === 1 ? '1 patient enregistré' : `${count} patients enregistrés`
}

export function PatientsPage() {
  const state = usePatients()

  return (
    <Page title="Liste des patients" description="Dossiers des patients suivis par la structure">
      {state.status === 'error' ? (
        <Alert variant="error" title="La liste des patients n'a pas pu être chargée.">
          Rechargez la page pour réessayer.
        </Alert>
      ) : (
        <Card
          title={state.status === 'success' ? countLabel(state.patients.length) : 'Patients'}
          action={
            <Link to="/patients/nouveau" className={buttonClassName('soft')}>
              <span aria-hidden="true">+</span>
              Ajouter un patient
            </Link>
          }
        >
          {state.status === 'loading' && (
            <p role="status" className="py-6 text-center text-sm text-muted">
              Chargement des patients…
            </p>
          )}
          {state.status === 'success' &&
            (state.patients.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">
                Utilisez « Ajouter un patient » pour créer le premier dossier.
              </p>
            ) : (
              <PatientsTable patients={state.patients} />
            ))}
        </Card>
      )}
    </Page>
  )
}
