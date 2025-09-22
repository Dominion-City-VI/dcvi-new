import { ColumnDef } from '@tanstack/react-table';
import LongText from '@/components/LongText';
import { Badge } from '@/components/ui/badge';
import { dateTimeUTC } from '@/utils/date';
import { transDirTypes, transStatusCallTypes } from './data/data';
import { ccyFormatter, getTransDirText, getTransStatusText } from '@/utils/wallet';
import { toTitleCase } from '@/utils';
import { cn } from '@/lib/utils';

export const columns: Array<ColumnDef<TTransactionLogItem>> = [
  {
    accessorKey: 'reference',
    header: () => 'Transaction Ref',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {row.original.reference.slice(0, 3)}...{row.original.reference.slice(-3)}
        </div>
      );
    }
  },

  {
    accessorKey: 'balanceBefore',
    header: () => 'Balance before',
    cell: ({ row }) => {
      return <span>{ccyFormatter(row.original.balanceBefore)}</span>;
    }
  },

  {
    accessorKey: 'balanceAfter',
    header: () => 'Balance after',
    cell: ({ row }) => {
      return <span>{ccyFormatter(row.original.balanceAfter)}</span>;
    }
  },

  {
    accessorKey: 'narration',
    header: () => 'Narration',
    cell: ({ row }) => {
      return (
        <LongText className="line-clamp-3 w-80 text-ellipsis">{row.original.narration}</LongText>
      );
    }
  },

  {
    accessorKey: 'transactionDirection',
    header: () => 'Type',
    cell: ({ getValue }) => {
      const status = getValue<number>();
      const badgeColor = transStatusCallTypes.get(status);
      return (
        <Badge variant="outline" className={cn('capitalize', badgeColor)}>
          {toTitleCase(getTransDirText(status))}
        </Badge>
      );
    }
  },

  {
    accessorKey: 'amount',
    header: () => 'Amount',
    cell: ({ row }) => {
      return <span>{ccyFormatter(row.original.amount)}</span>;
    }
  },

  {
    accessorKey: 'status',
    header: () => 'Status',
    cell: ({ getValue }) => {
      const status = getValue<number>();
      const badgeColor = transDirTypes.get(status);
      return (
        <Badge variant="outline" className={cn('capitalize', badgeColor)}>
          {toTitleCase(getTransStatusText(status))}
        </Badge>
      );
    }
  },

  {
    accessorKey: 'createdAt',
    header: () => 'Date',
    cell: ({ row }) => {
      return <div className="flex space-x-2">{dateTimeUTC(row.original.createdAt, true)}</div>;
    }
  }
];
