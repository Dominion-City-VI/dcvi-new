import PhonebookId from '@/features/messaging/phoneBook/phonebookId';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/messaging/phone-book/$phonebookId')({
  component: PhonebookId
});
