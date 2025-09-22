import cell from '@/features/admin/zones/cell';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/zones/$zoneId/$cellId')({
  component: cell
});
