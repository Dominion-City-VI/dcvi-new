import { useEffect, useState } from 'react';
import Processing from './components/Processing';
import Success from './components/Success';
import Failed from './components/Failed';
import { XModal } from '@/components/modals';
import { observer } from 'mobx-react-lite';
import { Route } from '@/routes/_authenticated/wallet/funding';
import { useFetchVerifyFunding } from '@/hooks/wallet/useFetchVerifyFunding';
import { DialogContent } from '@/components/ui/dialog';

const Funding = () => {
  const { trxref, reference } = Route.useSearch();
  const [paymentStatus, setPaymentStatus] = useState<TPaystackStatus>(0);

  const switchStatusView = () => {
    switch (paymentStatus) {
      case 0:
        return <Processing />;
      case 1:
        return <Success />;
      default:
        return <Failed />;
    }
  };

  const { data, isLoading } = useFetchVerifyFunding({ trxref, reference });

  useEffect(() => {
    if (!isLoading) {
      if (data !== undefined) {
        setPaymentStatus(data.status);
      }
    }
  }, [data, isLoading]);

  return (
    <XModal isOpen={true} closeModal={() => {}}>
      <DialogContent className="h-screen min-w-full">
        {trxref && reference ? switchStatusView() : <>Broken Link</>}
      </DialogContent>
    </XModal>
  );
};

export default observer(Funding);
