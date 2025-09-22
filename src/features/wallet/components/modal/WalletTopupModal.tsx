import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { SMS } from '@/constants/api';
import { WalletSchema, TWalletSchema } from '../../validation';
import InputNumberField from '@/components/fields/NumberInput';
import { postWalletTopup } from '@/requests/wallet';

export default function SendSMSModal() {
  const {
    AppConfigStore: { toggleModals, isOpen }
  } = useStore();

  const queryClient = useQueryClient();
  const form = useForm<TWalletSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(WalletSchema),
    reValidateMode: 'onChange'
  });

  const { mutate, isPending } = useMutation({
    mutationFn: postWalletTopup,
    onError: () => {
      toast.error('Error Funding wallet!');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] == SMS.LOGS
      });
      toggleModals({});

      window.location.href = data.data.data;
    }
  });

  const onSubmit = (formData: TWalletSchema) => {
    mutate(formData);
  };

  return (
    <XModal isOpen={isOpen.FUND_WALLET_MODAL} closeModal={() => isPending || toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fund wallet</DialogTitle>
          <DialogDescription>You are about to fund your wallet account.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="broadcast-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isPending} className="flex flex-col space-y-1">
              <FormField
                control={form.control}
                name="amount"
                render={({ field: { onChange, ...rest } }) => (
                  <div>
                    <InputNumberField
                      label="Amount"
                      thousandSeparator=","
                      decimalSeparator="."
                      prefix="₦"
                      placeholder="₦10,000.00"
                      required
                      decimalScale={2}
                      allowNegative={false}
                      allowLeadingZeros={false}
                      valueIsNumericString={true}
                      onValueChange={(values) => {
                        onChange(values.floatValue || 0);
                      }}
                      {...rest}
                    />
                  </div>
                )}
              />
            </fieldset>
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose disabled={isPending} asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button disabled={isPending} type="submit" form="broadcast-form">
            {isPending && <Loader className="animate-spin" />}
            Fund
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
