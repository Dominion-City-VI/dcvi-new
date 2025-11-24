import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { email, firstName, lastName, optionSchema, phoneNumber } from '@/features/auth/validation';
import InputSelect from '@/components/fields/InputSelect';
import { gender, maritalStatus } from '@/constants/data';
import InputField from '@/components/fields/InputField';
import { useEffect, useState } from 'react';
import { useFetchTrainings } from '@/hooks/settings/useFetchTrainings';
import { useFetchDepartments } from '@/hooks/settings/useFetchDepartments';
import { trnformToOptions } from '@/utils';
import { useStore } from '@/store';
import InputMultiSelect from '@/components/fields/InputMultiSelect';
import { useStyledToast } from '@/hooks/custom/useStyledToast';
import { putBioUpdate } from '@/requests/user';
import { useMutation } from '@tanstack/react-query';
import { parseError } from '@/utils/errorHandler';
import { Loader } from 'lucide-react';
import { AxiosError } from 'axios';

export const ProfileFormSchema = z.object({
  email,
  firstName,
  lastName,
  phoneNumber,
  occupation: z
    .string({ required_error: 'Occupation is required' })
    .trim()
    .refine((value) => value !== '', 'Occupation is required'),
  trainings: z.array(optionSchema, { required_error: 'Training is required' }).default([]),
  departments: z.array(optionSchema, { required_error: 'Department is required' }).min(1),
  maritalStatus: z.string({ required_error: 'Marital status is required.' }).trim(),
  gender: z.string({ required_error: 'Gender is required.' }).trim()
});

export type TProfileFormSchema = z.infer<typeof ProfileFormSchema>;

export default function ProfileForm() {
  const toast = useStyledToast();
  const {
    AuthStore: { user }
  } = useStore();
  const [trngs, setTrngs] = useState<Array<Option>>([]);
  const [depts, setDepts] = useState<Array<Option>>([]);
  const { data: trngData, status: trngStatus, isLoading: isTrngLoading } = useFetchTrainings();
  const { data: deptData, status: deptStatus, isLoading: isDeptLoading } = useFetchDepartments();

  const form = useForm<TProfileFormSchema>({
    mode: 'onSubmit',
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      occupation: user.occupation,
      departments: trnformToOptions(user?.departments ?? []),
      trainings: trnformToOptions(user?.trainings ?? []),
      maritalStatus: user?.maritalStatus ? user.maritalStatus.toString() : '',
      gender: user?.gender ? user.gender.toString() : ''
    },
    reValidateMode: 'onChange'
  });

  const { mutate, isPending } = useMutation({
    mutationFn: putBioUpdate,
    onError: (error: AxiosError<any>) => {
      toast.error(parseError(error));
    },
    onSuccess: () => {
      toast.success('Bio data updated!');
    }
  });

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-8">
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-y-0 md:space-x-2">
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
            name="email"
            render={({ field }) => (
              <InputField
                label="Email"
                id="email"
                type="email"
                placeholder="ifeanyi.nwakuche@gmail.com"
                required
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
                placeholder=""
                required
                {...field}
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
                  placeholder="select status"
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
                  placeholder="select gender"
                  required
                  {...field}
                />
              )}
            />
          </div>

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
            name="trainings"
            render={({ field }) => (
              <InputMultiSelect
                {...field}
                label={'Trainings'}
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

          <FormField
            control={form.control}
            name="departments"
            render={({ field }) => (
              <InputMultiSelect
                {...field}
                label={'Departments'}
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
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader className="animate-spin" />}
          Update profile
        </Button>
      </form>
    </Form>
  );
}
