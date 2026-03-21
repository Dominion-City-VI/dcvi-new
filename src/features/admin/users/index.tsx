import { useState, useEffect } from 'react';
import { Main } from '@/components/layout/main';
import { useStore } from '@/store';
import { paginatedRes } from '@/constants/data';
import { useAdminFetchUsers } from '@/hooks/admin/useAdminFetchUsers';
import { observer } from 'mobx-react-lite';
import { Skeleton } from '@/components/ui/skeleton';
import { UsersTable } from './components/UsersTable';

const Users = () => {
  const {
    AdminStore: { usersQuery }
  } = useStore();
  const [users, setUsers] = useState<TDCVIPaginatedRes<TAdminUserItem>>({
    items: [],
    ...paginatedRes
  });

  const { data, isLoading, status } = useAdminFetchUsers(usersQuery);

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setUsers(data);
    }
  }, [isLoading, data]);

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All users</h2>
          <p className="text-muted-foreground">Here's your user history!</p>
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
            <p className="text-sm">Could not load users. The server may be starting up — please try again shortly.</p>
          </div>
        ) : (
          <UsersTable {...{ placeholder: 'filter users...', data: users }} />
        )}
      </div>
    </Main>
  );
};

export default observer(Users);
