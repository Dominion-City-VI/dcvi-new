import { DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { Loader } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import InputMultiSelect from '@/components/fields/InputMultiSelect';
import InputSelect from '@/components/fields/InputSelect';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { ADMIN } from '@/constants/api';
import { z } from 'zod';
import { useFetchRoles } from './useFetchRoles';
// import { useFetchZones, useFetchCells } from '@/hooks/useFetchData';
import { observer } from 'mobx-react-lite';
import { postGrantAccess } from '@/requests/admin';
import { useFetchZones } from '@/hooks/zone/useFetchZone';
import { useFetchCells } from '@/hooks/cell/useFetchCell';

export const AdminGrantAccessPayload = z.object({
  requestId: z.string({ required_error: 'Provide a request ID.' }),
  zoneId: z.string(),
  cellId: z.string(),
  roles: z.array(z.number()).min(1, 'At least one role is required.'),
  requestStatus: z.number().optional(),
});

export type TAdminGrantAccessPayload = z.infer<typeof AdminGrantAccessPayload>;

function UserAccessModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, adminGrantAccessModal },
    AdminStore: { isLoading }
  } = useStore();

  const queryClient = useQueryClient();
  const [rolesSelect, setRoles] = useState<Array<Option>>([]);
  const [zones, setZones] = useState<{ label: string; value: string }[]>([]);
  const [cells, setCells] = useState<{ label: string; value: string }[]>([]);
  
  const { data: roleData, status: roleStatus } = useFetchRoles();

  const form = useForm<TAdminGrantAccessPayload>({
    mode: 'onChange',
    defaultValues: {
      requestId: adminGrantAccessModal?.requestId || '',
      zoneId: adminGrantAccessModal?.zoneId || '',
      cellId: adminGrantAccessModal?.cellId || '',
      roles: [],
    },
    resolver: zodResolver(AdminGrantAccessPayload),
  });

  const selectedRoles = form.watch('roles');
  const selectedZone = form.watch('zoneId');

  // Fetch zones data
  const { data: zoneData, status: zoneStatus } = useFetchZones({
    take: '1.7976931348623157e%2B308'
  });

  // Fetch cells data based on selected zone
  const { data: cellData, status: cellStatus } = useFetchCells(
    { ZoneId: selectedZone },
    Boolean(selectedZone)
  );

  // Populate zones dropdown
  useEffect(() => {
    if (zoneStatus === 'success' && zoneData !== undefined) {
      const zoneArr = zoneData.items.map((item: { name: any; id: any; }) => ({ label: item.name, value: item.id }));
      setZones(zoneArr);
    }
  }, [zoneData, zoneStatus]);

  // Populate cells dropdown
  useEffect(() => {
    if (cellStatus === 'success' && cellData !== undefined) {
      const cellArr = cellData.items.map((item: { name: any; id: any; }) => ({ label: item.name, value: item.id }));
      setCells(cellArr);
    }
  }, [cellData, cellStatus]);

  // Reset cell when zone changes
  useEffect(() => {
    form.resetField('cellId');
  }, [selectedZone, form]);

  // Check if zone/cell selection is needed based on roles
  const isEmptyGuid = (id: string | null | undefined) => {
    return !id || id === '00000000-0000-0000-0000-000000000000';
  };

  const needsZoneSelection = selectedRoles.includes(4) && isEmptyGuid(adminGrantAccessModal?.zoneId);
  const needsCellSelection = selectedRoles.includes(5) && isEmptyGuid(adminGrantAccessModal?.cellId);
  const showZoneField = needsZoneSelection || needsCellSelection;
  const showCellField = needsCellSelection;

  useEffect(() => {
    if (roleStatus === 'success' && roleData !== undefined) {
      const roleToEnumMap: Record<string, number> = {
        'SeniorPastor': 1,
        'Pastor': 2,
        'DistrictPastor': 3,
        'ZonalPastor': 4,
        'CellLeader': 5,
        'AssistantCellLeader': 6,
        'Member': 7,
        'DepartmentalHead': 8,
        'AssistantDepartmentalHead': 9,
        'SubAdmin': 10
      };

      const options = roleData.map((role) => ({
        label: role,
        value: roleToEnumMap[role]?.toString() || '0'
      })).filter(option => option.value !== '0');
      
      setRoles(options);
    }
  }, [roleData, roleStatus]);

  // Reset form when modal data changes
  useEffect(() => {
    if (adminGrantAccessModal?.requestId) {
      form.reset({
        requestId: adminGrantAccessModal.requestId || '',
        zoneId: adminGrantAccessModal.zoneId || '',
        cellId: adminGrantAccessModal.cellId || '',
        roles: [],
      });
    }
  }, [adminGrantAccessModal?.requestId, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: postGrantAccess,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === ADMIN.GET_ANALYTICS
      });
      toast.success(data.data.message);
      toggleModals({});
    }
  });

  const onSubmit = (data: TAdminGrantAccessPayload) => {
    console.log('Form submitted with data:', data);
    
    const payload: TAdminGrantAccessPayload = {
      requestId: data.requestId.trim(),
      zoneId: data.zoneId.trim(),
      cellId: data.cellId.trim(),
      roles: data.roles.filter(role => role > 0),
      requestStatus: 1,
    };
    
    console.log('Payload being sent:', payload);
    
    if (!payload.requestId || payload.roles.length === 0) {
      toast.error('Please ensure all required fields are filled');
      return;
    }
    
    mutate(payload);
  };

  const handleCancel = () => {
    form.reset();
    toggleModals({});
  };

  return (
    <XModal isOpen={isOpen.ADMIN_ACCESS_REQUEST_MODAL} closeModal={() => !isPending && toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Grant Access</DialogTitle>
          <DialogDescription>Confirm to grant the user access.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="access-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <fieldset disabled={isPending || isLoading.updateRole} className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-1">
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Roles</FormLabel>
                      <FormControl>
                        <InputMultiSelect
                          label={''} 
                          {...field}
                          value={
                            value?.map(numericValue => 
                              rolesSelect.find(option => parseInt(option.value, 10) === numericValue)
                            ).filter((option): option is Option => option !== undefined) || []
                          }
                          onChange={(selectedOptions: Option[]) => {
                            const numericValues = selectedOptions.map(option => parseInt(option.value, 10));
                            onChange(numericValues);
                          }}
                          isLoading={roleStatus === 'pending'}
                          options={rolesSelect}
                          placeholder="Select Roles..."
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              No roles available.
                            </p>
                          }                        
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
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
              </div>
            </fieldset>
          </form>
        </Form>

        <DialogFooter className="sm:justify-end">
          <Button 
            disabled={isPending || isLoading.approveRejectAccess} 
            type="button" 
            variant="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            disabled={isPending || isLoading.approveRejectAccess || form.formState.isSubmitting} 
            form="access-form" 
            type="submit"
          >
            {(isPending || isLoading.approveRejectAccess) && <Loader className="animate-spin mr-2" />}
            Grant Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}

export default observer(UserAccessModal);