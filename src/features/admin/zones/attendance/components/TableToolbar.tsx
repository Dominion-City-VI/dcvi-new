import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@/components/ui/form';
import InputDate from '@/components/fields/InputDate';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '@/store';
import { Funnel } from 'lucide-react';
import { observer } from 'mobx-react-lite';

export const AttendanceFilterSchema = z.object({
  StartAt: z.coerce.string().optional(),
  EndAt: z.coerce.string().optional()
});

export type TAttendanceFilterSchema = z.infer<typeof AttendanceFilterSchema>;

const DataTableToolbar = () => {
  const {
    AdminStore: { adminZoneAttendanceQuery, applyAttendanceFilter, resetAttendanceFilter, hasFilter }
  } = useStore();

  const form = useForm<TAttendanceFilterSchema>({
    defaultValues: { ...adminZoneAttendanceQuery },
    mode: 'onSubmit',
    resolver: zodResolver(AttendanceFilterSchema),
    reValidateMode: 'onChange'
  });

  const onSubmit = (data: TAttendanceFilterSchema) => {
    applyAttendanceFilter(data);
  };

  const handleReset = () => {
    form.reset();
    resetAttendanceFilter();
  };

  console.log(adminZoneAttendanceQuery);

  return (
    <div className="flex w-full items-center justify-between">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col justify-between md:flex-row md:items-center"
        >
          <fieldset className="grid w-full grid-cols-2 items-center gap-2 sm:grid-cols-3 lg:grid-cols-5">
            <div className="col-span-1">
              <FormField
                control={form.control}
                name="StartAt"
                render={({ field }) => (
                  <InputDate
                    label=""
                    placeholder="Start at"
                    granularity="day"
                    hourCycle={12}
                    displayFormat={{ hour24: 'yyyy/MM/dd' }}
                    yearRange={2}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="EndAt"
                render={({ field }) => (
                  <InputDate
                    label=""
                    placeholder="End at"
                    granularity="day"
                    hourCycle={12}
                    displayFormat={{ hour24: 'yyyy/MM/dd' }}
                    yearRange={0}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </fieldset>

          <div className="flex justify-start space-x-2">
            {hasFilter(adminZoneAttendanceQuery) && (
              <>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleReset}
                  className="col-span-1 h-8 px-2 lg:px-3"
                >
                  Reset
                  <Cross2Icon className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            <Button type="submit" className="col-span-1 h-8 px-2 lg:px-3">
              Apply
              <Funnel />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default observer(DataTableToolbar);
