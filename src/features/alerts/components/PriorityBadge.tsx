import { Badge } from '@/components/ui/Badge'
import type { AlertPriority } from '@/features/alerts/types/alert'

export function PriorityBadge({ priority }: { priority: AlertPriority }) {
  return priority === 'haute' ? (
    <Badge tone="red">Haute priorité</Badge>
  ) : (
    <Badge tone="amber">Priorité moyenne</Badge>
  )
}
