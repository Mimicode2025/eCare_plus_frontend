import { createContext, useContext } from 'react'
import type { Credentials, User } from '@/features/auth/types/auth'

export interface AuthContextValue {
  user: User | null
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
  /** Remplace les informations de l'utilisateur connecté, par exemple après une modification du profil. */
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return context
}
