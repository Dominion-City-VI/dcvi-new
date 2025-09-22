import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Route as loginRoute } from '@/routes/auth/login';
import { useForm } from 'react-hook-form';
import { OthersSchema, TOthersSchema, TPersonalInfoSchema } from '../validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import InputField from '@/components/fields/InputField';
import InputMultiSelect from '@/components/fields/InputMultiSelect';
import InputSelect from '@/components/fields/InputSelect';
import { useFetchTrainings } from '@/hooks/settings/useFetchTrainings';
import { useFetchDepartments } from '@/hooks/settings/useFetchDepartments';
import { trnformToOptions } from '@/utils';
import { useFetchZones } from '@/hooks/zone/useFetchZone';
import { useFetchCells } from '@/hooks/cell/useFetchCell';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { Loader } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

const OthersForm = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
  const {
    AuthStore: { changeReqForm, userRequestAccess, isLoading, personalInfo }
  } = useStore();
  const [trngs, setTrngs] = useState<Array<Option>>([]);
  const [depts, setDepts] = useState<Array<Option>>([]);
  const [zones, setZones] = useState<Array<Option>>([]);
  const [cells, setCells] = useState<Array<Option>>([]);
  const { data: trngData, status: trngStatus, isLoading: isTrngLoading } = useFetchTrainings();
  const { data: deptData, status: deptStatus, isLoading: isDeptLoading } = useFetchDepartments();

  const form = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(OthersSchema),
    reValidateMode: 'onChange'
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function onSubmit(data: TOthersSchema) {
    const info = personalInfo as TPersonalInfoSchema;
    userRequestAccess({ ...info, ...data }, () => {
          queryClient.resetQueries();
          navigate({ to: loginRoute.fullPath, replace: true });
        });
  }

  const { data: zoneData, status: zoneStatus } = useFetchZones({
    take: '1.7976931348623157e%2B308'
  });
  const { data: cellData, status: cellStatus } = useFetchCells(
    { ZoneId: form.watch('zone') },
    Boolean(form.watch('zone'))
  );

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

  useEffect(() => {
    if (zoneStatus == 'success' && zoneData !== undefined) {
      const zoneArr = zoneData.items.map((item) => ({ label: item.name, value: item.id }));
      setZones(zoneArr);
    }
  }, [zoneData, zoneStatus]);

  useEffect(() => {
    if (cellStatus == 'success' && cellData !== undefined) {
      const cellArr = cellData.items.map((item) => ({ label: item.name, value: item.id }));
      setCells(cellArr);
    }
  }, [cellData, cellStatus]);

  useEffect(() => {
    form.resetField('cell');
  }, [form.watch('zone')]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Others</CardTitle>
          <CardDescription>Fill all fields in this section</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <fieldset disabled={isLoading.request} className="flex w-full flex-col gap-3">
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

                <div className="flex w-full items-start justify-between space-x-2">
                  <FormField
                    control={form.control}
                    name="zone"
                    render={({ field }) => (
                      <InputSelect
                        {...field}
                        label={'Zone'}
                        items={zones}
                        placeholder="Select zone..."
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        // required
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cell"
                    render={({ field }) => (
                      <InputSelect
                        {...field}
                        label={'Cell'}
                        items={cells}
                        placeholder="Select cell..."
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </fieldset>
              <div className="flex items-center justify-between space-x-2">
                <Button
                  disabled={isLoading.request}
                  type="button"
                  onClick={() => changeReqForm()}
                  variant="secondary"
                  className="w-[50%]"
                >
                  Back
                </Button>
                <Button disabled={isLoading.request} type="submit" className="w-[50%]">
                  {isLoading.request && <Loader className="animate-spin" />}
                  Submit
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account? {'  '}
                <a href={loginRoute.fullPath} className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default observer(OthersForm);
