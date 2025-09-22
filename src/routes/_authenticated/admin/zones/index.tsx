import zones from '@/features/admin/zones';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/zones/')({
  component: zones
});
