import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { Loader } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Form, FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewCellSchema, TNewCellSchema } from '../validation';
import InputField from '@/components/fields/InputField';
import { postCell } from '@/requests/cell';
import InputSelect from '@/components/fields/InputSelect';
import { cellTypeOptions } from '@/constants/data';
import { zone } from '@/hooks/zone/FetchKeyFactory';

export default function CreateCellModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, cellMemberModal }
  } = useStore();

  const form = useForm({
    defaultValues: { zonalId: cellMemberModal.id },
    mode: 'onSubmit',
    resolver: zodResolver(NewCellSchema),
    reValidateMode: 'onChange'
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postCell,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === zone.getZone({}).keys()[0]
      });
      toast.success(data.data.message);
      toggleModals({});
    }
  });

  function onSubmit(data: TNewCellSchema) {
    mutate(data);
  }

  return (
    <XModal isOpen={isOpen.CREATE_CELL} closeModal={() => isPending || toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Add new cell</DialogTitle>
          <DialogDescription>Add new cell by filling this form.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="form-add-zone" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="flex w-full flex-col gap-2 overflow-y-scroll border border-white dark:border-none">
              <FormField
                control={form.control}
                name="cellName"
                render={({ field }) => (
                  <InputField
                    label="Cell Name"
                    id="zoneName"
                    type="text"
                    placeholder=""
                    required
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="statusReason"
                render={({ field }) => (
                  <InputField
                    label="Status Reason"
                    id="statusReason"
                    type="text"
                    placeholder=""
                    required
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="cellType"
                render={({ field }) => (
                  <InputSelect
                    items={cellTypeOptions}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    label="Cell Type"
                    placeholder="Select a type..."
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
          <Button type="submit" form="form-add-zone" disabled={isPending}>
            {isPending && <Loader className="animate-spin" />}
            Add Cell
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
