import { useMemo, useState } from 'react';
import { XModal } from '@/components/modals';
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClientPagination } from '@/components/ClientPagination';
import { useFetchDepartmentWithMembers } from '@/hooks/department/useFetchDepartment';

function fullName(p: People) {
  return `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || '-';
}

const columns: ColumnDef<People>[] = [
  // { accessorKey: 'source', header: 'Source' },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{fullName(row.original)}</span>
  },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phoneNumber', header: 'Phone' },
  {
    id: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const p = row.original;
      const roles = [p.isLeader ? 'Leader' : null, p.isAssistant ? 'Assistant' : null].filter(Boolean);
      return <span>{roles.length ? roles.join(', ') : 'Member'}</span>;
    }
  }
];

export default function ViewDepartmentPeopleModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, viewDepartmentModal }
  } = useStore();

  // wherever you stored the department id when opening the modal
  const departmentId = viewDepartmentModal?.id as string | undefined;

  const { data, isLoading, error } = useFetchDepartmentWithMembers(departmentId);

  const tableData = useMemo(() => data?.people ?? [], [data]);

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: tableData, // ✅ FIX: People[]
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } }
  });

  const title = data?.name ?? 'Service Unit Members';
  const count = data?.people?.length ?? 0;
  const isError = !!error;

  return (
    <XModal isOpen={isOpen.VIEW_DEPARTMENT_MODAL} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="mb-3">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isLoading ? 'Loading people...' : `${count} member${count === 1 ? '' : 's'}`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-[50vh] w-full" />
          </div>
        ) : isError ? (
          <div className="rounded-md border p-4 text-sm">
            Failed to load members for this unit.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="max-h-[60vh] overflow-auto rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-40 text-center">
                        No people found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <ClientPagination table={table} />
          </div>
        )}

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
