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
import { TNewCellSchema } from '../validation';
import InputField from '@/components/fields/InputField';
import { postCell } from '@/requests/cell';
import InputSelect from '@/components/fields/InputSelect';
import { cellTypeOptions } from '@/constants/data';
import { zone } from '@/hooks/zone/FetchKeyFactory';

const daysOfWeek = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' }
];

const virtualOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' }
];

export default function CreateCellModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, cellMemberModal }
  } = useStore();

  const form = useForm({
    defaultValues: { 
      zonalId: cellMemberModal.id,
      cellName: '',
      cellType: '',
      statusReason: '',
      isVirtual: false,
      holdingDayOfWeek: '',
      holdingTime: '',
      meetingLink: '',
      meetingAddress: ''
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  const isVirtual = form.watch('isVirtual');

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

  function onSubmit(data: any) {
    console.log('Form submitted with data:', data);
    
    // Validate required fields manually
    if (!data.cellName || !data.cellType || !data.statusReason) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!data.holdingDayOfWeek || !data.holdingTime) {
      toast.error('Please select holding day and time');
      return;
    }
    
    if (data.isVirtual && !data.meetingLink) {
      toast.error('Meeting link is required for virtual meetings');
      return;
    }
    
    if (!data.isVirtual && !data.meetingAddress) {
      toast.error('Meeting address is required for physical meetings');
      return;
    }
    
    // Combine holdingDayOfWeek and holdingTime into a Date object
    const [hours, minutes] = data.holdingTime.split(':');
    const combinedDate = new Date();
    
    // Set the day of week (0 = Sunday, 6 = Saturday)
    const dayMap: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6
    };
    const targetDay = dayMap[data.holdingDayOfWeek];
    const currentDay = combinedDate.getDay();
    const daysUntilTarget = (targetDay - currentDay + 7) % 7;
    
    combinedDate.setDate(combinedDate.getDate() + daysUntilTarget);
    combinedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Create payload matching backend schema
       const payload: TNewCellSchema = {
      zonalId: data.zonalId,
      cellName: data.cellName,
      cellType: data.cellType,
      statusReason: data.statusReason,
      holdingDayOfWeek: data.holdingDayOfWeek,
      holdingTime: data.holdingTime,
      holdingDay: combinedDate,
      isVirtual: data.isVirtual,
      meetingLink: data.isVirtual ? data.meetingLink : '',
      meetingAddress: !data.isVirtual ? data.meetingAddress : ''
    };
    
    console.log('Payload to be sent:', payload);
    mutate(payload);
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
            <fieldset className="flex w-full flex-col gap-2 overflow-y-scroll border border-white dark:border-none" disabled={isPending}>
              <FormField
                control={form.control}
                name="cellName"
                render={({ field }) => (
                  <InputField
                    label="Cell Name"
                    id="cellName"
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

              <FormField
                control={form.control}
                name="holdingDayOfWeek"
                render={({ field }) => (
                  <InputSelect
                    items={daysOfWeek}
                    onValueChange={field.onChange}
                    value={field.value}
                    label="Holding Day"
                    placeholder="Select a day..."
                    required
                    name={field.name}
                    ref={field.ref}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="holdingTime"
                render={({ field }) => (
                  <InputField
                    label="Holding Time"
                    id="holdingTime"
                    type="time"
                    placeholder=""
                    required
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="isVirtual"
                render={({ field }) => (
                  <InputSelect
                    items={virtualOptions}
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value?.toString()}
                    label="Is Virtual?"
                    placeholder="Select..."
                    required
                    name={field.name}
                    ref={field.ref}
                  />
                )}
              />

              {isVirtual === true && (
                <FormField
                  control={form.control}
                  name="meetingLink"
                  render={({ field }) => (
                    <InputField
                      label="Meeting Link"
                      id="meetingLink"
                      type="url"
                      placeholder="https://zoom.us/j/..."
                      required
                      {...field}
                    />
                  )}
                />
              )}

              {isVirtual === false && (
                <FormField
                  control={form.control}
                  name="meetingAddress"
                  render={({ field }) => (
                    <InputField
                      label="Meeting Address"
                      id="meetingAddress"
                      type="text"
                      placeholder="Enter physical address"
                      required
                      {...field}
                    />
                  )}
                />
              )}

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