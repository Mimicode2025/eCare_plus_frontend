import { listAppointments } from '@/features/appointments/services/appointmentService'
import { useAsyncData } from '@/hooks/useAsyncData'

export function useAppointments() {
  return useAsyncData('appointments', listAppointments)
}
