import { ColumnDef } from '@tanstack/react-table';
import LongText from '@/components/LongText';
import { Badge } from '@/components/ui/badge';
import { dateTimeUTC } from '@/utils/date';
import { smsCallTypes, smsStatusCallTypes } from './data/data';
import { getSMSStatusText, getSMSTypeText } from '@/utils/sms';
import { toTitleCase } from '@/utils';
import { cn } from '@/lib/utils';

export const columns: Array<ColumnDef<TSMSLogItem>> = [
  {
    accessorKey: 'to',
    header: () => 'Contact',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.original.to}
          </span>
        </div>
      );
    }
  },

  {
    accessorKey: 'mesage',
    header: () => 'Message',
    cell: ({ row }) => {
      return (
        <LongText className="line-clamp-3 w-80 text-ellipsis">{row.original.message}</LongText>
      );
    }
  },

  {
    accessorKey: 'status',
    header: () => 'Status',
    cell: ({ getValue }) => {
      const status = getValue<number>();
      const badgeColor = smsStatusCallTypes.get(status);
      return (
        <Badge variant="outline" className={cn('capitalize', badgeColor)}>
          {toTitleCase(getSMSStatusText(status))}
        </Badge>
      );
    }
  },

  {
    accessorKey: 'sentAt',
    header: () => 'Date sent',
    cell: ({ row }) => {
      return <div className="flex space-x-2">{dateTimeUTC(row.original.sentAt, true)}</div>;
    }
  },

  {
    accessorKey: 'smsType',
    header: () => 'Type',
    cell: ({ getValue }) => {
      const status = getValue<number>();
      const badgeColor = smsCallTypes.get(status);
      return (
        <Badge variant="outline" className={cn('capitalize', badgeColor)}>
          {toTitleCase(getSMSTypeText(status))}
        </Badge>
      );
    }
  }
];
