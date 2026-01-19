import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/TableViewOptions';
import { useEffect, useState } from 'react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  placeholder: string;
}

export function DataTableToolbar<TData>({ table, placeholder }: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  useEffect(() => {
    table.setGlobalFilter(searchValue);
  }, [searchValue, table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearchChange}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getState().globalFilter && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetGlobalFilter();
              setSearchValue('');
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
