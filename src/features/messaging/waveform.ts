/* Forme d'onde des messages vocaux : une suite de barres de hauteur 0 à 1, comme sur le mobile. */

/** Nombre de barres d'un message vocal envoyé ou reçu. */
export const WAVEFORM_BARS = 40

/** Volume instantané du micro, de 0 à 1, lu sur un analyseur Web Audio. */
export function readLevel(analyser: AnalyserNode, samples: Float32Array<ArrayBuffer>) {
  analyser.getFloatTimeDomainData(samples)
  let sum = 0
  for (const sample of samples) sum += sample * sample
  // La racine du volume moyen rapproche l'affichage de la sensation d'intensité de la voix.
  return Math.min(1, Math.sqrt(Math.sqrt(sum / samples.length)) * 1.8)
}

/** Ramène une suite de valeurs à `bars` barres (pic de chaque tranche), la plus haute valant 1. */
export function toWaveform(values: ArrayLike<number>, bars = WAVEFORM_BARS): number[] {
  if (values.length === 0) return Array.from({ length: bars }, () => 0)
  const peaks = Array.from({ length: bars }, (_, bar) => {
    const from = Math.floor((bar * values.length) / bars)
    const to = Math.max(from + 1, Math.floor(((bar + 1) * values.length) / bars))
    let peak = 0
    for (let index = from; index < to && index < values.length; index++) {
      peak = Math.max(peak, Math.abs(values[index]))
    }
    return peak
  })
  const highest = Math.max(...peaks)
  return highest === 0 ? peaks : peaks.map((peak) => peak / highest)
}

/**
 * Forme d'onde calculée en décodant le fichier audio, pour un message reçu sans forme d'onde
 * (par exemple enregistré sur un autre appareil).
 */
export async function waveformFromAudio(url: string): Promise<number[]> {
  const response = await fetch(url)
  const context = new AudioContext()
  try {
    const audio = await context.decodeAudioData(await response.arrayBuffer())
    return toWaveform(audio.getChannelData(0))
  } finally {
    void context.close()
  }
}
