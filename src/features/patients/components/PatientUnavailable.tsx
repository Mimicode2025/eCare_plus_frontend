import { Alert } from '@/components/ui/Alert'
import { PageSkeleton } from '@/components/ui/Skeleton'

/** Contenu affiché à la place du dossier tant qu'il charge, ou s'il ne peut pas être affiché. */
export function PatientUnavailable({ status }: { status: 'loading' | 'notFound' | 'error' }) {
  if (status === 'loading') {
    return <PageSkeleton label="Chargement du dossier…" />
  }

  return status === 'notFound' ? (
    <Alert variant="error" title="Ce dossier patient est introuvable.">
      Vérifiez le lien utilisé ou revenez à la liste des patients.
    </Alert>
  ) : (
    <Alert variant="error" title="Le dossier n'a pas pu être chargé.">
      Rechargez la page pour réessayer.
    </Alert>
  )
}
