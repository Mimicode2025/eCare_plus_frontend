import { useEffect, useRef, useState } from 'react'

export type AsyncData<T> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; data: T }

/**
 * Charge une donnée asynchrone et suit son état.
 * Le chargement est relancé quand `key` change ; `load` peut donc être une fonction en ligne.
 */
export function useAsyncData<T>(key: string, load: () => Promise<T>): AsyncData<T> {
  const [loaded, setLoaded] = useState<{ key: string; state: AsyncData<T> } | null>(null)
  // Dernière version de `load`, pour que seul un changement de `key` relance le chargement.
  const loadRef = useRef(load)
  useEffect(() => {
    loadRef.current = load
  })

  useEffect(() => {
    let active = true
    loadRef
      .current()
      .then((data) => {
        if (active) setLoaded({ key, state: { status: 'success', data } })
      })
      .catch(() => {
        if (active) setLoaded({ key, state: { status: 'error' } })
      })
    return () => {
      active = false
    }
  }, [key])

  // Tant que le résultat chargé ne correspond pas à la clé demandée, on est en chargement.
  return loaded?.key === key ? loaded.state : { status: 'loading' }
}
