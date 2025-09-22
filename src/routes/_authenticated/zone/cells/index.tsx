import ZoneId from '@/features/zone/cells';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/zone/cells/')({
  component: ZoneId
});
