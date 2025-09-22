import { useState, useEffect } from 'react';
import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchTransLogs } from '@/hooks/wallet/useFetchTransLogs';
import { useStore } from '@/store';
import { TransLogTable } from './components/TransLogTable';
import { paginatedRes } from '@/constants/data';
import { observer } from 'mobx-react-lite';
import { AppModals } from '@/store/AppConfig/appModalTypes';

const Wallet = () => {
  const {
    AppConfigStore: { toggleModals },
    WalletStore: { transQuery }
  } = useStore();
  const [transLogs, setTransLogs] = useState<TTransactionLogRes>({
    transactions: {
      items: [],
      ...paginatedRes
    },
    wallet: {
      id: '',
      createdAt: '',
      updatedAt: '',
      balance: 0,
      userId: ''
    }
  });
  const { data, isLoading } = useFetchTransLogs(transQuery);

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setTransLogs(data);
    }
  }, [isLoading, data]);
  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transaction Logs</h2>
          <p className="text-muted-foreground">Here's your transaction log history!</p>
        </div>

        <Button onClick={() => toggleModals({ name: AppModals.FUND_WALLET_MODAL, open: true })}>
          Fund wallet
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
          <TransLogTable {...{ placeholder: 'filter transactions...', data: transLogs }} />
        )}
      </div>
    </Main>
  );
};

export default observer(Wallet);
