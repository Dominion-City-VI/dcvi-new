import ZoneAttendance from '@/features/zone/attendance';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/zone/attendance/')({
  component: ZoneAttendance
});
