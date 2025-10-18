// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
// import LongText from '@/components/LongText';
// import { getProgressClass } from './data/data';

// const columnHelper = createColumnHelper<TZonalAttendanceItem>();

// // Static columns
// const staticColumns: ColumnDef<TZonalAttendanceItem>[] = [
//   {
//     id: 'cell-details',
//     header: () => (
//       <div className="text-center">
//         <div className="font-semibold">Cell details</div>
//       </div>
//     ),
//     columns: [
//       columnHelper.display({
//         id: 'serialNumber',
//         header: 'S/N',
//         cell: ({ row }) => {
//           return <div className="p-1.5">{row.index + 1}</div>;
//         },
//         size: 60
//       }),
//       columnHelper.accessor('cellName', {
//         id: 'cellName',
//         header: 'Cell Name',
//         cell: ({ getValue }) => {
//           return <div className="">{getValue()}</div>;
//         },
//         size: 120
//       }),
//       columnHelper.accessor('cellLeader', {
//         id: 'cellLeader',
//         header: 'Cell leader',
//         cell: ({ getValue }) => {
//           const { name, phoneNumber, email } = getValue<TCellAttendanceCellLeader>();
//           return (
//             <div className="">
//               <h3>{name ?? '-'}</h3>
//               <div className="text-muted-foreground flex flex-col">
//                 <small>{email ?? "-"}</small>
//                 <small>{phoneNumber ?? "-"}</small>
//               </div>
//             </div>
//           );
//         },
//         size: 120
//       })
//     ]
//   }
// ];

// // dynamic columns
// const createAttendanceColumnsOnly = (
//   data: TZonalAttendanceItem[]
// ): ColumnDef<TZonalAttendanceItem>[] => {
//   if (!data.length) return [];

//   const allWeeks = data.flatMap((item) => item.cellAttenanceResponseVMs);
//   const uniqueWeeks = Array.from(new Map(allWeeks.map((week) => [week.dateRange, week])).values());

//   return uniqueWeeks.map((week, index) => ({
//     id: `week-${index}`,
//     header: () => (
//       <div className="">
//         <div className="font-semibold">{week.dateRange}</div>
//       </div>
//     ),
//     columns: [
//       // Tuesday column
//       columnHelper.accessor(
//         (row) => {
//           const weekData = row.cellAttenanceResponseVMs.find((w) => w.dateRange === week.dateRange);
//           return weekData?.record.tuesdayAttendanceStatus ?? 6;
//         },
//         {
//           id: `tuesday-${index}`,
//           header: () => (
//             <div className="text-sm font-medium">
//               {new Date(week.tuesdayDate).toLocaleDateString('en-US', {
//                 weekday: 'short',
//                 month: 'short',
//                 day: 'numeric'
//               })}
//             </div>
//           ),
//           cell: ({ getValue }) => {
//             const status = getValue<number>();
//             const badgeColor = getProgressClass(status);
//             return (
//               <div className="flex h-[52px] justify-center">
//                 <Badge variant="outline" className={cn('h-full w-full capitalize', badgeColor)}>
//                   <LongText>{status}%</LongText>
//                 </Badge>
//               </div>
//             );
//           },
//           size: 120
//         }
//       ),
//       // Cell Date column
//       columnHelper.accessor(
//         (row) => {
//           const weekData = row.cellAttenanceResponseVMs.find((w) => w.dateRange === week.dateRange);
//           return weekData?.record.cellAttendanceStatus ?? 6;
//         },
//         {
//           id: `cell-${index}`,
//           header: () => (
//             <div className="text-sm font-medium">
//               {new Date(week.cellDate).toLocaleDateString('en-US', {
//                 weekday: 'short',
//                 month: 'short',
//                 day: '2-digit'
//               })}
//             </div>
//           ),
//           cell: ({ getValue }) => {
//             const status = getValue<number>();
//             const badgeColor = getProgressClass(status);
//             return (
//               <div className="flex h-[52px] justify-center">
//                 <Badge variant="outline" className={cn('h-full w-full capitalize', badgeColor)}>
//                   <LongText>{status}%</LongText>
//                 </Badge>
//               </div>
//             );
//           },
//           size: 120
//         }
//       ),
//       // Sunday column
//       columnHelper.accessor(
//         (row) => {
//           const weekData = row.cellAttenanceResponseVMs.find((w) => w.dateRange === week.dateRange);
//           return weekData?.record.sundayAttendanceStatus ?? 6;
//         },
//         {
//           id: `sunday-${index}`,
//           header: () => (
//             <div className="text-sm font-medium">
//               {new Date(week.sundayDate).toLocaleDateString('en-US', {
//                 weekday: 'short',
//                 month: 'short',
//                 day: 'numeric'
//               })}
//             </div>
//           ),
//           cell: ({ getValue }) => {
//             const status = getValue<number>();
//             const badgeColor = getProgressClass(status);
//             return (
//               <div className="flex h-[52px] justify-center">
//                 <Badge variant="outline" className={cn('h-full w-full capitalize', badgeColor)}>
//                   <LongText>{status}%</LongText>
//                 </Badge>
//               </div>
//             );
//           },
//           size: 120
//         }
//       )
//     ]
//   }));
// };

// export const createFullAttendanceColumns = (
//   data: TZonalAttendanceItem[]
// ): ColumnDef<TZonalAttendanceItem>[] => {
//   return [...staticColumns, ...createAttendanceColumnsOnly(data)];
// };


import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import LongText from '@/components/LongText';
import { getProgressClass } from './data/data';

const columnHelper = createColumnHelper<TZonalAttendanceItem>();

// Static columns
const staticColumns: ColumnDef<TZonalAttendanceItem>[] = [
  {
    id: 'cell-details',
    header: () => (
      <div className="text-center">
        <div className="font-semibold">Cell details</div>
      </div>
    ),
    columns: [
      columnHelper.display({
        id: 'serialNumber',
        header: 'S/N',
        cell: ({ row }) => {
          return <div className="p-1.5">{row.index + 1}</div>;
        },
        size: 60
      }),
      columnHelper.accessor('cellName', {
        id: 'cellName',
        header: 'Cell Name',
        cell: ({ getValue }) => {
          return <div className="">{getValue()}</div>;
        },
        size: 120
      }),
      columnHelper.accessor('cellLeader', {
        id: 'cellLeader',
        header: 'Cell leader',
        cell: ({ getValue }) => {
          const { name, phoneNumber, email } = getValue<TCellAttendanceCellLeader>();
          return (
            <div className="">
              <h3>{name ?? '-'}</h3>
              <div className="text-muted-foreground flex flex-col">
                <small>{email ?? "-"}</small>
                <small>{phoneNumber ?? "-"}</small>
              </div>
            </div>
          );
        },
        size: 120
      })
    ]
  }
];

// dynamic columns
const createAttendanceColumnsOnly = (
  data: TZonalAttendanceItem[]
): ColumnDef<TZonalAttendanceItem>[] => {
  if (!data.length) return [];

  const allWeeks = data.flatMap((item) => item.cellAttenanceResponseVMs);
  const uniqueWeeks = Array.from(new Map(allWeeks.map((week) => [week.dateRange, week])).values());

  return uniqueWeeks.map((week, index) => ({
    id: `week-${index}`,
    header: () => (
      <div className="">
        <div className="font-semibold">{week.dateRange}</div>
      </div>
    ),
    columns: [
      // Tuesday column
      columnHelper.accessor(
        (row) => {
          const weekData = row.cellAttenanceResponseVMs.find((w) => w.dateRange === week.dateRange);
          return weekData?.record.tuesdayAttendanceStatus ?? 6;
        },
        {
          id: `tuesday-${index}`,
          header: () => (
            <div className="text-sm font-medium">
              {new Date(week.tuesdayDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })} (Tues)
            </div>
          ),
          cell: ({ getValue }) => {
            const status = getValue<number>();
            const badgeColor = getProgressClass(status);
            return (
              <div className="flex h-[52px] justify-center">
                <Badge variant="outline" className={cn('h-full w-full capitalize', badgeColor)}>
                  <LongText>{status}%</LongText>
                </Badge>
              </div>
            );
          },
          size: 120
        }
      ),
      // Cell Date column
      columnHelper.accessor(
        (row) => {
          const weekData = row.cellAttenanceResponseVMs.find((w) => w.dateRange === week.dateRange);
          return weekData?.record.cellAttendanceStatus ?? 6;
        },
        {
          id: `cell-${index}`,
          header: () => (
            <div className="text-sm font-medium">
              {new Date(week.cellDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: '2-digit'
              })} (Cell)
            </div>
          ),
          cell: ({ getValue }) => {
            const status = getValue<number>();
            const badgeColor = getProgressClass(status);
            return (
              <div className="flex h-[52px] justify-center">
                <Badge variant="outline" className={cn('h-full w-full capitalize', badgeColor)}>
                  <LongText>{status}%</LongText>
                </Badge>
              </div>
            );
          },
          size: 120
        }
      ),
      // Sunday column (with right border separator)
      columnHelper.accessor(
        (row) => {
          const weekData = row.cellAttenanceResponseVMs.find((w) => w.dateRange === week.dateRange);
          return weekData?.record.sundayAttendanceStatus ?? 6;
        },
        {
          id: `sunday-${index}`,
          header: () => (
            <div className="text-sm font-medium">
              {new Date(week.sundayDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })} (Sun)
            </div>
          ),
          cell: ({ getValue }) => {
            const status = getValue<number>();
            const badgeColor = getProgressClass(status);
            return (
              <div className="flex h-[52px] justify-center">
                <Badge variant="outline" className={cn('h-full w-full capitalize', badgeColor)}>
                  <LongText>{status}%</LongText>
                </Badge>
              </div>
            );
          },
          size: 120
        }
      )
    ]
  }));
};

export const createFullAttendanceColumns = (
  data: TZonalAttendanceItem[]
): ColumnDef<TZonalAttendanceItem>[] => {
  return [...staticColumns, ...createAttendanceColumnsOnly(data)];
};