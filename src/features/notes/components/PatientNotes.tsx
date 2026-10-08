import { useId, useState, type FormEvent } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TextareaField } from '@/components/ui/TextareaField'
import { addNote, listNotes } from '@/features/notes/services/noteService'
import type { ClinicalNote } from '@/features/notes/types/note'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatDateTime } from '@/utils/formatDateTime'

interface PatientNotesProps {
  patientId: string
  /** Nom du professionnel connecté, enregistré comme auteur des nouvelles observations. */
  authorName: string
}

/** Observations cliniques d'un patient : notes existantes et ajout d'une nouvelle note. */
export function PatientNotes({ patientId, authorName }: PatientNotesProps) {
  const state = useAsyncData(`notes:${patientId}`, () => listNotes(patientId))
  const fieldId = useId()
  // Notes ajoutées depuis l'ouverture de l'écran, les plus récentes en premier.
  const [added, setAdded] = useState<ClinicalNote[]>([])
  const [text, setText] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [submitFailed, setSubmitFailed] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!text.trim()) {
      setError('Veuillez renseigner une observation.')
      document.getElementById(fieldId)?.focus()
      return
    }
    setSubmitting(true)
    setSubmitFailed(false)
    try {
      const note = await addNote(patientId, text.trim(), authorName)
      setAdded((current) => [note, ...current])
      setText('')
    } catch {
      setSubmitFailed(true)
    } finally {
      setSubmitting(false)
    }
  }

  const notes =
    state.status === 'success'
      ? [...added.filter((note) => note.patientId === patientId), ...state.data]
      : []

  return (
    <Card title="Observations cliniques et notes de suivi">
      <div className="flex flex-col gap-5">
        {state.status === 'loading' && (
          <p role="status" className="text-sm text-muted">
            Chargement des observations…
          </p>
        )}
        {state.status === 'error' && (
          <Alert variant="error" title="Les observations n'ont pas pu être chargées.">
            Rechargez la page pour réessayer.
          </Alert>
        )}
        {state.status === 'success' && notes.length === 0 && (
          <p className="text-sm text-muted">Aucune observation pour ce patient.</p>
        )}
        {notes.length > 0 && (
          <ul className="flex flex-col gap-3" aria-live="polite">
            {notes.map((note) => (
              <li key={note.id} className="rounded-lg bg-page p-4">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  {note.author} ({formatDateTime(note.createdAt)})
                </p>
                <p className="mt-2 text-sm whitespace-pre-line text-ink">{note.text}</p>
              </li>
            ))}
          </ul>
        )}

        {state.status === 'success' && (
          <form
            noValidate
            onSubmit={(event) => void handleSubmit(event)}
            className="flex flex-col gap-4"
          >
            {submitFailed && (
              <Alert variant="error" title="L'observation n'a pas pu être enregistrée.">
                Votre texte est conservé. Vérifiez votre connexion puis réessayez.
              </Alert>
            )}
            <TextareaField
              id={fieldId}
              label="Nouvelle observation clinique"
              required
              placeholder="Saisissez vos notes cliniques ici…"
              value={text}
              error={error}
              disabled={submitting}
              onChange={(event) => {
                setText(event.target.value)
                if (error && event.target.value.trim()) setError(undefined)
              }}
            />
            <Button type="submit" loading={submitting}>
              {submitting ? 'Enregistrement en cours…' : "Ajouter l'observation"}
            </Button>
          </form>
        )}
      </div>
    </Card>
  )
}
