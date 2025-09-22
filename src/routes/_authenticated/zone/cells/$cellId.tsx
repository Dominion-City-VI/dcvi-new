import { createFileRoute } from '@tanstack/react-router';
import CellId from '@/features/zone/cells/cellId';

export const Route = createFileRoute('/_authenticated/zone/cells/$cellId')({
  component: CellId
});
