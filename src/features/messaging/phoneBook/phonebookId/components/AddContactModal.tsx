import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { z } from 'zod';
import InputField from '@/components/fields/InputField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postAddContact } from '@/requests/phonebook';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { numberRegex } from '@/utils';
import { PHONEBOOK } from '@/constants/api';
import { phoneNumber } from '@/features/auth/validation';

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name is required.' })
    .refine((value) => numberRegex.test(value) === false, 'Numbers not allowed.'),
  phoneNumber
});

type TFormSchema = z.infer<typeof formSchema>;

export default function AddContactModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, addContactModal }
  } = useStore();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postAddContact,
    onError: () => {
      toast.error('Error adding contact Phonebook!');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] == PHONEBOOK.GET_USER_PHONEBOOK
      });
      toast.success(data.data.message);
      toggleModals({});
    }
  });

  const form = useForm<TFormSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    reValidateMode: 'onChange'
  });

  const nameRef = form.register('name');
  const phoneRef = form.register('phoneNumber');

  const onSubmit = (formData: TFormSchema) => {
    const { name, phoneNumber } = formData;

    mutate({ id: addContactModal.id, payload: { name, phoneNumber } });
  };

  return (
    <XModal isOpen={isOpen.ADD_CONTACT_MODAL} closeModal={() => isPending || toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add contact</DialogTitle>
          <DialogDescription>You are about to add contact to phonebook</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="pb-import-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isPending} className="flex flex-col space-y-1">
              <FormField
                control={form.control}
                name="name"
                render={() => (
                  <InputField
                    type="text"
                    label="Name"
                    placeholder="Ifeanyi Nwakuche"
                    {...nameRef}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={() => (
                  <InputField
                    type="text"
                    label="Phone Number"
                    placeholder="08123456789"
                    {...phoneRef}
                  />
                )}
              />
            </fieldset>
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose disabled={isPending} asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button disabled={isPending} type="submit" form="pb-import-form">
            {isPending && <Loader className="animate-spin" />}
            Add Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
