export type UserRole = 'gestionnaire'

export interface HealthStructure {
  id: string
  name: string
}

export interface User {
  name: string
  role: UserRole
  structure: HealthStructure
}

export interface Credentials {
  structureId: string
  identifier: string
  password: string
}
