import { useCallback, useRef, useState } from 'react'
import { acceptByKind, type AttachmentKind } from '@/features/messaging/attachments'
import { documentIconPath, paperclipIconPath, photoIconPath } from '@/features/messaging/callIcons'
import { useDismiss } from '@/hooks/useDismiss'

const options: {
  kind: AttachmentKind
  label: string
  hint: string
  iconPath: string
  tone: string
}[] = [
  {
    kind: 'image',
    label: 'Photo',
    hint: 'JPEG ou PNG',
    iconPath: photoIconPath,
    tone: 'bg-violet-soft text-violet',
  },
  {
    kind: 'file',
    label: 'Document',
    hint: 'PDF, 5 Mo maximum',
    iconPath: documentIconPath,
    tone: 'bg-primary-soft text-primary-strong',
  },
]

interface AttachmentMenuProps {
  disabled?: boolean
  onPick: (file: File) => void
}

/** Trombone de la zone de saisie : il ouvre le choix entre une photo et un document. */
export function AttachmentMenu({ disabled, onPick }: AttachmentMenuProps) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const containerRef = useDismiss<HTMLDivElement>(open, close)
  const inputsRef = useRef<Partial<Record<AttachmentKind, HTMLInputElement | null>>>({})

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-label="Joindre une photo ou un document"
        title="Joindre une photo ou un document"
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${
          open ? 'bg-primary-soft text-primary-strong' : 'text-muted hover:bg-page hover:text-ink'
        }`}
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={paperclipIconPath} />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-20 mb-3 flex w-64 animate-pop flex-col gap-1 rounded-3xl border border-line bg-surface p-2 shadow-xl">
          {options.map((option) => (
            <button
              key={option.kind}
              type="button"
              onClick={() => inputsRef.current[option.kind]?.click()}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span
                aria-hidden="true"
                className={`inline-flex size-10 shrink-0 items-center justify-center rounded-2xl ${option.tone}`}
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d={option.iconPath} />
                </svg>
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-ink">{option.label}</span>
                <span className="text-xs text-muted">{option.hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Sélecteurs de fichiers, ouverts par les choix du menu. */}
      {options.map((option) => (
        <input
          key={option.kind}
          ref={(element) => {
            inputsRef.current[option.kind] = element
          }}
          type="file"
          accept={acceptByKind[option.kind]}
          tabIndex={-1}
          aria-hidden="true"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            // Remise à zéro : choisir de nouveau le même fichier doit fonctionner.
            event.target.value = ''
            if (!file) return
            setOpen(false)
            onPick(file)
          }}
        />
      ))}
    </div>
  )
}
