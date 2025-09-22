import { Main } from '@/components/layout/main';
import { Skeleton } from '@/components/ui/skeleton';
import { observer } from 'mobx-react-lite';
import { useFetchZoneById } from '@/hooks/zone/useFetchZoneById';
import { Route } from '@/routes/_authenticated/admin/zones/$zoneId';
import { Route as zoneRoute } from '@/routes/_authenticated/admin/zones';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import ZoneDetails from './ZoneDetails';

const ZoneId = () => {
  const { zoneId } = Route.useParams();
  const { data, isLoading } = useFetchZoneById(zoneId);

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
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={zoneRoute.fullPath}>zones</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <h2 className="text-2xl font-bold tracking-tight">{data.name} zone</h2>
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ZoneDetails {...{ data }} />
          </>
        )
      )}
    </Main>
  );
};

export default observer(ZoneId);
