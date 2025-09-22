import PhoneBook from '@/features/messaging/phoneBook';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/messaging/phone-book/')({
  component: PhoneBook
});
