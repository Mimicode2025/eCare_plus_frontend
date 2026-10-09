import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Page } from '@/components/layouts/Page'
import { Alert } from '@/components/ui/Alert'
import { ConversationList } from '@/features/messaging/components/ConversationList'
import { ConversationThread } from '@/features/messaging/components/ConversationThread'
import { useConversations } from '@/features/messaging/hooks/useConversations'
import { markConversationRead } from '@/features/messaging/services/messagingService'
import type { Conversation, Message } from '@/features/messaging/types/message'

const pageDescription = 'Échanges avec les patients suivis'

export function MessagingPage() {
  const { conversationId } = useParams()
  const state = useConversations()
  // Messages envoyés et conversations lues depuis l'ouverture de l'écran.
  const [sent, setSent] = useState<Message[]>([])
  const [readIds, setReadIds] = useState<string[]>([])

  // Ouvrir une conversation la marque comme lue.
  useEffect(() => {
    if (!conversationId) return
    let active = true
    markConversationRead(conversationId)
      .then(() => {
        if (active) setReadIds((current) => [...current, conversationId])
      })
      .catch(() => {
        // L'indicateur de non-lus reste simplement affiché.
      })
    return () => {
      active = false
    }
  }, [conversationId])

  if (state.status !== 'success') {
    return (
      <Page title="Messagerie" description={pageDescription}>
        {state.status === 'loading' ? (
          <p role="status" className="text-sm text-muted">
            Chargement des conversations…
          </p>
        ) : (
          <Alert variant="error" title="Les conversations n'ont pas pu être chargées.">
            Rechargez la page pour réessayer.
          </Alert>
        )}
      </Page>
    )
  }

  const conversations = state.data.map((conversation): Conversation => {
    const lastSent = sent.findLast((message) => message.conversationId === conversation.id)
    return {
      ...conversation,
      lastMessage: lastSent ?? conversation.lastMessage,
      unreadCount: readIds.includes(conversation.id) ? 0 : conversation.unreadCount,
    }
  })
  const selected = conversations.find((conversation) => conversation.id === conversationId)

  return (
    <Page title="Messagerie" description={pageDescription}>
      <div className="flex h-[75vh] min-h-112 overflow-hidden rounded-3xl border border-line bg-surface shadow-sm lg:h-[calc(100vh-11rem)]">
        {/* Sur petit écran, la liste laisse place au fil de la conversation ouverte. */}
        <div
          className={`min-h-0 w-full flex-col lg:flex lg:w-88 lg:shrink-0 lg:border-r lg:border-line ${
            conversationId ? 'hidden' : 'flex'
          }`}
        >
          <ConversationList conversations={conversations} />
        </div>

        <div className={`min-h-0 min-w-0 flex-1 flex-col lg:flex ${conversationId ? 'flex' : 'hidden'}`}>
          {selected ? (
            <ConversationThread
              key={selected.id}
              conversation={selected}
              sent={sent}
              onSent={(message) => setSent((current) => [...current, message])}
            />
          ) : (
            <div className="m-auto flex flex-col items-center gap-4 p-6 text-center">
              <span
                aria-hidden="true"
                className="inline-flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary-strong"
              >
                <svg className="size-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                </svg>
              </span>
              <p className="text-sm text-muted">
                {conversationId
                  ? "Cette conversation n'existe pas ou n'est plus disponible."
                  : 'Sélectionnez une conversation pour afficher les messages.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}
