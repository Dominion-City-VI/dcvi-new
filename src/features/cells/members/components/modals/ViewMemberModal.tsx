import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { useFetchSingleMember } from '@/hooks/cell/useFetchSingleMember';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { TUserRequestSchema } from '@/features/auth/validation';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@/components/ui/form';
import InputField from '@/components/fields/InputField';
import InputSelect from '@/components/fields/InputSelect';
import { gender, maritalStatus } from '@/constants/data';
import InputMultiSelect from '@/components/fields/InputMultiSelect';
import { useEffect } from 'react';
import { getLabel, trnformToOptions } from '@/utils';

export default function LogoutModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, cellMemberModal }
  } = useStore();

  const { data, isLoading } = useFetchSingleMember(cellMemberModal.id);

  const form = useForm<TUserRequestSchema>({
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      form.reset({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        emailAddress: data.email,
        occupation: data.occupation,
        departments: trnformToOptions(data.departments),
        trainings: trnformToOptions(data.trainings),
        maritalStatus: data.maritalStatus.toString(),
        gender: data.gender.toString()
      });
    }
  }, [isLoading, data]);

  return (
    <XModal isOpen={isOpen.VIEW_MEMBER_MODAL} closeModal={() => isLoading || toggleModals({})}>
      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader className="mb-4">
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            data && (
              <DialogTitle>
                {data.firstName} {data.lastName}
              </DialogTitle>
            )
          )}
          {isLoading ? (
            <Skeleton className="h-6 w-full" />
          ) : (
            data && (
              <DialogDescription>
                Below are the details of {data.firstName} {data.lastName}
              </DialogDescription>
            )
          )}
        </DialogHeader>

        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          data && (
            <Form {...form}>
              <fieldset
                disabled={true}
                className="flex h-96 w-full flex-col gap-2 overflow-y-scroll md:h-full"
              >
                <div className="flex w-full flex-col items-start space-y-2 space-x-2 md:flex-row md:justify-between md:space-y-0">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <InputField label="First Name" id="fName" type="text" required {...field} />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <InputField label="Last Name" id="lName" type="text" required {...field} />
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <InputField label="Email" id="email" type="email" required {...field} />
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <InputField label="Phone Number" id="pNo" type="text" required {...field} />
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
                <div className="flex items-start justify-between space-x-2">
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <InputSelect
                        items={maritalStatus}
                        defaultValue={getLabel(field.value, maritalStatus)}
                        disabled
                        label="Marital Status"
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
                        defaultValue={field.value}
                        disabled
                        label="Gender"
                        {...field}
                      />
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="trainings"
                  render={({ field }) => (
                    <InputMultiSelect
                      isLoading={false}
                      {...field}
                      label={'Trainings'}
                      hideClearAllButton
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
                      isLoading={false}
                      {...field}
                      label={'Departments'}
                      hideClearAllButton
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          No department available.
                        </p>
                      }
                    />
                  )}
                />
              </fieldset>
            </Form>
          )
        )}
      </DialogContent>
    </XModal>
  );
}
