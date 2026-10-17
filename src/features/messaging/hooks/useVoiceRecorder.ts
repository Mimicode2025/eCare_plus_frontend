import { useCallback, useEffect, useRef, useState } from 'react'
import { readLevel, toWaveform } from '@/features/messaging/waveform'

/** Au-delà, l'enregistrement s'arrête de lui-même. */
export const VOICE_MAX_SECONDS = 120

/** Nombre de barres affichées pendant l'enregistrement, les plus récentes à droite. */
export const LIVE_BARS = 48

/** Intervalle de mesure du volume du micro. */
const LEVEL_INTERVAL_MS = 80

export type VoiceRecorder =
  | { status: 'idle' }
  | { status: 'starting' }
  /** `levels` : volumes récents du micro, de 0 à 1, du plus ancien au plus récent. */
  | { status: 'recording'; elapsed: number; levels: number[] }
  | {
      status: 'recorded'
      recording: Blob
      url: string
      durationSeconds: number
      waveform: number[]
    }
  /** `denied` : accès au micro refusé ; `unavailable` : aucun micro ou enregistrement impossible. */
  | { status: 'error'; reason: 'denied' | 'unavailable' }

/** Enregistre un message vocal au micro, avec écoute avant envoi. */
export function useVoiceRecorder() {
  const [state, setState] = useState<VoiceRecorder>({ status: 'idle' })
  const recorderRef = useRef<MediaRecorder | null>(null)
  const startedAtRef = useRef(0)
  // Un enregistrement annulé ne doit pas aboutir à l'état « enregistré ».
  const discardRef = useRef(false)
  // Analyse du volume, et tous les volumes mesurés pour la forme d'onde finale.
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const levelsRef = useRef<number[]>([])

  const releaseRecorder = () => {
    recorderRef.current?.stream.getTracks().forEach((track) => track.stop())
    recorderRef.current = null
    void audioContextRef.current?.close()
    audioContextRef.current = null
    analyserRef.current = null
  }

  const start = useCallback(async () => {
    setState({ status: 'starting' })
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      recorder.ondataavailable = (event) => chunks.push(event.data)
      recorder.onstop = () => {
        const durationSeconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
        releaseRecorder()
        if (discardRef.current) return
        const recording = new Blob(chunks, { type: recorder.mimeType })
        setState({
          status: 'recorded',
          recording,
          url: URL.createObjectURL(recording),
          durationSeconds,
          waveform: toWaveform(levelsRef.current),
        })
      }

      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 1024
      audioContext.createMediaStreamSource(stream).connect(analyser)
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      levelsRef.current = []

      recorderRef.current = recorder
      discardRef.current = false
      startedAtRef.current = Date.now()
      recorder.start()
      setState({ status: 'recording', elapsed: 0, levels: [] })
    } catch (error) {
      const denied = error instanceof DOMException && error.name === 'NotAllowedError'
      setState({ status: 'error', reason: denied ? 'denied' : 'unavailable' })
    }
  }, [])

  const stop = useCallback(() => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }, [])

  /** Abandonne l'enregistrement en cours ou enregistré, et revient à l'état initial. */
  const reset = useCallback(() => {
    discardRef.current = true
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    else releaseRecorder()
    setState((current) => {
      if (current.status === 'recorded') URL.revokeObjectURL(current.url)
      return { status: 'idle' }
    })
  }, [])

  const recording = state.status === 'recording'
  useEffect(() => {
    if (!recording) return
    const samples = new Float32Array(1024)
    const timer = setInterval(() => {
      // Enregistrement déjà arrêté : la mesure ne doit pas écraser l'état « enregistré ».
      if (recorderRef.current?.state !== 'recording' || !analyserRef.current) return
      const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000)
      if (elapsed >= VOICE_MAX_SECONDS) {
        recorderRef.current.stop()
        return
      }
      levelsRef.current.push(readLevel(analyserRef.current, samples))
      const levels = levelsRef.current.slice(-LIVE_BARS)
      setState((current) =>
        current.status === 'recording' ? { status: 'recording', elapsed, levels } : current,
      )
    }, LEVEL_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [recording])

  // Le micro est libéré si l'écran se ferme pendant un enregistrement.
  useEffect(
    () => () => {
      discardRef.current = true
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    },
    [],
  )

  return { state, start, stop, reset }
}
