import Members from '@/features/cells/members';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/cell/members/')({
  component: Members
});
