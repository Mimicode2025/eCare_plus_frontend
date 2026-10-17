import { useEffect, useState } from 'react'
import type { CallType } from '@/features/messaging/types/call'

export type LocalMedia =
  | { status: 'pending' }
  | { status: 'ready'; stream: MediaStream; cameraAvailable: boolean }
  /** `denied` : accès refusé par l'utilisateur ; `unavailable` : aucun micro utilisable. */
  | { status: 'error'; reason: 'denied' | 'unavailable' }

const isDenied = (error: unknown) => error instanceof DOMException && error.name === 'NotAllowedError'

async function requestMedia(type: CallType) {
  if (type === 'video') {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      return { stream, cameraAvailable: true }
    } catch (error) {
      if (isDenied(error)) throw error
      // Pas de caméra utilisable : l'appel continue en audio seul.
    }
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  return { stream, cameraAvailable: false }
}

/** Ouvre le micro, et la caméra pour un appel vidéo ; les libère quand l'appel se ferme. */
export function useLocalMedia(type: CallType): LocalMedia {
  const [media, setMedia] = useState<LocalMedia>({ status: 'pending' })

  useEffect(() => {
    let active = true
    let stream: MediaStream | undefined

    requestMedia(type)
      .then((result) => {
        stream = result.stream
        if (active) setMedia({ status: 'ready', ...result })
        else stream.getTracks().forEach((track) => track.stop())
      })
      .catch((error: unknown) => {
        if (active) setMedia({ status: 'error', reason: isDenied(error) ? 'denied' : 'unavailable' })
      })

    return () => {
      active = false
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [type])

  return media
}
