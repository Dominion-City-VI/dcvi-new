import DepartmentMembers from '@/features/departments/members';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/department/departmentMembers/')({
  component: DepartmentMembers
});
