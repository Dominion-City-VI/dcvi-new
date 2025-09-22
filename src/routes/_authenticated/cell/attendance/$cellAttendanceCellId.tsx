import { createFileRoute } from '@tanstack/react-router'
import ZonalCellAttendanceId from '@/features/cells/attendance/ZonalCellAttendanceId';

export const Route = createFileRoute('/_authenticated/cell/attendance/$cellAttendanceCellId')({
  component: ZonalCellAttendanceId,
})