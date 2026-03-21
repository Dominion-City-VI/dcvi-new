import DeptAttendanceOverview from '@/features/admin/departments/deptAttendance';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/departments/attendance/')({
  component: DeptAttendanceOverview
});
