import { Main } from '@/components/layout/main';
import { useStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { observer } from 'mobx-react-lite';
import { useFetchZoneById } from '@/hooks/zone/useFetchZoneById';
import ZoneDetails from '@/features/admin/zones/zoneDetails/ZoneDetails';

const ZoneId = () => {
  const {
    AuthStore: { userExtraInfo }
  } = useStore();
  const { data, isLoading } = useFetchZoneById(userExtraInfo.zonalId as string);

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
              <h2 className="text-2xl font-bold tracking-tight">{data.name} zone</h2>
            </div>
            <ZoneDetails {...{ data }} />
          </>
        )
      )}
    </Main>
  );
};

export default observer(ZoneId);
