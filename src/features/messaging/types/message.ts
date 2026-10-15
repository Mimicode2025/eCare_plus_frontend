/** Enregistrement audio joint à un message vocal. */
export interface VoiceNote {
  url: string
  /*
   * Durée mesurée à l'enregistrement : les fichiers produits par le navigateur n'indiquent pas
   * toujours la leur avant d'avoir été lus en entier.
   */
  durationSeconds: number
  /** Hauteur des barres, de 0 à 1 ; calculée à la lecture si l'enregistrement n'en fournit pas. */
  waveform?: number[]
}

export interface Message {
  id: string
  conversationId: string
  /** Le backend renvoie l'identifiant de l'expéditeur ; l'interface n'a besoin que de son côté. */
  author: 'patient' | 'professionnel'
  /** Vide pour un message vocal. */
  text: string
  voice?: VoiceNote
  /** Date et heure d'envoi au format ISO-8601. */
  sentAt: string
}

export interface Conversation {
  id: string
  patientId: string
  /*
   * Hypothèses d'affichage : le nom du patient, son numéro de dossier, le dernier message et
   * le nombre de non-lus ne figurent pas dans la réponse actuelle du backend.
   */
  patientName: string
  patientFileNumber: string
  lastMessage?: Message
  /** Messages du patient que le professionnel n'a pas encore lus. */
  unreadCount: number
}
