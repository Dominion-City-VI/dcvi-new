import { useState } from 'react';
import {
  Cell,
  ColumnFiltersState,
  Header,
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
import { DataTablePagination } from '@/components/Pagination';
import { createFullAttendanceColumns } from './columns';
import { observer } from 'mobx-react-lite';

interface DataTableProps {
  zonalAttendance: Array<TZonalAttendanceItem>;
}

const AttendanceTable = ({ zonalAttendance }: DataTableProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = createFullAttendanceColumns(zonalAttendance);

  const table = useReactTable({
    data: zonalAttendance,
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
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  const headerGroups = table.getHeaderGroups();

  const separateHeaders = (headers: Header<TZonalAttendanceItem, unknown>[]) => {
    const fixedHeaders = headers.filter(
      (header) => header.column.parent?.id === 'cell-details' || header.column.id === 'cell-details'
    );
    const scrollableHeaders = headers.filter(
      (header) => header.column.parent?.id !== 'cell-details' && header.column.id !== 'cell-details'
    );
    return { fixedHeaders, scrollableHeaders };
  };

  const separateCells = (cells: Cell<TZonalAttendanceItem, unknown>[]) => {
    const fixedCells = cells.filter(
      (cell) => cell.column.parent?.id === 'cell-details' || cell.column.id === 'cell-details'
    );
    const scrollableCells = cells.filter(
      (cell) => cell.column.parent?.id !== 'cell-details' && cell.column.id !== 'cell-details'
    );
    return { fixedCells, scrollableCells };
  };

  return (
    <div className="space-y-4 pb-30 md:pb-20">
      <div className="rounded-md border">
        <div className="flex">
          <div className="flex-shrink-0 border-r">
            <Table>
              <TableHeader>
                {headerGroups.map((headerGroup) => {
                  const { fixedHeaders } = separateHeaders(headerGroup.headers);
                  return (
                    <TableRow key={`fixed-${headerGroup.id}`}>
                      {fixedHeaders.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  );
                })}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const { fixedCells } = separateCells(row.getVisibleCells());
                    return (
                      <TableRow
                        key={`fixed-${row.id}`}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {fixedCells.map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell className="h-96 text-center">No results.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex-1 overflow-x-auto">
            <Table>
              <TableHeader>
                {headerGroups.map((headerGroup) => {
                  const { scrollableHeaders } = separateHeaders(headerGroup.headers);
                  return (
                    <TableRow key={`scroll-${headerGroup.id}`}>
                      {scrollableHeaders.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className="whitespace-nowrap"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  );
                })}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const { scrollableCells } = separateCells(row.getVisibleCells());
                    return (
                      <TableRow
                        key={`scroll-${row.id}`}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {scrollableCells.map((cell) => (
                          <TableCell key={cell.id} className="whitespace-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell className="h-96 text-center">No results.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Move pagination outside of the individual table rows, so it appears only once */}
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
};

export default observer(AttendanceTable);
