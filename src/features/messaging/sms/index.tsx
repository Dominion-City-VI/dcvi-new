import { useEffect, useState } from 'react';
import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { useFetchSMSLogs } from '@/hooks/sms/useFetchSMSLogs';
import { paginatedRes } from '@/constants/data';
import { Skeleton } from '@/components/ui/skeleton';
import { LogTable } from './components/LogTable';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { observer } from 'mobx-react-lite';

const SMS = () => {
  const {
    AuthStore: { userExtraInfo },
    AppConfigStore: { toggleModals },
    SMSStore: { transQuery }
  } = useStore();
  const [smsLogs, setSMSLogs] = useState<TDCVIPaginatedRes<TSMSLogItem>>({
    items: [],
    ...paginatedRes
  });
  const { data, isLoading } = useFetchSMSLogs({
    UserId: userExtraInfo.id as string,
    ...transQuery
  });

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setSMSLogs(data);
    }
  }, [isLoading, data]);

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SMS Logs</h2>
          <p className="text-muted-foreground">Here's your SMS log history!</p>
        </div>

        <Button onClick={() => toggleModals({ name: AppModals.SEND_SMS_MODAL, open: true })}>
          Broadcast
        </Button>
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
          <LogTable {...{ placeholder: '', data: smsLogs }} />
        )}
      </div>
    </Main>
  );
};

export default observer(SMS);
