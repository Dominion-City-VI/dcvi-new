import RequestsActions from '@/features/admin/requests/actions';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/requests/actions')({
  component: RequestsActions
});
