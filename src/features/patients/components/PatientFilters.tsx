import { Card } from '@/components/ui/Card'
import { SelectField } from '@/components/ui/SelectField'
import { TextField } from '@/components/ui/TextField'
import type { PatientFiltersValue } from '@/features/patients/filterPatients'

const conditionOptions = [
  { value: 'diabete', label: 'Diabète' },
  { value: 'hypertension', label: 'Hypertension' },
]

interface PatientFiltersProps {
  value: PatientFiltersValue
  onChange: (value: PatientFiltersValue) => void
}

export function PatientFilters({ value, onChange }: PatientFiltersProps) {
  return (
    <Card title="Filtrer les patients">
      <div role="search" className="grid gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        <TextField
          label="Recherche"
          type="search"
          placeholder="Nom, prénom ou n° de dossier"
          autoComplete="off"
          showRequirement={false}
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
        />
        <SelectField
          label="Pathologie"
          placeholder="Toutes les pathologies"
          options={conditionOptions}
          showRequirement={false}
          value={value.condition}
          onChange={(event) => onChange({ ...value, condition: event.target.value })}
        />
      </div>
    </Card>
  )
}
