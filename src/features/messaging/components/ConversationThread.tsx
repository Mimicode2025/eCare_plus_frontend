import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Alert } from '@/components/ui/Alert'
import { IconLink, recordIconPath } from '@/components/ui/IconLink'
import { InitialsTile } from '@/features/messaging/components/InitialsTile'
import { dayKey, formatDay, formatTime } from '@/features/messaging/format'
import {
  listMessages,
  MESSAGE_MAX_LENGTH,
  sendMessage,
} from '@/features/messaging/services/messagingService'
import type { Conversation, Message } from '@/features/messaging/types/message'
import { useAsyncData } from '@/hooks/useAsyncData'

// Pictogramme « flèche vers la gauche ».
const backIconPath = 'M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2Z'

interface ConversationThreadProps {
  conversation: Conversation
  /** Messages envoyés depuis l'ouverture de l'écran, toutes conversations confondues. */
  sent: Message[]
  onSent: (message: Message) => void
}

/** Fil d'une conversation : messages reçus et envoyés, puis saisie d'un nouveau message. */
export function ConversationThread({ conversation, sent, onSent }: ConversationThreadProps) {
  const state = useAsyncData(`messages:${conversation.id}`, () => listMessages(conversation.id))
  const fieldId = useId()
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [sendFailed, setSendFailed] = useState(false)
  const endRef = useRef<HTMLLIElement>(null)

  const loaded = state.status === 'success' ? state.data : []
  const messages = [
    ...loaded,
    ...sent.filter(
      (message) =>
        message.conversationId === conversation.id &&
        !loaded.some((known) => known.id === message.id),
    ),
  ]

  // Le dernier message reste visible à l'ouverture et après chaque envoi.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [messages.length])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    setSendFailed(false)
    try {
      onSent(await sendMessage(conversation.id, text.trim()))
      setText('')
    } catch {
      setSendFailed(true)
    } finally {
      setSending(false)
    }
  }

  // Entrée envoie le message ; Maj + Entrée va à la ligne.
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <section
      aria-label={`Conversation avec ${conversation.patientName}`}
      className="flex min-h-0 flex-1 flex-col"
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-4 sm:px-6">
        <div className="lg:hidden">
          <IconLink to="/messagerie" label="Revenir aux conversations" iconPath={backIconPath} />
        </div>
        <InitialsTile name={conversation.patientName} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-base font-bold text-ink">
            {conversation.patientName}
          </h2>
          <p className="text-xs text-muted">Dossier n° {conversation.patientFileNumber}</p>
        </div>
        <IconLink
          to={`/patients/${conversation.patientId}`}
          label="Consulter le dossier du patient"
          iconPath={recordIconPath}
        />
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-page px-4 py-6 sm:px-6">
        {state.status === 'loading' && (
          <p role="status" className="m-auto text-sm text-muted">
            Chargement des messages…
          </p>
        )}
        {state.status === 'error' && (
          <Alert variant="error" title="Les messages n'ont pas pu être chargés.">
            Rechargez la page pour réessayer.
          </Alert>
        )}
        {state.status === 'success' && messages.length === 0 && (
          <p className="m-auto text-center text-sm text-muted">
            Aucun message échangé avec ce patient pour le moment.
          </p>
        )}
        {messages.length > 0 && (
          <ol className="mt-auto flex flex-col gap-4" aria-live="polite">
            {messages.map((message, index) => {
              const mine = message.author === 'professionnel'
              const newDay = index === 0 || dayKey(messages[index - 1].sentAt) !== dayKey(message.sentAt)
              return (
                <Fragment key={message.id}>
                  {newDay && (
                    <li className="self-center rounded-full bg-surface px-4 py-1 text-xs font-semibold tracking-wide text-muted uppercase">
                      {formatDay(message.sentAt)}
                    </li>
                  )}
                  <li
                    ref={index === messages.length - 1 ? endRef : undefined}
                    className={`flex max-w-[80%] flex-col gap-1 ${mine ? 'items-end self-end' : 'items-start self-start'}`}
                  >
                    <span className="sr-only">{mine ? 'Vous' : conversation.patientName}</span>
                    <p
                      className={`rounded-3xl px-5 py-3 text-sm whitespace-pre-line shadow-sm ${
                        mine
                          ? 'rounded-br-lg bg-primary-strong text-white'
                          : 'rounded-bl-lg bg-surface text-ink'
                      }`}
                    >
                      {message.text}
                    </p>
                    <p className="px-2 text-xs text-muted">{formatTime(message.sentAt)}</p>
                  </li>
                </Fragment>
              )
            })}
          </ol>
        )}
      </div>

      {state.status === 'success' && (
        <form
          noValidate
          onSubmit={(event) => void handleSubmit(event)}
          className="flex flex-col gap-3 border-t border-line px-4 py-4 sm:px-6"
        >
          {sendFailed && (
            <Alert variant="error" title="Le message n'a pas pu être envoyé.">
              Votre texte est conservé. Vérifiez votre connexion puis réessayez.
            </Alert>
          )}
          <div className="flex items-end gap-2 rounded-4xl border border-control bg-surface py-2 pr-2 pl-5 focus-within:outline-2 focus-within:outline-primary">
            <label htmlFor={fieldId} className="sr-only">
              Votre message
            </label>
            <textarea
              id={fieldId}
              rows={1}
              maxLength={MESSAGE_MAX_LENGTH}
              placeholder="Écrivez votre message…"
              value={text}
              disabled={sending}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={handleKeyDown}
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm text-ink field-sizing-content placeholder:text-muted focus:outline-none disabled:text-muted"
            />
            <button
              type="submit"
              disabled={!text.trim() || sending}
              aria-busy={sending || undefined}
              aria-label="Envoyer le message"
              title="Envoyer le message"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.4 20.4 21 12 3.4 3.6 3 10.2l12 1.8-12 1.8.4 6.6Z" />
              </svg>
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
