import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useStyledToast } from '@/hooks/custom/useStyledToast';
import { delZone } from '@/requests/zone';
import { zone } from '@/hooks/zone/FetchKeyFactory';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DelZoneSchema, TDelZoneSchema } from '../validation';
import { Form, FormField } from '@/components/ui/form';
import { Loader } from 'lucide-react';
import TextareaField from '@/components/fields/TextareaField';
import { EnumZoneStatus } from '@/constants/mangle';

export default function DeleteZoneModal() {
  const toast = useStyledToast();
  const {
    AppConfigStore: { toggleModals, isOpen, deleteModal }
  } = useStore();

  const form = useForm({
    defaultValues: { ZoneStatus: EnumZoneStatus.IN_ACTIVE },
    mode: 'onSubmit',
    resolver: zodResolver(DelZoneSchema),
    reValidateMode: 'onChange'
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: delZone,
    onError: (error) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.data ||
        error?.response?.data ||
        error?.message ||
        'An error occurred';
        toast.error(backendMessage);;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === zone.getAllZones({}).keys()[0]
      });
      toast.success(data.data.message);
      toggleModals({});
    }
  });

  function onSubmit(params: TDelZoneSchema) {
    mutate({ id: deleteModal.resourceId, params });
  }

  return (
    <XModal isOpen={isOpen.DELETE_ZONE_MODAL} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Ready to delete zone?</DialogTitle>
          <DialogDescription>Your request to delete zone will be sent to admin.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="form-del-zone" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="flex w-full flex-col gap-2 overflow-y-scroll border border-white dark:border-none">
              <FormField
                control={form.control}
                name="DeletionReason"
                render={({ field }) => (
                  <TextareaField
                    label="Reason"
                    id="DeletionReason"
                    placeholder=""
                    required
                    {...field}
                  />
                )}
              />
            </fieldset>
          </form>
        </Form>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild disabled={isPending}>
            <Button type="button" variant="secondary">
              close
            </Button>
          </DialogClose>
          <Button type="submit" variant="destructive" form="form-del-zone" disabled={isPending}>
            {isPending && <Loader className="animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
