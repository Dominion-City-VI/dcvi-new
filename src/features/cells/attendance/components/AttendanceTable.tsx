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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { DataTablePagination } from '@/components/Pagination';
import { createFullAttendanceColumns } from './columns';
import DataTableToolbar from './TableToolbar';
import { observer } from 'mobx-react-lite';

interface DataTableProps {
  cellAttendance: Array<TCellAttendanceItem>;
  placeholder: string;
}

const AttendanceTable = ({ cellAttendance, placeholder }: DataTableProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = createFullAttendanceColumns(cellAttendance);

  const table = useReactTable({
    data: cellAttendance,
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
        pageSize: 20
      }
    }
  });

  const headerGroups = table.getHeaderGroups();

  const separateHeaders = (headers: Header<TCellAttendanceItem, unknown>[]) => {
    const fixedHeaders = headers.filter(
      (header) =>
        header.column.parent?.id === 'member-details' || header.column.id === 'member-details'
    );
    const scrollableHeaders = headers.filter(
      (header) =>
        header.column.parent?.id !== 'member-details' && header.column.id !== 'member-details'
    );
    return { fixedHeaders, scrollableHeaders };
  };

  const separateCells = (cells: Cell<TCellAttendanceItem, unknown>[]) => {
    const fixedCells = cells.filter(
      (cell) => cell.column.parent?.id === 'member-details' || cell.column.id === 'member-details'
    );
    const scrollableCells = cells.filter(
      (cell) => cell.column.parent?.id !== 'member-details' && cell.column.id !== 'member-details'
    );
    return { fixedCells, scrollableCells };
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar {...{ placeholder, table }} />
      <div className="rounded-md border">
        <div className="flex">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={25}>
              <div className="flex-shrink-0 border-r">
                <Table className="">
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
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
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
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default observer(AttendanceTable);
