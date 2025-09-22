import { useState } from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { columns } from './columns';
import { useStore } from '@/store';
import { ServerPagination } from '@/components/ServerPagination';
import { ccyFormatter } from '@/utils/wallet';
import { Button } from '@/components/ui/button';
import { DataTableToolbar } from './DatatableToolbar';

interface DataTableProps {
  data: TTransactionLogRes;
  placeholder: string;
}

export function TransLogTable({ data, placeholder }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    WalletStore: { setLimit, transQuery, setPage }
  } = useStore();
  const pagination: TPaginatedRes = {
    currentPage: data.transactions.currentPage,
    totalItems: data.transactions.totalItems,
    totalPages: data.transactions.totalPages,
    pathUrl: data.transactions.pathUrl,
    previousPageUrl: data.transactions.previousPageUrl,
    nextPageUrl: data.transactions.nextPageUrl
  };

  const table = useReactTable({
    data: data.transactions.items,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: {
        pageSize: transQuery.Limit
      }
    }
  });

  return (
    <div className="space-y-4">
      <div>
        <span>Balance: </span>
        <Button variant="secondary" className="text-xl text-indigo-700">
          {ccyFormatter(data.wallet.balance)}
        </Button>
      </div>

      <DataTableToolbar {...{ placeholder, table }} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-96 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ServerPagination {...{ pagination, setLimit, setPage, Limit: transQuery.Limit }} />
    </div>
  );
}
