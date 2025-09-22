import { DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { EllipsisIcon } from 'lucide-react';

const Processing = () => {
  return (
    <DialogHeader className="mx-auto flex w-full max-w-[430px] flex-col space-y-6">
      <div className="flex w-full items-center justify-center">
        <EllipsisIcon size={90} color="#E83289" className="animate-pulse" />
      </div>
      <div className="text-center">
        <DialogTitle className="font-grotesk mb-2 text-2xl font-bold tracking-tight lg:text-4xl">
          Processing Payment
        </DialogTitle>

        <DialogDescription>Hang on, we are confirming your payment on our end.</DialogDescription>
      </div>
    </DialogHeader>
  );
};

export default Processing;
