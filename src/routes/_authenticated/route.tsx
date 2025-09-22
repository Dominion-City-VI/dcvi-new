import { createFileRoute } from '@tanstack/react-router';

import AuthLayout from '@/layout/AuthLayout';

export const Route = createFileRoute('/_authenticated')({
  component: AuthLayout
});
