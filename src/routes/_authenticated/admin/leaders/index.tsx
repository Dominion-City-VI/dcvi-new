import LeadersOverview from '@/features/admin/leaders';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/leaders/')({
  component: LeadersOverview
});
