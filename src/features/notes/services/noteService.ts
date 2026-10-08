import type { ClinicalNote } from '@/features/notes/types/note'

/*
 * DONNÉES FICTIVES — aucun appel API.
 * Ce service simule les observations cliniques tant que le contrat d'API n'est pas défini.
 * Les notes ci-dessous sont inventées ; celles ajoutées sont perdues au rechargement.
 */

const SIMULATED_DELAY_MS = 700

const notes: ClinicalNote[] = [
  {
    id: 'note-1',
    patientId: 'demo-3',
    author: 'Dr Kofi Démo',
    createdAt: '2026-10-05T18:45:00',
    text: 'Le patient signale des mesures plus élevées après le repas du soir. Mesures à poursuivre sur les prochains jours avant le prochain échange.',
  },
  {
    id: 'note-2',
    patientId: 'demo-2',
    author: 'Dr Kofi Démo',
    createdAt: '2026-10-02T10:20:00',
    text: 'Patiente jointe par téléphone : mesures prises le matin et le soir, sans difficulté particulière.',
  },
]

function simulateNetwork() {
  return new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
}

/** Observations d'un patient, de la plus récente à la plus ancienne. */
export async function listNotes(patientId: string): Promise<ClinicalNote[]> {
  await simulateNetwork()
  return notes
    .filter((note) => note.patientId === patientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function addNote(patientId: string, text: string, author: string): Promise<ClinicalNote> {
  await simulateNetwork()
  const note: ClinicalNote = {
    id: crypto.randomUUID(),
    patientId,
    author,
    createdAt: new Date().toISOString(),
    text,
  }
  notes.push(note)
  return note
}
