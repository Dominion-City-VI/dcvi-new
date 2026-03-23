import { Main } from '@/components/layout/main';
import { useFetchCellMembers } from '@/hooks/cell/useFetchCellMembers';
import { useState, useEffect } from 'react';
import CellMembersButtons from './components/cellMembersButtons';
import { useStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from './components/DataTable';
import { columns } from './components/columns';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportCellMembersToExcel } from '@/utils/exportExcel';

const Members = () => {
  const {
    AuthStore: { userExtraInfo }
  } = useStore();
  const [cellMembers, setCellMembers] = useState<Array<TCellMember>>([]);
  const { data, isLoading } = useFetchCellMembers({
    CellId: userExtraInfo.cellId,
    ZoneId: userExtraInfo.zonalId
  });

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setCellMembers(data.items);
    }
  }, [isLoading, data]);

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cell Members</h2>
          <p className="text-muted-foreground">Here's your Cell members history!</p>
        </div>
        {cellMembers.length > 0 && (
          <Button size="sm" variant="outline" onClick={() => exportCellMembersToExcel(cellMembers, 'Cell')}>
            <Download className="mr-1 h-4 w-4" />
            Export Excel
          </Button>
        )}
      </div>

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        {isLoading ? (
          <div className="flex w-full flex-col space-y-4">
            <div className="flex w-full items-center justify-between">
              <Skeleton className="h-8 w-36" /> <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <>
            <CellMembersButtons />
            <DataTable {...{ placeholder: 'Filter Members...', columns, data: cellMembers }} />
          </>
        )}
      </div>
    </Main>
  );
};

export default observer(Members);
