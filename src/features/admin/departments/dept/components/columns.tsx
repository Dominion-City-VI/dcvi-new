// import { ColumnDef } from '@tanstack/react-table';
// import LongText from '@/components/LongText';
// import { getZoneStatusText } from '@/utils/zones';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { Checkbox } from '@/components/ui/checkbox';
// import { DataTableRowActions } from './Actions';
// import { deptStatusTypes, zoneStatusCallTypes } from './data/data';
// import type { CheckedState } from '@radix-ui/react-checkbox';


// export const columns: Array<ColumnDef<PeopleData>> = [
//   {
//     id: 'id',
//     header: ({ table }) => (
      
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//         className="translate-y-[2px]"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//         className="translate-y-[2px]"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false
//   },

//   {
//     accessorKey: 'name',
//     header: () => 'Service Unit Name',
//     cell: ({ row }) => {
//       return <LongText className="line-clamp-3 text-ellipsis">{row.original.name}</LongText>;
//     }
//   },

//   // {
//   //   accessorKey: 'unitLeader',
//   //   header: () => 'Unit Leader',
//   //   cell: ({ row }) => {
//   //     return (
//   //       <div className="flex flex-col">
//   //         <small>{row.original?.people?.?.name ?? '-'}</small>
//   //         <small>{row.original?.zonalLeader?.email ?? '-'}</small>
//   //         <small>(+234) {row.original?.zonalLeader?.phoneNumber ?? '-'}</small>
//   //       </div>
//   //     );
//   //   }
//   // },

//   {
//     accessorKey: 'status',
//     header: () => 'Status',
//     cell: ({ row }) => {
//       const badgeColor = deptStatusTypes.get(row.original.isActive);
//       return (
//         <Badge variant="outline" className={cn('capitalize', badgeColor)}>
//           {(row.original.isActive == true ? "Active" : "In-Active")}
//         </Badge>
//       );
//     }
//   },

//   {
//     accessorKey: 'ms',
//     header: () => 'Membership Strength',
//     cell: ({ row }) => {
//       return <div>{row.original?.people.length ?? '-'}</div>;
//     }
//   },

//   {
//     id: 'actions',
//     cell: ({ row }) => <DataTableRowActions row={row} />
//   }
// ];


import type { CheckedState } from '@radix-ui/react-checkbox';
import { ColumnDef } from '@tanstack/react-table';
import LongText from '@/components/LongText';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableRowActions } from './Actions';
import { deptStatusTypes } from './data/data';

export const columns: Array<ColumnDef<PeopleData>> = [
  {
    id: 'id',
    header: ({ table }) => {
      const checked: CheckedState = table.getIsAllPageRowsSelected()
        ? true
        : table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : false;

      return (
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },

  {
    accessorKey: 'name',
    header: () => 'Service Unit Name',
    cell: ({ row }) => (
      <LongText className="line-clamp-3 text-ellipsis">{row.original.name}</LongText>
    )
  },

  {
    accessorKey: 'status',
    header: () => 'Status',
    cell: ({ row }) => {
      const badgeColor = deptStatusTypes.get(row.original.isActive);
      return (
        <Badge variant="outline" className={cn('capitalize', badgeColor)}>
          {row.original.isActive ? 'Active' : 'In-Active'}
        </Badge>
      );
    }
  },

  {
    accessorKey: 'ms',
    header: () => 'Membership Strength',
    cell: ({ row }) => <div>{row.original?.people?.length ?? '-'}</div>
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
