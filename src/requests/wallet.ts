import { WALLET } from '@/constants/api';
import { TWalletSchema } from '@/features/wallet/validation';
import dcviServer from '@/servers/dcvi';

// post requests
export const postWalletTopup = (arg: TWalletSchema) => {
  const payload = {
    amount: Number(arg.amount)
  };
  return dcviServer.post<IDCVIServerRes<string>>(WALLET.TOP_UP, payload);
};
