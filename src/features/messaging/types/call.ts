export type CallType = 'audio' | 'video'

/** Appel ouvert : la salle à rejoindre sur le service d'appel, créée par le backend. */
export interface CallSession {
  id: string
  conversationId: string
  type: CallType
  /** Identifiant de salle aléatoire et non devinable, propre à cet appel. */
  roomId: string
}

/** Trace d'un appel terminé, affichée dans le fil de la conversation. */
export interface CallRecord {
  id: string
  conversationId: string
  type: CallType
  /** Côté de la personne qui a lancé l'appel. */
  initiator: 'patient' | 'professionnel'
  /** Début de l'appel au format ISO-8601 (début de la sonnerie s'il n'a pas abouti). */
  startedAt: string
  /** Durée de la communication en secondes ; absente si personne n'a répondu. */
  durationSeconds?: number
}
