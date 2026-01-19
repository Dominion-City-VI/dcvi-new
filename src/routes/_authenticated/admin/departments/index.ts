import departments from '@/features/admin/departments/dept';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/departments/')({
  component: departments
});
