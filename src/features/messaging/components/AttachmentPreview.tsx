import { formatFileSize, type AttachmentKind } from '@/features/messaging/attachments'
import { closeIconPath, documentIconPath } from '@/features/messaging/callIcons'

/** Pièce jointe choisie mais pas encore envoyée. */
export interface PendingAttachment {
  kind: AttachmentKind
  file: File
  /** Adresse locale de l'aperçu, à libérer quand la pièce jointe est retirée ou envoyée. */
  previewUrl: string
}

interface AttachmentPreviewProps {
  attachment: PendingAttachment
  disabled?: boolean
  onRemove: () => void
}

/** Aperçu au-dessus de la zone de saisie, avant l'envoi ; le texte saisi servira de légende. */
export function AttachmentPreview({ attachment, disabled, onRemove }: AttachmentPreviewProps) {
  return (
    <div className="flex animate-pop items-center gap-3 rounded-3xl border border-line bg-page p-3">
      {attachment.kind === 'image' ? (
        <img
          src={attachment.previewUrl}
          alt=""
          className="size-16 shrink-0 rounded-2xl object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex size-16 shrink-0 items-center justify-center rounded-2xl bg-danger text-white"
        >
          <svg className="size-7" viewBox="0 0 24 24" fill="currentColor">
            <path d={documentIconPath} />
          </svg>
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-sm font-semibold text-ink">{attachment.file.name}</p>
        <p className="text-xs text-muted">
          {attachment.kind === 'image' ? 'Photo' : 'Document PDF'} ·{' '}
          {formatFileSize(attachment.file.size)} · ajoutez une légende si besoin
        </p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        aria-label={`Retirer ${attachment.file.name}`}
        title="Retirer"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={closeIconPath} />
        </svg>
      </button>
    </div>
  )
}
