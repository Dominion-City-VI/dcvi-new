import attendance from '@/features/admin/zones/attendance'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/zones/attendance/')(
  {
    component: attendance,
  },
)