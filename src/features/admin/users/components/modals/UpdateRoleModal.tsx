import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import InputSelect from '@/components/fields/InputSelect';
import InputField from '@/components/fields/InputField';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { ADMIN } from '@/constants/api';
import { otherRoles } from '@/utils';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useFetchZones } from '@/hooks/zone/useFetchZone';
import { useFetchCells } from '@/hooks/cell/useFetchCell';

export const UpdateRoleSchema = z.object({
  emailAddress: z.string().email('Invalid email.'),
  role: z.string(),
  id: z.string(),
  description: z.string(),
  cellId: z.string(),
  zoneId: z.string(),
});

export type TUpdateRoleSchema = z.infer<typeof UpdateRoleSchema>;

function UpdateRoleModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, updateRoleModal },
    AdminStore: { updateUserRole, isLoading }
  } = useStore();

  const queryClient = useQueryClient();
  const [zones, setZones] = useState<{ label: string; value: string }[]>([]);
  const [cells, setCells] = useState<{ label: string; value: string }[]>([]);

  const form = useForm<TUpdateRoleSchema>({
    defaultValues: { 
      id: updateRoleModal.id, 
      emailAddress: updateRoleModal.emailAddress,
      zoneId: updateRoleModal.zoneId || '',
      cellId: updateRoleModal.cellId || '',
      description: '',
      role: ''
    },
    mode: 'onSubmit',
    resolver: zodResolver(UpdateRoleSchema),
    reValidateMode: 'onChange'
  });

  const selectedRole = form.watch('role');
  const selectedZone = form.watch('zoneId');

  const { data: zoneData, status: zoneStatus } = useFetchZones({
    take: '1.7976931348623157e%2B308'
  });

  const { data: cellData, status: cellStatus } = useFetchCells(
    { ZoneId: selectedZone },
    Boolean(selectedZone)
  );

  useEffect(() => {
    if (zoneStatus === 'success' && zoneData !== undefined) {
      const zoneArr = zoneData.items.map((item: { name: any; id: any; }) => ({ label: item.name, value: item.id }));
      setZones(zoneArr);
    }
  }, [zoneData, zoneStatus]);

  useEffect(() => {
    if (cellStatus === 'success' && cellData !== undefined) {
      const cellArr = cellData.items.map((item: { name: any; id: any; }) => ({ label: item.name, value: item.id }));
      setCells(cellArr);
    }
  }, [cellData, cellStatus]);

  useEffect(() => {
    form.resetField('cellId');
  }, [selectedZone, form]);

  const isEmptyGuid = (id: string | null | undefined) => {
    return !id || id === '00000000-0000-0000-0000-000000000000';
  };

  const needsZoneSelection = selectedRole === '4' && isEmptyGuid(updateRoleModal.zoneId);
  const needsCellSelection = selectedRole === '5' && isEmptyGuid(updateRoleModal.cellId);
  const showZoneField = needsZoneSelection || needsCellSelection;
  const showCellField = needsCellSelection;

  const rolesByValAndLabel = () => {
    return otherRoles(updateRoleModal.roles).map((el) => ({
      value: el.value.toString(),
      label: el.name
    }));
  };

  const onSubmit = (data: TUpdateRoleSchema) => {
    data.role = Number(data.role) as unknown as string;
    const cb = () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === ADMIN.GET_ANALYTICS
      });
      toggleModals();
    };

    updateUserRole(data, cb);
  };

  return (
    <XModal isOpen={isOpen.UPDATE_ROLE_MODAL} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Update {updateRoleModal.fullName}&apos; role</DialogTitle>
          <DialogDescription>Assign more roles to a this user.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="attendance-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isLoading.updateRole} className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-1">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <InputSelect
                      {...field}
                      label="Role"
                      items={rolesByValAndLabel()}
                      placeholder="Select Role..."
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      required
                    />
                  )}
                />
                
                {showZoneField && (
                  <div className={showCellField ? "flex w-full items-start justify-between space-x-2" : ""}>
                    <FormField
                      control={form.control}
                      name="zoneId"
                      render={({ field }) => (
                        <InputSelect
                          {...field}
                          label="Zone"
                          items={zones}
                          placeholder="Select zone..."
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          required={needsZoneSelection || needsCellSelection}
                        />
                      )}
                    />
                    
                    {showCellField && selectedZone && (
                      <FormField
                        control={form.control}
                        name="cellId"
                        render={({ field }) => (
                          <InputSelect
                            {...field}
                            label="Cell"
                            items={cells}
                            placeholder="Select cell..."
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            required={needsCellSelection}
                          />
                        )}
                      />
                    )}
                  </div>
                )}

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
                />
              </div>
            </fieldset>
          </form>
        </Form>

        <DialogFooter className="sm:justify-end">
          <DialogClose disabled={isLoading.updateRole} asChild>
            <Button disabled={isLoading.updateRole} type="button" variant="secondary">
              close
            </Button>
          </DialogClose>
          <Button disabled={isLoading.updateRole} form="attendance-form" type="submit">
            {isLoading.updateRole && <Loader className="animate-spin" />}
            Assign role
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}

export default observer(UpdateRoleModal);