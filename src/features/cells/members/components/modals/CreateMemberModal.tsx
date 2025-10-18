// import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
// import { XModal } from '@/components/modals';
// import { useStore } from '@/store';
// import { Loader } from 'lucide-react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { postCellMember } from '@/requests/cell';
// import { toast } from 'sonner';
// import InputMultiSelect from '@/components/fields/InputMultiSelect';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form';
// import InputSelect from '@/components/fields/InputSelect';
// import { gender, maritalStatus } from '@/constants/data';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { OnboardMemberSchema, TOnboardMemberSchema } from '../../validation';
// import InputField from '@/components/fields/InputField';
// import { useEffect, useState } from 'react';
// import { useFetchTrainings } from '@/hooks/settings/useFetchTrainings';
// import { useFetchDepartments } from '@/hooks/settings/useFetchDepartments';
// import { trnformToOptions } from '@/utils';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { CELL } from '@/constants/api';

// export default function CreateMemberModal() {
//   const {
//     AuthStore: { userExtraInfo },
//     AppConfigStore: { toggleModals, isOpen}
//   } = useStore();
//   const [trngs, setTrngs] = useState<Array<Option>>([]);
//   const [depts, setDepts] = useState<Array<Option>>([]);

//   const { data: trngData, status: trngStatus, isLoading: isTrngLoading } = useFetchTrainings();
//   const { data: deptData, status: deptStatus, isLoading: isDeptLoading } = useFetchDepartments();

//   const form = useForm({
//     mode: 'onSubmit',
//     defaultValues: {
//       zoneId: userExtraInfo.zonalId,
//       cellId: userExtraInfo.cellId,
//       firstName: '',
//       lastName: '',
//       emailAddress: '',
//       phoneNumber: '',
//       address: '',
//       occupation: '',
//       isAssistantCellLeader: false,
//       isConsideredLeader: false,
//       isDcMember: false,
//       trainings: [],
//       departments: [],
//       maritalStatus: '',
//       gender: '',
//     },
//     resolver: zodResolver(OnboardMemberSchema),
//     reValidateMode: 'onChange'
//   });

//   const queryClient = useQueryClient();

//   const { mutate, isPending } = useMutation({
//     mutationFn: postCellMember,
//     onError: (error) => {
//       toast.error(error.message);
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey[0] === CELL.GET
//       });
//       toast.success(data.data.message);
//       toggleModals({});
//     }
//   });

//   function onSubmit(data: TOnboardMemberSchema) {
//     mutate(data);
//   }

//   useEffect(() => {
//     if (trngStatus == 'success' && trngData !== undefined) {
//       setTrngs(trnformToOptions(trngData));
//     }
//   }, [trngData, trngStatus]);

//   useEffect(() => {
//     if (deptStatus == 'success' && deptData !== undefined) {
//       setDepts(trnformToOptions(deptData));
//     }
//   }, [deptData, deptStatus]);

//   return (
//     <XModal isOpen={isOpen.CREATE_MEMBER_MODAL} closeModal={() => isPending || toggleModals({})}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader className="mb-6">
//           <DialogTitle>Add new member</DialogTitle>
//           <DialogDescription>Onboard new members by filling this form.</DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form id="form-add-member" onSubmit={form.handleSubmit(onSubmit)}>
//             <fieldset
//               disabled={isPending}
//               className="flex h-96 w-full flex-col gap-2 overflow-y-scroll"
//             >
//               <div className="flex w-full flex-col items-start space-y-2 space-x-2 md:flex-row md:justify-between md:space-y-0">
//                 <FormField
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <InputField
//                       label="First Name"
//                       id="fName"
//                       type="text"
//                       placeholder="Ifeanyi"
//                       required
//                       {...field}
//                     />
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="lastName"
//                   render={({ field }) => (
//                     <InputField
//                       label="Last Name"
//                       id="lName"
//                       type="text"
//                       placeholder="Nwakuche"
//                       required
//                       {...field}
//                     />
//                   )}
//                 />
//               </div>
//               <FormField
//                 control={form.control}
//                 name="emailAddress"
//                 render={({ field }) => (
//                   <InputField
//                     label="Email"
//                     id="email"
//                     type="email"
//                     placeholder="ifeanyi.nwakuche@gmail.com"
//                     required
//                     {...field}
//                   />
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="phoneNumber"
//                 render={({ field }) => (
//                   <InputField
//                     label="Phone Number"
//                     id="pNo"
//                     type="text"
//                     placeholder="08123456789"
//                     required
//                     {...field}
//                   />
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="address"
//                 render={({ field }) => (
//                   <InputField
//                     label="Address"
//                     id="address"
//                     type="text"
//                     placeholder="No 234 Block B1 Alausa way, Lagos."
//                     required
//                     {...field}
//                   />
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="occupation"
//                 render={({ field }) => (
//                   <InputField
//                     label="Occupation"
//                     id="occupation"
//                     type="text"
//                     placeholder="Doctor"
//                     required
//                     {...field}
//                   />
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="occupation"
//                 render={({ field }) => (
//                   <InputField
//                     label="Occupation"
//                     id="occupation"
//                     type="text"
//                     placeholder="Doctor"
//                     required
//                     {...field}
//                   />
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="isAssistantCellLeader"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Is Assistant Cell Leader?</FormLabel>
//                     <FormControl>
//                       <RadioGroup
//                         onValueChange={(value) => {
//                           form.setValue('isAssistantCellLeader', value === 'yes', {
//                             shouldValidate: true,
//                             shouldDirty: true
//                           });
//                         }}
//                         value={field.value ? 'yes' : 'no'}
//                         className="flex space-x-4"
//                       >
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem id="assistant-yes" value="yes" />
//                           <FormLabel htmlFor="assistant-yes" className="font-normal cursor-pointer">
//                             Yes
//                           </FormLabel>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem id="assistant-no" value="no" />
//                           <FormLabel htmlFor="assistant-no" className="font-normal cursor-pointer">
//                             No
//                           </FormLabel>
//                         </div>
//                       </RadioGroup>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="isConsideredLeader"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Is Considered Leader?</FormLabel>
//                     <FormControl>
//                       <RadioGroup
//                         onValueChange={(value) => {
//                           form.setValue('isConsideredLeader', value === 'yes', {
//                             shouldValidate: true,
//                             shouldDirty: true
//                           });
//                         }}
//                         value={field.value ? 'yes' : 'no'}
//                         className="flex space-x-4"
//                       >
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem id="leader-yes" value="yes" />
//                           <FormLabel htmlFor="leader-yes" className="font-normal cursor-pointer">
//                             Yes
//                           </FormLabel>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem id="leader-no" value="no" />
//                           <FormLabel htmlFor="leader-no" className="font-normal cursor-pointer">
//                             No
//                           </FormLabel>
//                         </div>
//                       </RadioGroup>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="isDcMember"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//                     <div className="space-y-0.5">
//                       <FormLabel className="text-base">DC Member</FormLabel>
//                       <FormDescription>
//                         Is this person a Church Member?
//                       </FormDescription>
//                     </div>
//                     <FormControl>
//                       <input
//                         type="checkbox"
//                         checked={field.value ?? false}
//                         onChange={(e) => {
//                           field.onChange(e.target.checked);
//                         }}
//                         className="h-4 w-4 cursor-pointer"
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="trainings"
//                 render={({ field }) => (
//                   <InputMultiSelect
//                     {...field}
//                     label={'Trainings'}
//                     isLoading={isTrngLoading}
//                     options={trngs}
//                     placeholder="Select trainings you like..."
//                     emptyIndicator={
//                       <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
//                         No Training available.
//                       </p>
//                     }
//                   />
//                 )}
//               />
//               <div className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-y-0 md:space-x-2">
//                 <FormField
//                   control={form.control}
//                   name="maritalStatus"
//                   render={({ field }) => (
//                     <InputSelect
//                       items={maritalStatus}
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       label="Marital Status"
//                       placeholder="Select a status..."
//                       required
//                       {...field}
//                     />
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="gender"
//                   render={({ field }) => (
//                     <InputSelect
//                       items={gender}
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       label="Gender"
//                       placeholder="Select a gender..."
//                       {...field}
//                     />
//                   )}
//                 />
//               </div>
//               <FormField
//                 control={form.control}
//                 name="departments"
//                 render={({ field }) => (
//                   <InputMultiSelect
//                     {...field}
//                     label={'Departments'}
//                     isLoading={isDeptLoading}
//                     options={depts}
//                     placeholder="Select department you like..."
//                     emptyIndicator={
//                       <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
//                         No department available.
//                       </p>
//                     }
//                   />
//                 )}
//               />
//             </fieldset>
//           </form>
//         </Form>

//         <DialogFooter className="sm:justify-end">
//           <DialogClose asChild disabled={isPending}>
//             <Button type="button" variant="secondary">
//               close
//             </Button>
//           </DialogClose>
//           <Button type="submit" form="form-add-member" disabled={isPending}>
//             {isPending && <Loader className="animate-spin" />}
//             Add Member
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
import { postCellMember } from '@/requests/cell';
import { toast } from 'sonner';
import InputMultiSelect from '@/components/fields/InputMultiSelect';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import InputSelect from '@/components/fields/InputSelect';
import { gender, maritalStatus } from '@/constants/data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OnboardMemberSchema, TOnboardMemberSchema } from '../../validation';
import InputField from '@/components/fields/InputField';
import { useEffect, useState } from 'react';
import { useFetchTrainings } from '@/hooks/settings/useFetchTrainings';
import { useFetchDepartments } from '@/hooks/settings/useFetchDepartments';
import { trnformToOptions } from '@/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CELL } from '@/constants/api';

export default function CreateMemberModal() {
  const {
    AuthStore: { userExtraInfo },
    AppConfigStore: { toggleModals, isOpen }
  } = useStore();
  const [trngs, setTrngs] = useState<Array<Option>>([]);
  const [depts, setDepts] = useState<Array<Option>>([]);

  const { data: trngData, status: trngStatus, isLoading: isTrngLoading } = useFetchTrainings();
  const { data: deptData, status: deptStatus, isLoading: isDeptLoading } = useFetchDepartments();

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      zoneId: userExtraInfo.zonalId || '',
      cellId: userExtraInfo.cellId || '',
      firstName: '',
      lastName: '',
      emailAddress: '',
      phoneNumber: '',
      address: '',
      occupation: '',
      isAssistantCellLeader: false,
      isConsideredLeader: false,
      isDcMember: false,
      trainings: [] as Array<{ value: string; label: string; disable?: boolean }>,
      departments: [] as Array<{ value: string; label: string; disable?: boolean }>,
      maritalStatus: '',
      gender: ''
    },
    resolver: zodResolver(OnboardMemberSchema),
    reValidateMode: 'onChange'
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postCellMember,
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === CELL.GET
      });
      toast.success(data.data.message);
      form.reset();
      toggleModals({});
    }
  });

  function onSubmit(data: TOnboardMemberSchema) {
    const submitData = {
      ...data,
      isAssistantCellLeader: data.isAssistantCellLeader ?? false,
      isConsideredLeader: data.isConsideredLeader ?? false,
      isDcMember: data.isDcMember ?? false
    };
    
    mutate(submitData as TOnboardMemberSchema);
  }

  useEffect(() => {
    if (trngStatus == 'success' && trngData !== undefined) {
      setTrngs(trnformToOptions(trngData));
    }
  }, [trngData, trngStatus]);

  useEffect(() => {
    if (deptStatus == 'success' && deptData !== undefined) {
      setDepts(trnformToOptions(deptData));
    }
  }, [deptData, deptStatus]);

  return (
    <XModal isOpen={isOpen.CREATE_MEMBER_MODAL} closeModal={() => !isPending && toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Add new member</DialogTitle>
          <DialogDescription>Onboard new members by filling this form.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="form-add-member" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset
              disabled={isPending}
              className="flex h-96 w-full flex-col gap-2 overflow-y-scroll"
            >
              <div className="flex w-full flex-col items-start space-y-2 space-x-2 md:flex-row md:justify-between md:space-y-0">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <InputField
                      label="First Name"
                      id="fName"
                      type="text"
                      placeholder="Ifeanyi"
                      required
                      {...field}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <InputField
                      label="Last Name"
                      id="lName"
                      type="text"
                      placeholder="Nwakuche"
                      required
                      {...field}
                    />
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <InputField
                    label="Email (Optional)"
                    id="email"
                    type="email"
                    placeholder="ifeanyi.nwakuche@gmail.com"
                    
                    {...field}
                  />
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <InputField
                    label="Phone Number"
                    id="pNo"
                    type="text"
                    placeholder="08123456789"
                    required
                    {...field}
                  />
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <InputField
                    label="Address"
                    id="address"
                    type="text"
                    placeholder="No 234 Block B1 Alausa way, Lagos."
                    required
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <InputField
                    label="Occupation"
                    id="occupation"
                    type="text"
                    placeholder="Doctor"
                    required
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="isAssistantCellLeader"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is Assistant Cell Leader?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          const boolValue = value === 'yes';
                          field.onChange(boolValue);
                          form.setValue('isAssistantCellLeader', boolValue, {
                            shouldValidate: true,
                            shouldDirty: true
                          });
                        }}
                        value={field.value ? 'yes' : 'no'}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="assistant-yes" value="yes" />
                          <FormLabel htmlFor="assistant-yes" className="font-normal cursor-pointer">
                            Yes
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="assistant-no" value="no" />
                          <FormLabel htmlFor="assistant-no" className="font-normal cursor-pointer">
                            No
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isConsideredLeader"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is Considered Leader?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          const boolValue = value === 'yes';
                          field.onChange(boolValue);
                          form.setValue('isConsideredLeader', boolValue, {
                            shouldValidate: true,
                            shouldDirty: true
                          });
                        }}
                        value={field.value ? 'yes' : 'no'}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="leader-yes" value="yes" />
                          <FormLabel htmlFor="leader-yes" className="font-normal cursor-pointer">
                            Yes
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="leader-no" value="no" />
                          <FormLabel htmlFor="leader-no" className="font-normal cursor-pointer">
                            No
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isDcMember"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">DC Member</FormLabel>
                      <FormDescription>
                        Is this person a Church Member?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value ?? false}
                        onChange={(e) => {
                          const boolValue = e.target.checked;
                          field.onChange(boolValue);
                          form.setValue('isDcMember', boolValue, {
                            shouldValidate: true,
                            shouldDirty: true
                          });
                        }}
                        className="h-4 w-4 cursor-pointer"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="trainings"
                render={({ field }) => (
                  <InputMultiSelect
                    {...field}
                    label={'Trainings (Optional)'}
                    isLoading={isTrngLoading}
                    options={trngs}
                    placeholder="Select trainings you like..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        No Training available.
                      </p>
                    }
                  />
                )}
              />
              
              <div className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-y-0 md:space-x-2">
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <InputSelect
                      items={maritalStatus}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      label="Marital Status"
                      placeholder="Select a status..."
                      required
                      {...field}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <InputSelect
                      items={gender}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      label="Gender"
                      placeholder="Select a gender..."
                      required
                      {...field}
                    />
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="departments"
                render={({ field }) => (
                  <InputMultiSelect
                    {...field}
                    label={'Departments (Optional)'}
                    isLoading={isDeptLoading}
                    options={depts}
                    placeholder="Select department you like..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        No department available.
                      </p>
                    }
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
          <Button type="submit" form="form-add-member" disabled={isPending}>
            {isPending && <Loader className="animate-spin" />}
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}