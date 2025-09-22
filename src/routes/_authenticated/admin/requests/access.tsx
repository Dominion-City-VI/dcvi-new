import RequestAccess from '@/features/admin/requests/access';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/requests/access')({
  component: RequestAccess
});
