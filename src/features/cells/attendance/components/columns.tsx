import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { callTypes } from './data/data';
import { getAttendanceStatusText } from '@/utils/attendance';
import { toTitleCase } from '@/utils';
import { DataTableRowActions } from './Actions';
import LongText from '@/components/LongText';

const columnHelper = createColumnHelper<TCellAttendanceItem>();

// Static columns that never change
const staticColumns: ColumnDef<TCellAttendanceItem>[] = [
  {
    id: 'member-details',
    header: () => (
      <div className="text-center">
        <div className="font-semibold">Member details</div>
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
      columnHelper.accessor('memberName', {
        id: 'firstName',
        header: 'First Name',
        cell: ({ getValue }) => {
          const fullName = getValue<string>();
          const firstName = fullName.split(' ')[0];
          return <div className="">{firstName}</div>;
        },
        size: 120
      }),
      columnHelper.accessor('memberName', {
        id: 'lastName',
        header: 'Last Name',
        cell: ({ getValue }) => {
          const fullName = getValue<string>();
          const [, ...lastNameParts] = fullName.split(' ');
          return <div className="">{lastNameParts.join(' ')}</div>;
        },
        size: 120
      })
    ]
  }
];

const createAttendanceColumnsOnly = (
  data: TCellAttendanceItem[],
  isRestricted = false
): ColumnDef<TCellAttendanceItem>[] => {
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
              })}
            </div>
          ),
          cell: ({ getValue }) => {
            const status = getValue<number>();
            const badgeColor = callTypes.get(status);
            return (
              <div className="">
                <Badge variant="outline" className={cn('capitalize', badgeColor)}>
                  <LongText>{toTitleCase(getAttendanceStatusText(status))}</LongText>
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
              })}
            </div>
          ),
          cell: ({ getValue }) => {
            const status = getValue<number>();
            const badgeColor = callTypes.get(status);
            return (
              <div className="">
                <Badge variant="outline" className={cn('capitalize', badgeColor)}>
                  <LongText>{toTitleCase(getAttendanceStatusText(status))}</LongText>
                </Badge>
              </div>
            );
          },
          size: 120
        }
      ),
      // Sunday column
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
              })}
            </div>
          ),
          cell: ({ getValue }) => {
            const status = getValue<number>();
            const badgeColor = callTypes.get(status);
            return (
              <div className="">
                <Badge variant="outline" className={cn('capitalize', badgeColor)}>
                  <LongText>{toTitleCase(getAttendanceStatusText(status))}</LongText>
                </Badge>
              </div>
            );
          },
          size: 120
        }
      ),

      columnHelper.accessor(
        (row) => {
          const weekData = row.cellAttenanceResponseVMs.find((w) => w.dateRange === week.dateRange);
          return {
            memberId: row.memberId,
            cellId: row.cellId,
            weekData
          } as {
            memberId: string;
            cellId: string;
            weekData?: TcellAttenanceResponseVMsItem;
          };
          //return weekData?.record.sundayAttendanceStatus ?? 6;
        },
        {
          id: `actions-${index}`,
          header: '',
          cell: ({ row }) => <DataTableRowActions row={row} weekDateRange={week.dateRange} isRestricted={isRestricted} />,
          size: 150
        }
      )
    ]
  }));
};

export const createFullAttendanceColumns = (
  data: TCellAttendanceItem[],
  isRestricted = false
): ColumnDef<TCellAttendanceItem>[] => {
  return [...staticColumns, ...createAttendanceColumnsOnly(data, isRestricted)];
};
