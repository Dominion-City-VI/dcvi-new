import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@/components/ui/form';
import InputField from '@/components/fields/InputField';
import InputDate from '@/components/fields/InputDate';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '@/store';
import { Funnel } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { periodText } from '@/constants/mangle';

export const AttendanceFilterSchema = z.object({
  Search: z.string().optional(),
  StartAt: z.coerce.string().optional(),
  EndAt: z.coerce.string().optional(),
  Period: z.coerce.number().optional(),
  MeetingType: z.coerce.number().optional()
});

export type TAttendanceFilterSchema = z.infer<typeof AttendanceFilterSchema>;

interface DataTableToolbarProps {
  placeholder: string;
}

const DataTableToolbar = ({ placeholder }: DataTableToolbarProps) => {
  const {
    DepartmentStore: { attendanceQuery, applyAttendanceFilter, resetAttendanceFilter, hasFilter }
  } = useStore();

  const form = useForm<TAttendanceFilterSchema>({
    defaultValues: { ...attendanceQuery },
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

  return (
    <div className="flex w-full items-start justify-between gap-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-3"
        >
          <div className="flex flex-wrap items-end gap-2">
            <FormField
              control={form.control}
              name="Search"
              render={({ field }) => (
                <div className="min-w-[160px]">
                  <InputField
                    label=""
                    id="search"
                    placeholder={placeholder}
                    className="text-sm placeholder:text-sm"
                    {...field}
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="Period"
              render={({ field }) => (
                <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All</SelectItem>
                    <SelectItem value="1">Weekly</SelectItem>
                    <SelectItem value="2">Monthly</SelectItem>
                    <SelectItem value="6">This Month</SelectItem>
                    <SelectItem value="5">3 Months Ago</SelectItem>
                    <SelectItem value="4">Quarterly</SelectItem>
                    <SelectItem value="3">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <FormField
              control={form.control}
              name="StartAt"
              render={({ field }) => (
                <div className="w-36">
                  <InputDate
                    label=""
                    placeholder="Date from"
                    granularity="day"
                    displayFormat={{ hour24: 'yyyy/MM/dd' }}
                    yearRange={2}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="EndAt"
              render={({ field }) => (
                <div className="w-36">
                  <InputDate
                    label=""
                    placeholder="Date to"
                    granularity="day"
                    displayFormat={{ hour24: 'yyyy/MM/dd' }}
                    yearRange={0}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />

            <div className="flex items-center gap-2">
              {hasFilter(attendanceQuery) && (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleReset}
                  className="h-8 px-2 lg:px-3"
                >
                  Reset
                  <Cross2Icon className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button type="submit" className="h-8 px-2 lg:px-3">
                Apply
                <Funnel />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default observer(DataTableToolbar);