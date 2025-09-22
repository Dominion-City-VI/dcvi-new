import { DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import InputField from '@/components/fields/InputField';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { ADMIN } from '@/constants/api';
import { observer } from 'mobx-react-lite';
import { EnumAccessRequest } from '@/constants/mangle';

export const AccessRequestSchema = z.object({
  requestStatus: z.number({ required_error: 'request status is required.' }),
  id: z.string(),
  comment: z.string({ required_error: 'Provide a comment.' })
});

export type TAccessRequestSchema = z.infer<typeof AccessRequestSchema>;

function AccessModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, accessRequestModal },
    AdminStore: { approveRejectAccess, isLoading }
  } = useStore();

  const queryClient = useQueryClient();

  const form = useForm<TAccessRequestSchema>({
    defaultValues: { id: accessRequestModal.id, requestStatus: accessRequestModal.requestStatus },
    mode: 'onSubmit',
    resolver: zodResolver(AccessRequestSchema),
    reValidateMode: 'onChange'
  });

  const onSubmit = (data: TAccessRequestSchema) => {
    const cb = () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === ADMIN.GET_ANALYTICS
      });
      toggleModals();
    };

    approveRejectAccess(data, cb);
  };

  return (
    <XModal isOpen={isOpen.ACCESS_REQUEST_MODAL} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>
            {accessRequestModal.requestStatus === EnumAccessRequest.APPROVE && 'Approve'}
            {accessRequestModal.requestStatus === EnumAccessRequest.REJECT && 'Reject'}
            &nbsp; Access
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form id="attendance-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isLoading.updateRole} className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-1">
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Comment"
                      placeholder="Give a short comment..."
                      defaultValue={field.value}
                    />
                  )}
                />
              </div>
            </fieldset>
          </form>
        </Form>

        <DialogFooter className="sm:justify-end">
          <DialogClose disabled={isLoading.approveRejectAccess} asChild>
            <Button disabled={isLoading.approveRejectAccess} type="button" variant="secondary">
              close
            </Button>
          </DialogClose>
          {accessRequestModal.requestStatus === EnumAccessRequest.APPROVE && (
            <Button disabled={isLoading.approveRejectAccess} form="attendance-form" type="submit">
              {isLoading.approveRejectAccess && <Loader className="animate-spin" />}
              Approve
            </Button>
          )}
          {accessRequestModal.requestStatus === EnumAccessRequest.REJECT && (
            <Button
              disabled={isLoading.approveRejectAccess}
              form="attendance-form"
              type="submit"
              variant="destructive"
            >
              {isLoading.approveRejectAccess && <Loader className="animate-spin" />}
              Reject
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}

export default observer(AccessModal);
