import { useEffect, useRef, useState } from 'react'
import { formatFileSize } from '@/features/messaging/attachments'
import { closeIconPath, documentIconPath } from '@/features/messaging/callIcons'
import type { MessageAttachment } from '@/features/messaging/types/message'

/** Photo affichée en grand par-dessus l'application ; Échap ou un clic à côté la referme. */
function ImageViewer({
  attachment,
  onClose,
}: {
  attachment: MessageAttachment
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Photo ${attachment.name}`}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto max-h-none max-w-none bg-transparent p-4 backdrop:bg-ink/85"
    >
      <div className="flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la photo"
          className="inline-flex size-11 items-center justify-center rounded-full bg-surface text-ink shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={closeIconPath} />
          </svg>
        </button>
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-[80vh] max-w-[90vw] animate-pop rounded-2xl object-contain shadow-2xl"
        />
      </div>
    </dialog>
  )
}

interface MessageAttachmentViewProps {
  attachment: MessageAttachment
  /** Sur une bulle de couleur principale, la carte du document passe en blanc translucide. */
  onPrimary?: boolean
}

/** Pièce jointe dans le fil : vignette cliquable pour une photo, carte à ouvrir pour un document. */
export function MessageAttachmentView({
  attachment,
  onPrimary = false,
}: MessageAttachmentViewProps) {
  const [viewing, setViewing] = useState(false)

  if (attachment.kind === 'image') {
    return (
      <>
        <button
          type="button"
          onClick={() => setViewing(true)}
          aria-label={`Agrandir la photo ${attachment.name}`}
          className="block overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <img
            src={attachment.url}
            alt=""
            className="max-h-72 w-64 max-w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        </button>
        {viewing && <ImageViewer attachment={attachment} onClose={() => setViewing(false)} />}
      </>
    )
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noreferrer"
      download={attachment.name}
      className={`flex w-64 max-w-full items-center gap-3 rounded-2xl p-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
        onPrimary
          ? 'bg-white/15 text-white hover:bg-white/25 focus-visible:outline-white'
          : 'bg-page text-ink hover:bg-primary-soft focus-visible:outline-primary'
      }`}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger text-white"
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d={documentIconPath} />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold">{attachment.name}</span>
        <span className={`text-xs ${onPrimary ? 'text-white/85' : 'text-muted'}`}>
          PDF · {formatFileSize(attachment.size)} · Ouvrir
        </span>
      </span>
    </a>
  )
}
