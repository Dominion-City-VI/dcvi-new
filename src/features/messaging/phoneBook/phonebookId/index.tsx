import { Main } from '@/components/layout/main';
import { useFetchPBContacts } from '@/hooks/phonebook/useFetchPBContacts';
import { Route } from '@/routes/_authenticated/messaging/phone-book/$phonebookId';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Route as PhonebookRoute } from '@/routes/_authenticated/messaging/phone-book/index';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '../components/DataTable';
import { columns } from './components/columns';
import PBContactPrimaryButtons from './components/ContactButtons';
import { observer } from 'mobx-react-lite';

const PhonebookId = () => {
  const { phonebookId } = Route.useParams();
  const { data, isLoading } = useFetchPBContacts(phonebookId);

  return (
    <Main>
      {isLoading ? (
        <div className="mb-2 flex w-full flex-wrap items-center justify-between space-y-4">
          <div className="mb-2 flex w-full flex-wrap items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>

          <Skeleton className="h-[50svh] w-full" />
        </div>
      ) : (
        data && (
          <>
            <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
              <div>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={PhonebookRoute.fullPath}>Phone book</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        <h2 className="text-2xl font-bold tracking-tight">{data.name}</h2>
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <p className="text-muted-foreground">Here's your Contact history!</p>
              </div>
              <PBContactPrimaryButtons {...{ book: data.name, id: data.entries[0].phoneBookId }} />
            </div>

            <DataTable {...{ columns, placeholder: 'Filter contacts...', data: data.entries }} />
          </>
        )
      )}
    </Main>
  );
};

export default observer(PhonebookId);
