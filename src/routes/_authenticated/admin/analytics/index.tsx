import AdminAnalytics from '@/features/admin/analytics';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/analytics/')({
  component: AdminAnalytics
});
