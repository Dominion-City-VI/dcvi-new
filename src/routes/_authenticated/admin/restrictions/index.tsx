import AttendanceRestrictions from '@/features/admin/restrictions';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/restrictions/')({
  component: AttendanceRestrictions
});
