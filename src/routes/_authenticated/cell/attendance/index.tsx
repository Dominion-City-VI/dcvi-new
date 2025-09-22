import Attendance from '@/features/cells/attendance';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/cell/attendance/')({
  component: Attendance
});
