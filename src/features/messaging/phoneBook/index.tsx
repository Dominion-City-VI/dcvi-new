import { Main } from '@/components/layout/main';
import PhoneBookPrimaryButtons from './components/phonebookButtons';
import { useEffect, useState } from 'react';
import { useFetchUserPB } from '@/hooks/phonebook/useFetchUserPB';
import { useStore } from '@/store';
import { DataTable } from './components/DataTable';
import { columns } from './components/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { observer } from 'mobx-react-lite';

function PhoneBook() {
  const {
    AuthStore: { userExtraInfo }
  } = useStore();
  const [phonebook, setPhonebook] = useState<Array<TGetPhonebookResp>>([]);
  const { data, isLoading } = useFetchUserPB({
    UserId: userExtraInfo.id as string,
    Search: ''
  });

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setPhonebook(data);
    }
  }, [isLoading, data]);

  return (
    <>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Phone Book</h2>
            <p className="text-muted-foreground">Here's your Phone book history!</p>
          </div>
          <PhoneBookPrimaryButtons />
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
            <DataTable {...{ placeholder: 'Filter phonebook...', columns, data: phonebook }} />
          )}
        </div>
      </Main>
    </>
  );
}

export default observer(PhoneBook);
