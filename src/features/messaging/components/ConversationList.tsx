import { useId, useState } from 'react'
import { NavLink } from 'react-router'
import { InitialsTile } from '@/features/messaging/components/InitialsTile'
import { formatActivity } from '@/features/messaging/format'
import type { Conversation } from '@/features/messaging/types/message'

const unreadLabel = (count: number) =>
  count === 1 ? '1 message non lu' : `${count} messages non lus`

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

/** Volet des conversations : recherche par patient, puis liste de la plus récente à la plus ancienne. */
export function ConversationList({ conversations }: { conversations: Conversation[] }) {
  const searchId = useId()
  const [search, setSearch] = useState('')

  const query = normalize(search.trim())
  const shown = query
    ? conversations.filter(
        ({ patientName, patientFileNumber }) =>
          normalize(patientName).includes(query) || normalize(patientFileNumber).includes(query),
      )
    : conversations

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 p-5 sm:p-6">
      <h2 className="font-display text-2xl font-extrabold text-ink">Messages</h2>

      <div className="relative">
        <label htmlFor={searchId} className="sr-only">
          Rechercher une conversation
        </label>
        <svg
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input
          id={searchId}
          type="search"
          value={search}
          placeholder="Rechercher un patient…"
          onChange={(event) => setSearch(event.target.value)}
          className="h-12 w-full rounded-full border border-line bg-page pr-4 pl-12 text-sm text-ink placeholder:text-muted focus:bg-surface focus:outline-2 focus:outline-primary"
        />
      </div>

      {shown.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">
          {conversations.length === 0
            ? 'Aucune conversation pour le moment.'
            : 'Aucune conversation ne correspond à cette recherche.'}
        </p>
      ) : (
        <ul className="-mx-2 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
          {shown.map(({ id, patientName, lastMessage, unreadCount }) => (
            <li key={id}>
              <NavLink
                to={`/messagerie/${id}`}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive ? 'bg-primary-strong text-white shadow-md' : 'text-ink hover:bg-page'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <InitialsTile name={patientName} onPrimary={isActive} />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="truncate font-display text-sm font-semibold">
                          {patientName}
                        </p>
                        {lastMessage && (
                          <p
                            className={`shrink-0 text-xs font-semibold ${isActive ? 'text-white' : 'text-muted'}`}
                          >
                            {formatActivity(lastMessage.sentAt)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className={`truncate text-sm ${
                            isActive
                              ? 'text-white'
                              : unreadCount > 0
                                ? 'font-semibold text-ink'
                                : 'text-muted'
                          }`}
                        >
                          {lastMessage
                            ? `${lastMessage.author === 'professionnel' ? 'Vous : ' : ''}${lastMessage.text}`
                            : 'Aucun message pour le moment'}
                        </p>
                        {unreadCount > 0 && (
                          <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-danger px-1.5 text-xs font-bold text-white">
                            <span aria-hidden="true">{unreadCount}</span>
                            <span className="sr-only">{unreadLabel(unreadCount)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
