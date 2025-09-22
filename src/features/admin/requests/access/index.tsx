import { useState, useEffect } from 'react';
import { Main } from '@/components/layout/main';
import { useStore } from '@/store';
import { paginatedRes } from '@/constants/data';
import { useAdminFetchAccessReqs } from '@/hooks/admin/useAdminFetchAccessReqs';
import { Skeleton } from '@/components/ui/skeleton';
import { AccessReqsTable } from './components/AccessTable';

const RequestAccess = () => {
  const {
    AdminStore: { usersQuery }
  } = useStore();
  const [access, setAccess] = useState<TDCVIPaginatedRes<TAdminAccessReqsItem>>({
    items: [],
    ...paginatedRes
  });

  const { data, isLoading } = useAdminFetchAccessReqs(usersQuery);

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setAccess(data);
    }
  }, [isLoading, data]);

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Access Requests</h2>
          <p className="text-muted-foreground">Here's your access request history!</p>
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
        ) : (
          <AccessReqsTable {...{ placeholder: 'filter users...', data: access }} />
        )}
      </div>
    </Main>
  );
};

export default RequestAccess;
