import { Main } from '@/components/layout/main';
import { useFetchCellMembers } from '@/hooks/cell/useFetchCellMembers';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/features/cells/members/components/DataTable';
import { columns } from '@/features/cells/members/components/columns';
import { observer } from 'mobx-react-lite';
import CellMembersButtons from '@/features/cells/members/components/cellMembersButtons';
import { Route } from '@/routes/_authenticated/admin/zones/$zoneId/$cellId';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useRouter } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

const Cell = () => {
  const { history } = useRouter();
  const onBack = () => history.go(-1);
  const { zoneId, cellId } = Route.useParams();
  const [cellMembers, setCellMembers] = useState<Array<TCellMember>>([]);
  const { data, isLoading } = useFetchCellMembers({
    CellId: cellId,
    ZoneId: zoneId
  });

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setCellMembers(data.items);
    }
  }, [isLoading, data]);

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator>
              <ArrowLeft />
            </BreadcrumbSeparator>
            <BreadcrumbItem onClick={onBack} className="cursor-pointer">
              <BreadcrumbPage>Back to zone</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cell Members</h2>
          <p className="text-muted-foreground">Here's your Cell members history!</p>
        </div>
        <CellMembersButtons />
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
          <DataTable {...{ placeholder: 'Filter Members...', columns, data: cellMembers }} />
        )}
      </div>
    </Main>
  );
};

export default observer(Cell);
