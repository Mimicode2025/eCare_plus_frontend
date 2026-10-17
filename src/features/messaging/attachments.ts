/* Pièces jointes de la messagerie : formats, taille et préparation avant envoi (CDC §2.2.6, EF-W3-5). */

export type AttachmentKind = 'image' | 'file'

/** Taille maximale d'un fichier envoyé. */
export const ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024

/** Au-delà, une photo est réduite avant l'envoi (cible indicative du cahier des charges). */
const IMAGE_TARGET_BYTES = 1.5 * 1024 * 1024
/** Plus grand côté d'une photo réduite, en pixels. */
const IMAGE_MAX_SIDE = 1920

export const imageTypes = ['image/jpeg', 'image/png']
export const documentTypes = ['application/pdf']

/** Valeur de l'attribut `accept` du sélecteur de fichiers. */
export const acceptByKind: Record<AttachmentKind, string> = {
  image: imageTypes.join(','),
  file: documentTypes.join(','),
}

export const kindOf = (mimeType: string): AttachmentKind | undefined =>
  imageTypes.includes(mimeType) ? 'image' : documentTypes.includes(mimeType) ? 'file' : undefined

/** Message d'erreur si le fichier ne peut pas être envoyé, sinon `undefined`. */
export function attachmentError(file: File) {
  if (!kindOf(file.type)) {
    return `« ${file.name} » n'est pas accepté : envoyez une photo JPEG ou PNG, ou un document PDF.`
  }
  if (file.size > ATTACHMENT_MAX_BYTES) {
    return `« ${file.name} » dépasse ${formatFileSize(ATTACHMENT_MAX_BYTES)}. Choisissez un fichier plus léger.`
  }
  return undefined
}

const sizeFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 })

/** Taille lisible, par exemple « 820 Ko » ou « 1,4 Mo ». */
export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`
  return `${sizeFormatter.format(bytes / (1024 * 1024))} Mo`
}

/**
 * Réduit une photo trop lourde (dimensions et qualité JPEG) pour accélérer l'envoi sur une
 * connexion mobile. Une photo déjà légère, ou illisible, est envoyée telle quelle.
 */
export async function prepareImage(file: File): Promise<Blob> {
  if (file.size <= IMAGE_TARGET_BYTES) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, IMAGE_MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const reduced = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.82),
    )
    return reduced && reduced.size < file.size ? reduced : file
  } catch {
    return file
  }
}
