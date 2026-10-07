import { NavLink, Outlet } from 'react-router'
import logoMark from '@/assets/logo-mark.png'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'

interface AppLayoutProps {
  user: { name: string; description: string }
  onLogout: () => void
}

const navItems = [
  {
    to: '/patients',
    label: 'Liste des patients',
    // Pictogramme « groupe de personnes ».
    iconPath:
      'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0v1H2v-1Zm15.5-9.5a3.5 3.5 0 1 0-1.6-6.6 6 6 0 0 1 0 6.2c.5.25 1 .4 1.6.4ZM18 21v-1a8.9 8.9 0 0 0-1.9-5.5A6 6 0 0 1 22 20v1h-4Z',
  },
]

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function AppLayout({ user, onLogout }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3 border-b border-line bg-surface px-4 py-3 sm:px-8 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:flex-col lg:flex-nowrap lg:items-stretch lg:gap-8 lg:border-r lg:border-b-0 lg:px-4 lg:py-6">
        <div className="flex items-center gap-2.5 lg:px-2">
          <img src={logoMark} alt="" className="size-10" />
          <p className="font-display text-2xl font-extrabold text-primary">ecare+</p>
        </div>

        <nav aria-label="Navigation principale">
          <ul className="flex gap-1 lg:flex-col">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-primary ${
                      isActive
                        ? 'bg-primary-soft font-semibold text-primary-strong'
                        : 'font-medium text-muted hover:bg-page hover:text-ink'
                    }`
                  }
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={item.iconPath} />
                  </svg>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0 lg:flex-col lg:items-stretch lg:gap-4 lg:border-t lg:border-line lg:px-2 lg:pt-6">
          <div className="hidden items-center gap-3 lg:flex">
            <Avatar initials={getInitials(user.name)} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="text-xs text-muted">{user.description}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onLogout}>
            Se déconnecter
          </Button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
