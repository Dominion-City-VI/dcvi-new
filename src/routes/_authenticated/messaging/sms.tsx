import SMS from '@/features/messaging/sms';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/messaging/sms')({
  component: SMS
});
