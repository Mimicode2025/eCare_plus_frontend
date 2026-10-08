import type { Alert } from '@/features/alerts/types/alert'

/*
 * DONNÉES FICTIVES — aucun appel API.
 * Ce service simule les alertes de télésuivi tant que le contrat d'API n'est pas défini.
 * Les seuils (glycémie 1,60 g/L, tension 140/90 mmHg) sont ceux de l'écran « Configuration des
 * règles de suivi » de la maquette ; ils restent à valider médicalement, tout comme le niveau de
 * priorité attribué à chaque alerte. Une alerte signale un dépassement de seuil : ce n'est pas
 * un diagnostic.
 */

const SIMULATED_DELAY_MS = 700

const alerts: Alert[] = [
  {
    id: 'ALT-401',
    patientId: 'demo-3',
    patientName: 'Kodjo Test',
    patientFileNumber: 'ECP-00003',
    trigger: 'Glycémie post-prandiale au-dessus du seuil',
    value: '1,78 g/L',
    threshold: '1,60 g/L',
    priority: 'haute',
    triggeredAt: '2026-10-06T14:05:00',
  },
  {
    id: 'ALT-402',
    patientId: 'demo-3',
    patientName: 'Kodjo Test',
    patientFileNumber: 'ECP-00003',
    trigger: 'Tension artérielle au-dessus du seuil',
    value: '146/91 mmHg',
    threshold: '140/90 mmHg',
    priority: 'moyenne',
    triggeredAt: '2026-10-07T07:25:00',
  },
  {
    id: 'ALT-403',
    patientId: 'demo-2',
    patientName: 'Afi Fictive',
    patientFileNumber: 'ECP-00002',
    trigger: 'Tension artérielle au-dessus du seuil',
    value: '142/88 mmHg',
    threshold: '140/90 mmHg',
    priority: 'moyenne',
    triggeredAt: '2026-10-06T19:30:00',
  },
  {
    id: 'ALT-398',
    patientId: 'demo-1',
    patientName: 'Jean Kossi Exemple',
    patientFileNumber: 'ECP-00001',
    trigger: 'Glycémie post-prandiale au-dessus du seuil',
    value: '1,61 g/L',
    threshold: '1,60 g/L',
    priority: 'moyenne',
    triggeredAt: '2026-10-04T20:10:00',
    resolution: {
      note: 'Patient joint par téléphone : mesure prise peu après le repas. Suivi habituel maintenu.',
      closedAt: '2026-10-05T09:10:00',
      closedBy: 'Dr Kofi Démo',
    },
  },
]

function simulateNetwork() {
  return new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
}

/** Toutes les alertes, de la plus récente à la plus ancienne. */
export async function listAlerts(): Promise<Alert[]> {
  await simulateNetwork()
  return [...alerts].sort((a, b) => b.triggeredAt.localeCompare(a.triggeredAt))
}

export async function getAlert(id: string): Promise<Alert | undefined> {
  await simulateNetwork()
  return alerts.find((alert) => alert.id === id)
}

export async function closeAlert(id: string, note: string, closedBy: string): Promise<Alert> {
  await simulateNetwork()
  const index = alerts.findIndex((alert) => alert.id === id)
  if (index === -1) throw new Error('Alerte introuvable')
  const closed: Alert = {
    ...alerts[index],
    resolution: { note, closedAt: new Date().toISOString(), closedBy },
  }
  alerts[index] = closed
  return closed
}
