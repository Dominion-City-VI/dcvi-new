import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { useForm } from 'react-hook-form';
import { Pencil, X, Check, Loader2 } from 'lucide-react';

import { XModal } from '@/components/modals';
import { useStore } from '@/store';

import { DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

import { Form, FormField } from '@/components/ui/form';
import InputField from '@/components/fields/InputField';
import InputSelect from '@/components/fields/InputSelect';
import InputMultiSelect from '@/components/fields/InputMultiSelect';
import DateInput from '@/components/fields/InputDate';

import { gender, maritalStatus } from '@/constants/data';
import { getLabel } from '@/utils';

import { useFetchDepartmentUser } from '@/hooks/department/useFetchDepartmentUser';
import { useUpdateUser } from '@/hooks/department/useUpdateUser';
import { useFetchTrainings } from '@/hooks/settings/useFetchTrainings';
import { toast } from 'sonner';

type Option = { label: string; value: string };

type FormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  occupation: string;
  trainings: Option[];
  maritalStatus: string;
  gender: string;
  address?: string;
  dateOfBirth?: Date;
};

function uniqStrings(list: string[]) {
  return Array.from(new Set(list.map((x) => (x ?? '').trim()).filter(Boolean)));
}

function normalizeStringList(list: any): string[] {
  if (!Array.isArray(list)) return [];
  return list.map((x) => String(x ?? '').trim()).filter(Boolean);
}

const MemberModal = observer(() => {
  const {
    AppConfigStore: { toggleModals, isOpen, cellMemberModal }
  } = useStore();

  const [isEditMode, setIsEditMode] = useState(false);

  const modalData = toJS(cellMemberModal);
  const userId = modalData?.id || '';

  const { data: user, isLoading: isUserLoading } = useFetchDepartmentUser(userId);
  const { data: trngData, isLoading: isTrngLoading } = useFetchTrainings();
  const updateMutation = useUpdateUser();

  const form = useForm<FormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      emailAddress: '',
      occupation: '',
      trainings: [],
      maritalStatus: '',
      gender: '',
      address: '',
      dateOfBirth: undefined
    }
  });

  const trainingOptions: Option[] = useMemo(() => {
    const items = Array.isArray(trngData) ? trngData : [];
    const unique = uniqStrings(items);
    return unique.map((t) => ({ label: t, value: t }));
  }, [trngData]);


  const selectedTrainings: Option[] = useMemo(() => {
    if (!user) return [];
    const done = new Set(normalizeStringList(user.trainings));
    return trainingOptions.filter((opt) => done.has(opt.value));
  }, [user, trainingOptions]);

  useEffect(() => {
    if (isUserLoading || !user) return;
    if (isTrngLoading) return;

    form.reset({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phoneNumber: user.phoneNumber ?? '',
      emailAddress: user.email ?? '',
      occupation: user.occupation ?? '',
      address: user.address ?? '',
      trainings: selectedTrainings,
      maritalStatus: user.maritalStatus?.toString?.() ?? '',
      gender: user.gender?.toString?.() ?? '',
      dateOfBirth: user.dateOfBirth
    });
  }, [isUserLoading, user, isTrngLoading, selectedTrainings, form]);

  const handleClose = () => {
    setIsEditMode(false);
    form.reset();
    toggleModals({});
  };

  const handleCancel = () => {
    setIsEditMode(false);
    if (!user) return;

    form.reset({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phoneNumber: user.phoneNumber ?? '',
      emailAddress: user.email ?? '',
      occupation: user.occupation ?? '',
      address: user.address ?? '',
      trainings: selectedTrainings,
      maritalStatus: user.maritalStatus?.toString?.() ?? '',
      gender: user.gender?.toString?.() ?? '',
      dateOfBirth: user.dateOfBirth
    });
  };

  const onSubmit = async (values: FormValues) => {
    if (!userId || !user) return;

    await updateMutation.mutateAsync({
      userId,
      payload: {
        email: values.emailAddress,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        occupation: values.occupation,
        address: values.address,
        trainings: values.trainings.map((t) => t.value), // string[]
        departments: user.departments,
        gender: Number(values.gender),
        maritalStatus: Number(values.maritalStatus),
        zoneId: user.zoneId,
        cellId: user.cellId,
        status: user.status,
        dateOfBirth: values.dateOfBirth
      }
    });

    setIsEditMode(false);
  };

  const isSaving = updateMutation.isPending;

  return (
    <XModal isOpen={isOpen.DEPARTMENT_VIEW_MEMBER_MODAL} closeModal={handleClose}>
      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader className="mb-4">
          {isUserLoading ? (
            <>
              <DialogTitle>Loading...</DialogTitle>
              <DialogDescription>Please wait while we load the member details</DialogDescription>
            </>
          ) : user ? (
            <>
              <div className="flex items-center justify-between">
                <DialogTitle>
                  {user.firstName} {user.lastName}
                </DialogTitle>

                {!isEditMode ? (
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                    <span className="flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </span>
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                      <span className="flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Cancel
                      </span>
                    </Button>

                    <Button type="button" size="sm" onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
                      <span className="flex items-center gap-2">
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        {isSaving ? 'Saving...' : 'Save'}
                      </span>
                    </Button>
                  </div>
                )}
              </div>

              <DialogDescription>
                {isEditMode
                  ? `Edit the details for ${user.firstName} ${user.lastName}`
                  : `View the details for ${user.firstName} ${user.lastName}`}
              </DialogDescription>
            </>
          ) : (
            <DialogTitle>Member Details</DialogTitle>
          )}
        </DialogHeader>

        {isUserLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          user && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <fieldset
                  disabled={!isEditMode || isSaving}
                  className="flex h-96 w-full flex-col gap-2 overflow-y-scroll md:h-full"
                >
                  <div className="flex w-full flex-col items-start space-y-2 md:flex-row md:justify-between md:space-y-0 md:space-x-2">
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
                    render={({ field }) => <InputField label="Email" id="email" type="email" required {...field} />}
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

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <InputField label="Address" id="address" type="text" placeholder="Enter address" {...field} />
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
                          disabled={!isEditMode || isSaving}
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
                          disabled={!isEditMode || isSaving}
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
                        {...field}
                        options={trainingOptions}
                        isLoading={isTrngLoading}
                        label="Trainings"
                        hideClearAllButton={!isEditMode}
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
                    name="dateOfBirth"
                    render={({ field }) => <DateInput label="Date Of Birth" {...field} />}
                  />
                </fieldset>
              </form>
            </Form>
          )
        )}
      </DialogContent>
    </XModal>
  );
});

export default MemberModal;
