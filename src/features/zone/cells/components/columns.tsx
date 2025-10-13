import { ColumnDef } from '@tanstack/react-table';
import LongText from '@/components/LongText';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableRowActions } from './Actions';
import { zoneStatusCallTypes } from '@/features/admin/zones/components/data/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getZoneStatusText } from '@/utils/zones';
import { getCellHoldingDayText, getCellTypeText } from '@/utils/actions';
import { cellTypeFormat } from '@/features/admin/requests/actions/components/data/data';

export const columns: Array<ColumnDef<TCell>> = [
  {
    id: 'cellId',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
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
    accessorKey: 'cellName',
    header: () => 'Cell name',
    cell: ({ row }) => {
      return <LongText className="line-clamp-3 text-ellipsis">{row.original.cellName}</LongText>;
    }
  },

  {
    accessorKey: 'cellLeaderName',
    header: () => 'Leader Name',
    cell: ({ row }) => {
      return <div>{row.original?.cellLeaderName ?? '-'}</div>;
    }
  },

  {
    accessorKey: 'cellLeaderEmail',
    header: () => 'Leader email',
    cell: ({ row }) => {
      return <div>{row.original?.cellLeaderEmail ?? '-'}</div>;
    }
  },

  {
    accessorKey: 'cellLeaderPhoneNumber',
    header: () => 'Leader Phone Number',
    cell: ({ row }) => {
      return <div>(+234) {row.original?.cellLeaderPhoneNumber ?? '-'}</div>;
    }
  },

  {
    accessorKey: 'cellType',
    header: () => 'Type',
    cell: ({ getValue }) => {
      const type = getValue<number>();
      const badgeColor = cellTypeFormat.get(type);
      return (
        <div className="">
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {getCellTypeText(type)}
          </Badge>
        </div>
      );
    }
  },
  
{
    accessorKey: 'isVirtual',
    header: () => 'Is Virtual',
    cell: ({ row }) => {
      const isVirtual = row.original?.isVirtual;
      return <div>{isVirtual === null || isVirtual === undefined ? 'Not Specified' : isVirtual ? 'Yes' : 'No'}</div>;
    }
  },

  // {
  //   accessorKey: 'meetingLocation',
  //   header: () => 'Meeting Location',
  //   cell: ({ row }) => {
  //     const isVirtual = row.original?.isVirtual;
  //     if (isVirtual) {
  //       return (
  //         <a 
  //           href={row.original?.meetingLink || '#'} 
  //           target="_blank" 
  //           rel="noopener noreferrer"
  //           className="text-blue-600 hover:underline"
  //         >
  //           {row.original?.meetingLink || 'Nil'}
  //         </a>
  //       );
  //     }
  //     return <div>{row.original?.meetingAddress || 'Nil'}</div>;
  //   }
  // },    

  {
    accessorKey: 'meetingLocation',
    header: () => 'Meeting Location',
    cell: ({ row }) => {
      const isVirtual = row.original?.isVirtual;
      const meetingLink = row.original?.meetingLink;
      const meetingAddress = row.original?.meetingAddress;
      
      const content = isVirtual ? meetingLink : meetingAddress;
      
      if (!content) return <div>-</div>;
      
      const truncatedContent = content.length > 10 ? `${content.slice(0, 10)}...` : content;
      
      const handleCopy = () => {
        navigator.clipboard.writeText(content);
      };
      
      return (
        <div className="flex items-center gap-2">
          {isVirtual ? (
            <>
              <a 
                href={content} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                title={content}
              >
                {truncatedContent}
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="text-gray-500 hover:text-gray-700"
                title="Copy link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </>
          ) : (
            <>
              <span title={content}>{truncatedContent}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="text-gray-500 hover:text-gray-700"
                title="Copy address"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </>
          )}
        </div>
      );
    }
  },

  {
    accessorKey: 'holdingTime',
    header: () => 'Holding Time',
    cell: ({ row }) => {
      return <div>{row.original?.holdingTime ?? 'Nil'}</div>;
    }
  },

 {
    accessorKey: 'holdingDayOfWeek',
    header: () => 'Holding Day',
    cell: ({ getValue }) => {
      const type = getValue<number>();
      return (
        <div className="">
          <div>
            {getCellHoldingDayText(type)}
          </div>
        </div>
      );
    }
  },
    
  {
    accessorKey: 'cellStatus',
    header: () => 'Status',
    cell: ({ row }) => {
      const badgeColor = zoneStatusCallTypes.get(row.original.cellStatus);
      return (
        <Badge variant="outline" className={cn('capitalize', badgeColor)}>
          {getZoneStatusText(row.original.cellStatus)}
        </Badge>
      );
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
