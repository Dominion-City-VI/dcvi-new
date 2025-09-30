import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import InputSelect from '@/components/fields/InputSelect';
import InputField from '@/components/fields/InputField';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { ADMIN } from '@/constants/api';
import { observer } from 'mobx-react-lite';
import { trueOfFalse } from '@/constants/data';
import InputMultiSelect from '@/components/fields/InputMultiSelect';
import { useFetchRoles } from '@/features/admin/requests/access/components/modal/useFetchRoles';
import { sidebarData } from '@/components/layout/data/sidebar-data';

export const RevokeRoleSchema = z.object({
  emailAddress: z.string().email('Invalid email.'),
  roles: z.array(z.number()).min(1, 'At least one role is required.'),
  description: z.string(),
  isRevokeAccess: z.string()
});

export type TRevokeRoleSchema = z.infer<typeof RevokeRoleSchema>;

function RevokeRoleModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, updateRoleModal },
    AdminStore: { revokeUserRole, isLoading }
  } = useStore();

  const queryClient = useQueryClient();
  const {status: roleStatus } = useFetchRoles();

  const form = useForm<TRevokeRoleSchema>({
    defaultValues: 
    {
      emailAddress: updateRoleModal.emailAddress,
      roles: [],
      description: "" 
    },
    mode: 'onSubmit',
    resolver: zodResolver(RevokeRoleSchema),
    reValidateMode: 'onChange'
  });

  const rolesByValAndLabel = () => {
    return sidebarData.roleSwitcher
      .filter((role) => updateRoleModal.roles.includes(role.value))
      .map((el) => ({
        value: el.value.toString(),
        label: el.name
      }));
  };

  const rolesSelect = rolesByValAndLabel();

  const onSubmit = (data: TRevokeRoleSchema) => {
    data.isRevokeAccess = data.isRevokeAccess;
    data.roles = data.roles
    const cb = () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === ADMIN.GET_ANALYTICS
      });
      toggleModals();
    };
    revokeUserRole(data, cb);
  };

  return (
    <XModal isOpen={isOpen.REVOKE_ROLE_MODAL} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Revoke {updateRoleModal.fullName}&apos; role</DialogTitle>
          <DialogDescription>Revoke roles to this user.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="attendance-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isLoading.revokeRole} className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-1">
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Roles</FormLabel>
                      <FormControl>
                        <InputMultiSelect
                        label={''} {...field}
                        value={
                            value?.map(numericValue => rolesSelect.find(option => parseInt(option.value, 10) === numericValue)
                            ).filter((option): option is Option => option !== undefined) || []}
                          onChange={(selectedOptions: Option[]) => {
                            const numericValues = selectedOptions.map(option => parseInt(option.value, 10));
                            onChange(numericValues);
                          } 
                        }
                        isLoading={roleStatus === 'pending'}
                        options={rolesSelect}
                        placeholder="Select Roles..."
                        emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          No roles available.
                        </p>}                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br/>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Description"
                      placeholder="Give a description..."
                      defaultValue={field.value}
                    />
                  )}
                /><br/>
                <FormField
                  control={form.control}
                  name="isRevokeAccess"
                  render={({ field }) => (
                    <InputSelect
                        items={trueOfFalse}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        label="Revoke Access"
                        placeholder="Select yes to block user from Platform"
                        required
                        {...field}
                      />
                  )}
                />
              </div>
            </fieldset>
          </form>
        </Form>

        <DialogFooter className="sm:justify-end">
          <DialogClose disabled={isLoading.revokeRole} asChild>
            <Button disabled={isLoading.revokeRole} type="button" variant="secondary">
              close
            </Button>
          </DialogClose>
          <Button disabled={isLoading.revokeRole} form="attendance-form" type="submit">
            {isLoading.revokeRole && <Loader className="animate-spin" />}
            Revoke role
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}

export default observer(RevokeRoleModal);
