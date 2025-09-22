import { createFileRoute } from '@tanstack/react-router';
import ZoneId from '@/features/admin/zones/zoneDetails';

export const Route = createFileRoute('/_authenticated/admin/zones/$zoneId/')({
  component: ZoneId
});
