import { createFileRoute } from '@tanstack/react-router'
import DepartmentAttendanceId from '@/features/departments/attendance/DepartmentAttendanceId';

export const Route = createFileRoute('/_authenticated/department/deptAttendance/$departmentAttendanceId')({
  component: DepartmentAttendanceId,
})