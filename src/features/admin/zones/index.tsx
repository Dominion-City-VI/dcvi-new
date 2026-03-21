import { Main } from '@/components/layout/main';
import { Skeleton } from '@/components/ui/skeleton';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { useFetchAllZones } from '@/hooks/zone/useFetchAllZones';
import ZonesTable from './components/ZonesTable';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';

const Zones = () => {
  const {
    AppConfigStore: { toggleModals },
    ZoneStore: { zoneQuery }
  } = useStore();
  const { data, isLoading, status } = useFetchAllZones(zoneQuery);

  return (
    <Main>
      <div className="mb-2 flex w-full justify-between">
        <h2 className="text-2xl font-bold tracking-tight">All zones</h2>
      </div>
      {isLoading ? (
        <div className="mb-2 flex w-full flex-wrap items-center justify-between space-y-4">
          <div className="mb-2 flex w-full flex-wrap items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-[50svh] w-full" />
        </div>
      ) : status === 'error' ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 text-muted-foreground">
          <p className="text-sm">Could not load zones. The server may be starting up — please try again shortly.</p>
        </div>
      ) : data ? (
        <div className="flex flex-col justify-between space-y-3">
          <div className="flex w-full justify-end">
            <Button
              onClick={() => toggleModals({ name: AppModals.CREATE_ZONE, open: true })}
              className="space-x-1"
            >
              <span>Create new zone</span> <IconPlus size={18} />
            </Button>
          </div>
          <ZonesTable {...{ placeholder: 'search zones...', data }} />
        </div>
      ) : null}
    </Main>
  );
};

export default observer(Zones);
