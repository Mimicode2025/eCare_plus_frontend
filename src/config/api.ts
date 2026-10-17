const configuredUrl: string | undefined = import.meta.env.VITE_API_URL

if (!configuredUrl) {
  throw new Error('VITE_API_URL est absent : copier .env.example en .env et le renseigner.')
}

/**
 * Racine de l'API eCare+, lue dans `.env` (`VITE_API_URL`).
 * En développement, un chemin relatif `/api/v1` est relayé par Vite vers le backend local
 * (voir `vite.config.ts`).
 */
export const API_BASE_URL = configuredUrl.replace(/\/$/, '')
