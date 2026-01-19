import Attendance from '@/features/departments/attendance';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/department/deptAttendance/')({
  component: Attendance
});
