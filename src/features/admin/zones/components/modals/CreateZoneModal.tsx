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
import { NewZoneSchema, TNewZoneSchema } from '../validation';
import InputField from '@/components/fields/InputField';
import { postZone } from '@/requests/zone';
import { EnumZoneStatus } from '@/constants/mangle';
import { AxiosError } from 'axios';

export default function CreateZoneModal() {
  const {
    AppConfigStore: { toggleModals, isOpen }
  } = useStore();

  const form = useForm<TNewZoneSchema>({
    defaultValues: { 
      zonalName: '',  // Ensure default value is provided for zonalName
      zoneStatus: EnumZoneStatus.ACTIVE 
    },
    mode: 'onSubmit',
    resolver: zodResolver(NewZoneSchema),
    reValidateMode: 'onChange'
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postZone,
    onError: (error: AxiosError<any>) => {
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
        predicate: (query) => query.queryKey[0] === 'zones'
      });
      toast.success(data.data.message);
      toggleModals({});  // Close the modal on success
    }
  });

  // Handle form submission
  function onSubmit(data: TNewZoneSchema) {
    const payload = {
      zonalName: data.zonalName,  // Get the zonalName from the form data
      zoneStatus: data.zoneStatus  // Include ZoneStatus as well
    };
    mutate(payload);  // Pass the payload to the mutation function
  }

  return (
    <XModal isOpen={isOpen.CREATE_ZONE} closeModal={() => !isPending && toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Add New Zone</DialogTitle>
          <DialogDescription>Fill in the details below to add a new zone.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="form-add-zone" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="flex w-full flex-col gap-2 overflow-y-scroll">
              <FormField
                control={form.control}
                name="zonalName"  // Ensure the name is correctly mapped to zonalName
                render={({ field }) => (
                  <InputField
                    label="Zone Name"
                    id="zonalName"
                    type="text"
                    placeholder="Enter the zone name"
                    required
                    {...field}  // Spread the field properties to bind value correctly
                  />
                )}
              />
            </fieldset>
          </form>
        </Form>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild disabled={isPending}>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" form="form-add-zone" disabled={isPending}>
            {isPending && <Loader className="animate-spin" />}
            Add Zone
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
