import type { KeyboardEvent } from 'react'
import { tabId, tabPanelId } from '@/components/ui/tabIds'

interface TabsProps {
  /** Intitulé du groupe d'onglets, lu par les lecteurs d'écran. */
  label: string
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}

/** Barre d'onglets en pilule ; l'onglet actif est plein, comme l'entrée active du menu. */
export function Tabs({ label, tabs, active, onChange }: TabsProps) {
  // Flèches gauche et droite : passage à l'onglet voisin, comme le veut l'usage au clavier.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    const index = tabs.findIndex((tab) => tab.id === active)
    const step = event.key === 'ArrowRight' ? 1 : -1
    const next = tabs[(index + step + tabs.length) % tabs.length]
    onChange(next.id)
    document.getElementById(tabId(next.id))?.focus()
  }

  return (
    <div className="overflow-x-auto">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="inline-flex gap-1 rounded-full border border-line bg-surface p-1.5 shadow-sm"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active
          return (
            <button
              key={tab.id}
              id={tabId(tab.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={tabPanelId(tab.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              className={`h-10 rounded-full px-5 text-sm whitespace-nowrap transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.97] ${
                selected
                  ? 'bg-primary-strong font-semibold text-white shadow-md'
                  : 'font-medium text-muted hover:bg-page hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
