import { Page } from '@/components/layouts/Page'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { roleLabels, useAuth } from '@/features/auth'
import { PasswordChangeCard } from '@/features/profile/components/PasswordChangeCard'
import { PersonalInfoForm } from '@/features/profile/components/PersonalInfoForm'

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

/** Profil de la personne connectée : identité, mot de passe et déconnexion (EF-AUTH-8). */
export function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  if (!user) return null

  return (
    <Page title="Mon profil" description="Vos informations et la sécurité de votre compte">
      <section className="flex flex-wrap items-center gap-5 rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <Avatar initials={getInitials(user.name)} size="lg" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-bold text-ink">{user.name}</h2>
            <Badge tone="blue">{roleLabels[user.role]}</Badge>
          </div>
          {user.email && <p className="truncate text-sm text-muted">{user.email}</p>}
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          {/* La clé réinitialise le formulaire quand les informations enregistrées changent. */}
          <PersonalInfoForm
            key={`${user.name}|${user.phone ?? ''}`}
            user={user}
            onSaved={updateUser}
          />
        </div>
        <div className="flex flex-col gap-6 xl:col-span-2">
          <PasswordChangeCard email={user.email} />
          <Card title="Session">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted">
                Se déconnecter efface vos données de cet appareil. Pensez-y sur un poste partagé.
              </p>
              <Button variant="secondary" onClick={logout}>
                Se déconnecter
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  )
}
