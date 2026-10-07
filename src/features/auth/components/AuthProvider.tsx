import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from '@/features/auth/hooks/useAuth'
import * as authService from '@/features/auth/services/authService'
import type { User } from '@/features/auth/types/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(authService.restoreSession)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (credentials) => setUser(await authService.login(credentials)),
      logout: () => {
        authService.logout()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
