// import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
// import { XModal } from '@/components/modals';
// import { useStore } from '@/store';
// import { Loader } from 'lucide-react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { Form, FormField } from '@/components/ui/form';
// import { useForm } from 'react-hook-form';
// import { TNewCellSchema } from '../validation';
// import InputField from '@/components/fields/InputField';
// import { postCell } from '@/requests/cell';
// import InputSelect from '@/components/fields/InputSelect';
// import { cellTypeOptions } from '@/constants/data';
// import { zone } from '@/hooks/zone/FetchKeyFactory';

// const daysOfWeek = [
//   { value: 'sunday', label: 'Sunday' },
//   { value: 'monday', label: 'Monday' },
//   { value: 'tuesday', label: 'Tuesday' },
//   { value: 'wednesday', label: 'Wednesday' },
//   { value: 'thursday', label: 'Thursday' },
//   { value: 'friday', label: 'Friday' },
//   { value: 'saturday', label: 'Saturday' }
// ];

// const virtualOptions = [
//   { value: 'true', label: 'Yes' },
//   { value: 'false', label: 'No' }
// ];

// export default function CreateCellModal() {
//   const {
//     AppConfigStore: { toggleModals, isOpen, cellMemberModal }
//   } = useStore();

//   const form = useForm({
//     defaultValues: { 
//       zonalId: cellMemberModal.id,
//       cellName: '',
//       cellType: '',
//       statusReason: '',
//       isVirtual: false,
//       holdingDayOfWeek: '',
//       holdingTime: '',
//       meetingLink: '',
//       meetingAddress: ''
//     },
//     mode: 'onSubmit',
//     reValidateMode: 'onChange'
//   });

//   const isVirtual = form.watch('isVirtual');

//   const queryClient = useQueryClient();

//   const { mutate, isPending } = useMutation({
//     mutationFn: postCell,
//     onError: (error: AxiosError<any>) => {
//       const backendMessage =
        // error?.response?.data?.message ||
        // error?.response?.data?.data ||
        // error?.response?.data ||
        // error?.message ||
        // 'An error occurred';
        // toast.error(backendMessage);;
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey[0] === zone.getZone({}).keys()[0]
//       });
//       toast.success(data.data.message);
//       toggleModals({});
//     }
//   });

//   function onSubmit(data: any) {
//     console.log('Form submitted with data:', data);
    
//     // Validate required fields manually
//     if (!data.cellName || !data.cellType || !data.statusReason) {
//       toast.error('Please fill in all required fields');
//       return;
//     }
    
//     if (!data.holdingDayOfWeek || !data.holdingTime) {
//       toast.error('Please select holding day and time');
//       return;
//     }
    
//     if (data.isVirtual && !data.meetingLink) {
//       toast.error('Meeting link is required for virtual meetings');
//       return;
//     }
    
//     if (!data.isVirtual && !data.meetingAddress) {
//       toast.error('Meeting address is required for physical meetings');
//       return;
//     }
    
//     // Combine holdingDayOfWeek and holdingTime into a Date object
//     const [hours, minutes] = data.holdingTime.split(':');
//     const combinedDate = new Date();
    
//     // Set the day of week (0 = Sunday, 6 = Saturday)
//     const dayMap: Record<string, number> = {
//       sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
//       thursday: 4, friday: 5, saturday: 6
//     };
//     const targetDay = dayMap[data.holdingDayOfWeek];
//     const currentDay = combinedDate.getDay();
//     const daysUntilTarget = (targetDay - currentDay + 7) % 7;
    
//     combinedDate.setDate(combinedDate.getDate() + daysUntilTarget);
//     combinedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
//     // Create payload matching backend schema
//        const payload: TNewCellSchema = {
//       zonalId: data.zonalId,
//       cellName: data.cellName,
//       cellType: data.cellType,
//       statusReason: data.statusReason,
//       holdingDayOfWeek: data.holdingDayOfWeek,
//       holdingTime: data.holdingTime,
//       holdingDay: combinedDate,
//       isVirtual: data.isVirtual,
//       meetingLink: data.isVirtual ? data.meetingLink : '',
//       meetingAddress: !data.isVirtual ? data.meetingAddress : ''
//     };
    
//     console.log('Payload to be sent:', payload);
//     mutate(payload);
//   }

//   return (
//     <XModal isOpen={isOpen.CREATE_CELL} closeModal={() => isPending || toggleModals({})}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader className="mb-6">
//           <DialogTitle>Add new cell</DialogTitle>
//           <DialogDescription>Add new cell by filling this form.</DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form id="form-add-zone" onSubmit={form.handleSubmit(onSubmit)}>
//             <fieldset className="flex w-full flex-col gap-2 overflow-y-scroll border border-white dark:border-none" disabled={isPending}>
//               <FormField
//                 control={form.control}
//                 name="cellName"
//                 render={({ field }) => (
//                   <InputField
//                     label="Cell Name"
//                     id="cellName"
//                     type="text"
//                     placeholder=""
//                     required
//                     {...field}
//                   />
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="statusReason"
//                 render={({ field }) => (
//                   <InputField
//                     label="Cell Description"
//                     id="statusReason"
//                     type="text"
//                     placeholder="Cell focuses on Professionals who are Managers at workplace"
//                     required
//                     {...field}
//                   />
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="cellType"
//                 render={({ field }) => (
//                   <InputSelect
//                     items={cellTypeOptions}
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                     label="Cell Type"
//                     placeholder="Select a type..."
//                     required
//                     {...field}
//                   />
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="holdingDayOfWeek"
//                 render={({ field }) => (
//                   <InputSelect
//                     items={daysOfWeek}
//                     onValueChange={field.onChange}
//                     value={field.value}
//                     label="Holding Day"
//                     placeholder="Select a day..."
//                     required
//                     name={field.name}
//                     ref={field.ref}
//                   />
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="holdingTime"
//                 render={({ field }) => (
//                   <InputField
//                     label="Holding Time"
//                     id="holdingTime"
//                     type="time"
//                     placeholder=""
//                     required
//                     {...field}
//                   />
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="isVirtual"
//                 render={({ field }) => (
//                   <InputSelect
//                     items={virtualOptions}
//                     onValueChange={(value) => field.onChange(value === 'true')}
//                     value={field.value?.toString()}
//                     label="Is Virtual?"
//                     placeholder="Select..."
//                     required
//                     name={field.name}
//                     ref={field.ref}
//                   />
//                 )}
//               />

//               {isVirtual === true && (
//                 <FormField
//                   control={form.control}
//                   name="meetingLink"
//                   render={({ field }) => (
//                     <InputField
//                       label="Meeting Link"
//                       id="meetingLink"
//                       type="url"
//                       placeholder="https://zoom.us/j/..."
//                       required
//                       {...field}
//                     />
//                   )}
//                 />
//               )}

//               {isVirtual === false && (
//                 <FormField
//                   control={form.control}
//                   name="meetingAddress"
//                   render={({ field }) => (
//                     <InputField
//                       label="Meeting Address"
//                       id="meetingAddress"
//                       type="text"
//                       placeholder="Enter physical address"
//                       required
//                       {...field}
//                     />
//                   )}
//                 />
//               )}

//             </fieldset>
//           </form>
//         </Form>

//         <DialogFooter className="sm:justify-end">
//           <DialogClose asChild disabled={isPending}>
//             <Button type="button" variant="secondary">
//               close
//             </Button>
//           </DialogClose>
//           <Button type="submit" form="form-add-zone" disabled={isPending}>
//             {isPending && <Loader className="animate-spin" />}
//             Add Cell
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </XModal>
//   );
// }


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
import { AxiosError } from 'axios';

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
  { value: 'true', label: 'Yes (Virtual)' },
  { value: 'false', label: 'No (Physical)' },
  { value: 'hybrid', label: 'Hybrid' }
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
      isHybrid: false,
      holdingDayOfWeek: '',
      holdingTime: '',
      meetingLink: '',
      meetingAddress: ''
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  const isVirtual = form.watch('isVirtual');
  const isHybrid = form.watch('isHybrid');

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postCell,
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
        predicate: (query) => query.queryKey[0] === zone.getZone({}).keys()[0]
      });
      toast.success(data.data.message);
      form.reset();
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
    
    // Validation for hybrid: both fields required
    if (data.isHybrid) {
      if (!data.meetingLink || !data.meetingAddress) {
        toast.error('Both meeting link and address are required for hybrid meetings');
        return;
      }
    } else {
      // Validation for virtual/physical
      if (data.isVirtual && !data.meetingLink) {
        toast.error('Meeting link is required for virtual meetings');
        return;
      }
      
      if (!data.isVirtual && !data.meetingAddress) {
        toast.error('Meeting address is required for physical meetings');
        return;
      }
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
      isVirtual: data.isHybrid ? false : data.isVirtual, // Set to false for hybrid
      meetingLink: (data.isVirtual || data.isHybrid) ? data.meetingLink : '',
      meetingAddress: (!data.isVirtual || data.isHybrid) ? data.meetingAddress : ''
    };
    
    console.log('Payload to be sent:', payload);
    mutate(payload);
  }

  return (
    <XModal isOpen={isOpen.CREATE_CELL} closeModal={() => !isPending && toggleModals({})}>
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
                    label="Name"
                    id="cellName"
                    type="text"
                    placeholder="Peace"
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
                    label="Description"
                    id="statusReason"
                    type="text"
                    placeholder="Give a short description of what happens in this cell"
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
                    label="Type"
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
                    onValueChange={(value) => {
                      if (value === 'hybrid') {
                        field.onChange(false); // Set isVirtual to false
                        form.setValue('isHybrid', true);
                      } else {
                        field.onChange(value === 'true');
                        form.setValue('isHybrid', false);
                      }
                    }}
                    value={
                      isHybrid 
                        ? 'hybrid' 
                        : field.value?.toString()
                    }
                    label="Meeting Type"
                    placeholder="Select..."
                    required
                    name={field.name}
                    ref={field.ref}
                  />
                )}
              />

              {/* Show Meeting Link for Virtual or Hybrid */}
              {(isVirtual === true || isHybrid === true) && (
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

              {/* Show Meeting Address for Physical or Hybrid */}
              {(isVirtual === false || isHybrid === true) && (
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
              Close
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