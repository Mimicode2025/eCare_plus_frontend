import type { CallRecord, CallSession, CallType } from '@/features/messaging/types/call'
import { demoDateTime, simulateNetwork } from '@/lib/demoData'

/*
 * DONNÉES FICTIVES — aucun appel API.
 * Ce service simule les appels en mémoire : le patient décroche automatiquement après quelques
 * secondes et aucun son ni aucune image ne lui est transmis. Seuls le micro et la caméra du
 * médecin sont réellement ouverts. Les appels passés sont perdus au rechargement.
 *
 * Branchement futur : `POST /conversations/{id}/calls` (cahier des charges, §5.2) crée la session
 * et prévient le patient ; la salle est ensuite ouverte sur le service d'appel retenu avec
 * l'application mobile.
 */

/** Délai avant que le patient fictif ne décroche. */
const DEMO_ANSWER_DELAY_MS = 3000

const calls: CallRecord[] = [
  {
    id: 'call-demo-1',
    conversationId: 'conv-demo-1',
    type: 'audio',
    initiator: 'patient',
    startedAt: demoDateTime(-1, '18:10'),
    durationSeconds: 252,
  },
  {
    id: 'call-demo-2',
    conversationId: 'conv-demo-2',
    type: 'video',
    initiator: 'professionnel',
    startedAt: demoDateTime(-3, '10:30'),
  },
]

/** Appels d'une conversation, du plus ancien au plus récent. */
export async function listCalls(conversationId: string): Promise<CallRecord[]> {
  await simulateNetwork()
  return calls
    .filter((call) => call.conversationId === conversationId)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
}

export async function startCall(conversationId: string, type: CallType): Promise<CallSession> {
  await simulateNetwork()
  return { id: crypto.randomUUID(), conversationId, type, roomId: crypto.randomUUID() }
}

/**
 * Prévient quand le patient décroche ; la fonction renvoyée annule l'écoute.
 * Simulé : le patient décroche toujours, après un court délai.
 */
export function onCallAnswered(_session: CallSession, onAnswered: () => void): () => void {
  const timer = setTimeout(onAnswered, DEMO_ANSWER_DELAY_MS)
  return () => clearTimeout(timer)
}

export async function endCall(
  session: CallSession,
  startedAt: string,
  durationSeconds?: number,
): Promise<CallRecord> {
  await simulateNetwork()
  const record: CallRecord = {
    id: session.id,
    conversationId: session.conversationId,
    type: session.type,
    initiator: 'professionnel',
    startedAt,
    durationSeconds,
  }
  calls.push(record)
  return record
}
