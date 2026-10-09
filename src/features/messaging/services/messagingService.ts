import type { Conversation, Message } from '@/features/messaging/types/message'
import { demoDateTime, simulateNetwork } from '@/lib/demoData'

/*
 * DONNÉES FICTIVES — aucun appel API.
 * Ce service simule la messagerie en mémoire. Les conversations et les messages ci-dessous
 * sont inventés ; les messages envoyés sont perdus au rechargement et aucun patient ne les
 * reçoit.
 *
 * Branchement futur : le backend expose `GET /mobile/conversations`,
 * `GET|POST /mobile/conversations/{id}/messages` et `POST /mobile/conversations/{id}/lecture`.
 */

/** Longueur maximale d'un message acceptée par le backend. */
export const MESSAGE_MAX_LENGTH = 2000

const conversations = [
  { id: 'conv-demo-1', patientId: 'demo-3', patientName: 'Kodjo Test', patientFileNumber: 'ECP-00003' },
  { id: 'conv-demo-2', patientId: 'demo-2', patientName: 'Afi Fictive', patientFileNumber: 'ECP-00002' },
  {
    id: 'conv-demo-3',
    patientId: 'demo-1',
    patientName: 'Jean Kossi Exemple',
    patientFileNumber: 'ECP-00001',
  },
]

const messages: Message[] = [
  {
    id: 'msg-demo-1',
    conversationId: 'conv-demo-1',
    author: 'professionnel',
    text: 'Bonjour, pensez à noter vos mesures après le repas du soir cette semaine.',
    sentAt: demoDateTime(-2, '17:40'),
  },
  {
    id: 'msg-demo-2',
    conversationId: 'conv-demo-1',
    author: 'patient',
    text: "Bonjour docteur, c'est noté. J'ai enregistré celle d'hier soir.",
    sentAt: demoDateTime(-1, '20:25'),
  },
  {
    id: 'msg-demo-3',
    conversationId: 'conv-demo-1',
    author: 'patient',
    text: 'Est-ce que je dois venir à jeun pour le rendez-vous ?',
    sentAt: demoDateTime(0, '07:50'),
  },
  {
    id: 'msg-demo-4',
    conversationId: 'conv-demo-2',
    author: 'patient',
    text: "Bonjour, mon tensiomètre n'a plus de piles, je reprends les mesures demain.",
    sentAt: demoDateTime(-3, '09:15'),
  },
  {
    id: 'msg-demo-5',
    conversationId: 'conv-demo-2',
    author: 'professionnel',
    text: "Bien reçu, merci de m'avoir prévenu.",
    sentAt: demoDateTime(-3, '11:05'),
  },
]

/** Messages de patients encore non lus par le professionnel. */
const unreadIds = new Set(['msg-demo-2', 'msg-demo-3'])

function conversationMessages(conversationId: string) {
  return messages
    .filter((message) => message.conversationId === conversationId)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt))
}

/** Conversations du professionnel, la plus récemment active en premier. */
export async function listConversations(): Promise<Conversation[]> {
  await simulateNetwork()
  return conversations
    .map((conversation): Conversation => {
      const thread = conversationMessages(conversation.id)
      return {
        ...conversation,
        lastMessage: thread.at(-1),
        unreadCount: thread.filter((message) => unreadIds.has(message.id)).length,
      }
    })
    .sort((a, b) => (b.lastMessage?.sentAt ?? '').localeCompare(a.lastMessage?.sentAt ?? ''))
}

/** Messages d'une conversation, du plus ancien au plus récent. */
export async function listMessages(conversationId: string): Promise<Message[]> {
  await simulateNetwork()
  return conversationMessages(conversationId)
}

export async function sendMessage(conversationId: string, text: string): Promise<Message> {
  await simulateNetwork()
  const message: Message = {
    id: crypto.randomUUID(),
    conversationId,
    author: 'professionnel',
    text,
    sentAt: new Date().toISOString(),
  }
  messages.push(message)
  return message
}

export async function markConversationRead(conversationId: string): Promise<void> {
  await simulateNetwork()
  for (const message of conversationMessages(conversationId)) unreadIds.delete(message.id)
}
