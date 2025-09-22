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
    CellStore: { attendanceQuery, applyAttendanceFilter, resetAttendanceFilter, hasFilter }
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
    <div className="flex w-full items-center justify-between">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col justify-between md:flex-row md:items-center"
        >
          <fieldset className="grid w-full grid-cols-2 items-center gap-2 sm:grid-cols-3 lg:grid-cols-5">
            <FormField
              control={form.control}
              name="Search"
              render={({ field }) => (
                <InputField
                  label=""
                  id="search"
                  placeholder={placeholder}
                  className="col-span-2 text-sm placeholder:text-sm lg:col-span-1"
                  {...field}
                />
              )}
            />

            <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-3 lg:grid-cols-5">
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
            </div>

            {/* <div className="col-span-1">
              <FormField
                control={form.control}
                name="MeetingType"
                render={({ field }) => (
                  <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Select Meeting/Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All</SelectItem>
                      <SelectItem value="1">Cell</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div> */}

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
          <br/>
          <div className="flex justify-start space-x-2">
            {hasFilter(attendanceQuery) && (
              <Button
                variant="secondary"
                type="button"
                onClick={handleReset}
                className="col-span-1 h-8 px-2 lg:px-3"
              >
                Reset
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
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