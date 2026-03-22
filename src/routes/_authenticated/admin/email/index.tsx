import EmailComposer from '@/features/admin/email';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/email/')({
  component: EmailComposer
});
