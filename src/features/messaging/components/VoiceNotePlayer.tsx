import { useEffect, useRef, useState } from 'react'
import { WaveformBars } from '@/features/messaging/components/WaveformBars'
import { formatTimer } from '@/features/messaging/format'
import { WAVEFORM_BARS, waveformFromAudio } from '@/features/messaging/waveform'

const playIconPath = 'M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z'
const pauseIconPath = 'M7 5h3.5v14H7V5Zm6.5 0H17v14h-3.5V5Z'

const flatWaveform = Array.from({ length: WAVEFORM_BARS }, () => 0)

interface VoiceNotePlayerProps {
  url: string
  durationSeconds: number
  /** Forme d'onde connue ; à défaut, elle est calculée à partir du fichier audio. */
  waveform?: number[]
  /** Sur une bulle de couleur principale, les contrôles passent en blanc pour rester lisibles. */
  onPrimary?: boolean
}

/** Lecture d'un message vocal : bouton lecture/pause, forme d'onde et durée, comme sur le mobile. */
export function VoiceNotePlayer({
  url,
  durationSeconds,
  waveform,
  onPrimary = false,
}: VoiceNotePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [decoded, setDecoded] = useState<number[]>()

  useEffect(() => {
    if (waveform) return
    let active = true
    waveformFromAudio(url)
      .then((values) => {
        if (active) setDecoded(values)
      })
      .catch(() => {
        // Fichier illisible pour l'analyse : les barres restent plates, la lecture reste possible.
      })
    return () => {
      active = false
    }
  }, [url, waveform])

  // Un seul message vocal est lu à la fois.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const pauseOthers = () => {
      document.querySelectorAll('audio').forEach((other) => {
        if (other !== audio) other.pause()
      })
    }
    audio.addEventListener('play', pauseOthers)
    return () => audio.removeEventListener('play', pauseOthers)
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }

  const seek = (seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime = seconds
    setPosition(seconds)
  }

  const progress = Math.min(1, position / durationSeconds)
  const remaining = Math.max(0, Math.round(durationSeconds - position))

  return (
    <div className="flex w-64 max-w-full items-center gap-3">
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setPosition(event.currentTarget.currentTime)}
        onEnded={(event) => {
          event.currentTarget.currentTime = 0
          setPosition(0)
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Mettre en pause le message vocal' : 'Écouter le message vocal'}
        title={playing ? 'Mettre en pause' : 'Écouter'}
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 ${
          onPrimary
            ? 'bg-surface text-primary-strong focus-visible:outline-white'
            : 'bg-primary text-white hover:bg-primary-strong focus-visible:outline-primary'
        }`}
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={playing ? pauseIconPath : playIconPath} />
        </svg>
      </button>
      {/* Curseur invisible posé sur les barres : un clic ou les flèches déplacent la lecture. */}
      <div
        className={`relative flex-1 rounded-md focus-within:outline-2 focus-within:outline-offset-2 ${
          onPrimary ? 'focus-within:outline-white' : 'focus-within:outline-primary'
        }`}
      >
        <WaveformBars
          values={waveform ?? decoded ?? flatWaveform}
          progress={progress}
          onPrimary={onPrimary}
        />
        <input
          type="range"
          min={0}
          max={durationSeconds}
          step={0.1}
          value={position}
          aria-label="Position dans le message vocal"
          aria-valuetext={`${formatTimer(Math.round(position))} sur ${formatTimer(durationSeconds)}`}
          onChange={(event) => seek(Number(event.target.value))}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </div>
      <span className={`shrink-0 text-xs tabular-nums ${onPrimary ? 'text-white' : 'text-muted'}`}>
        {formatTimer(playing || position > 0 ? remaining : durationSeconds)}
      </span>
    </div>
  )
}
