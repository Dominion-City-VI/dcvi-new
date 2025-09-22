import { Title, Paragraph } from '@/components/typographys';
import { Route } from '@/routes/_authenticated/wallet/index';
import { useQueryClient } from '@tanstack/react-query';
import { WALLET } from '@/constants/api';
import { useNavigate } from '@tanstack/react-router';
import { CircleXIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Failed = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <div className="mx-auto flex w-[90svw] max-w-[300px] flex-col space-y-6">
      <div className="flex w-full items-center justify-center">
        <CircleXIcon size={100} className="text-red-500" />
      </div>
      <div className="">
        <Title className="!md:text-2xl text-center font-medium">Funding failed!</Title>

        <Paragraph className="text-center">Your wallet Funding was unsuccessful.</Paragraph>
      </div>

      <Button
        onClick={() => {
          queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] == WALLET.LOGS });
          navigate({ to: Route.fullPath, replace: true });
        }}
      >
        Got it
      </Button>
    </div>
  );
};

export default Failed;
