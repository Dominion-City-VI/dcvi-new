import { useEffect, useState } from 'react';
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
import { SendSMSSchema, TSendSMSSchema } from '../../validation';
import { postSMS } from '@/requests/sms';
import TextareaField from '@/components/fields/TextareaField';
import { useFetchUserPB } from '@/hooks/phonebook/useFetchUserPB';
import InputCombo, { TComboInputData } from '@/components/fields/ComboBox';
import { useFetchPBContacts } from '@/hooks/phonebook/useFetchPBContacts';

export default function SendSMSModal() {
  const [phonebooks, setPhonebook] = useState<Array<TComboInputData>>([]);
  const {
    AuthStore: { userExtraInfo },
    AppConfigStore: { toggleModals, isOpen }
  } = useStore();

  const queryClient = useQueryClient();
  const form = useForm<TSendSMSSchema>({
    defaultValues: { userId: userExtraInfo?.id ?? '' },
    mode: 'onSubmit',
    resolver: zodResolver(SendSMSSchema),
    reValidateMode: 'onChange'
  });
  const { data, isLoading } = useFetchUserPB({ UserId: userExtraInfo?.id ?? '' });
  const { data: contacts, isLoading: isContactsLoading } = useFetchPBContacts(
    form.watch('phonebookId') ?? ''
  );

  const { mutate, isPending } = useMutation({
    mutationFn: postSMS,
    onError: () => {
      toast.error('Error sending broadcast!');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] == SMS.LOGS
      });
      toast.success(data.data.message);
      toggleModals({});
    }
  });

  const grandLoader = isPending || isLoading || isContactsLoading;

  const onSubmit = (formData: TSendSMSSchema) => {
    mutate(formData);
  };

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setPhonebook(data.map((datum) => ({ value: datum.id, label: datum.name })));
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (!isContactsLoading && contacts !== undefined) {
      const s = contacts.entries.map((entry) => entry.phoneNumber).join(', ');
      form.setValue('to', s);
    }
  }, [contacts, isContactsLoading]);

  return (
    <XModal isOpen={isOpen.SEND_SMS_MODAL} closeModal={() => grandLoader || toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send SMS</DialogTitle>
          <DialogDescription>You are about to send sms to your contacts.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="broadcast-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={grandLoader} className="flex flex-col space-y-1">
              <FormField
                control={form.control}
                name="phonebookId"
                render={() => (
                  <InputCombo
                    label="Phonebooks"
                    isLoading={isLoading}
                    data={phonebooks}
                    placeholder="Select phone book..."
                    empty="No phonebook found."
                    setValue={(arg: string) => form.setValue('phonebookId', arg)}
                    {...{ value: form.getValues('phonebookId') ?? '' }}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <TextareaField
                    label="Contacts"
                    placeholder="Edit your contacts here..."
                    defaultValue={field.value}
                    rows={30}
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="sms"
                render={({ field }) => (
                  <TextareaField
                    label="Message"
                    placeholder="type your message here..."
                    {...field}
                  />
                )}
              />
            </fieldset>
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose disabled={grandLoader} asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button disabled={grandLoader} type="submit" form="broadcast-form">
            {grandLoader && <Loader className="animate-spin" />}
            send message
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
