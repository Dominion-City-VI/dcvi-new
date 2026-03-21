import { useState, useEffect } from 'react';
import { Main } from '@/components/layout/main';
import { useStore } from '@/store';
import { paginatedRes } from '@/constants/data';
import { useAdminFetchActionReqs } from '@/hooks/admin/useAdminFetchActionReqs';
import { Skeleton } from '@/components/ui/skeleton';
import { ActionTable } from './components/ActionTable';

const RequestAction = () => {
  const {
    AdminStore: { usersQuery }
  } = useStore();
  const [actions, setActions] = useState<TDCVIPaginatedRes<TAdminActionReqsItem>>({
    items: [],
    ...paginatedRes
  });

  const { data, isLoading, status } = useAdminFetchActionReqs(usersQuery);

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setActions(data);
    }
  }, [isLoading, data]);

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Action Requests</h2>
          <p className="text-muted-foreground">Here's your action request history!</p>
        </div>
      </div>

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        {isLoading ? (
          <div className="flex w-full flex-col space-y-4">
            <div className="flex w-full items-center justify-between">
              <Skeleton className="h-8 w-36" /> <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        ) : status === 'error' ? (
          <div className="flex h-60 flex-col items-center justify-center gap-2 text-muted-foreground">
            <p className="text-sm">Could not load action requests. The server may be starting up — please try again shortly.</p>
          </div>
        ) : (
          <ActionTable {...{ placeholder: 'filter actions...', data: actions }} />
        )}
      </div>
    </Main>
  );
};

export default RequestAction;
