import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@/components/ui/form';
import InputField from '@/components/fields/InputField';
import InputDate from '@/components/fields/InputDate';
import { zodResolver } from '@hookform/resolvers/zod';
import { Funnel } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AttendanceFilterSchema,
  TAttendanceFilterSchema
} from '../attendanceFilterSchema';

export type { TAttendanceFilterSchema };

interface DataTableToolbarProps {
  placeholder: string;
  isFiltered: boolean;
  onApply: (data: TAttendanceFilterSchema) => void;
  onReset: () => void;
}

const DataTableToolbar = ({
  placeholder,
  isFiltered,
  onApply,
  onReset
}: DataTableToolbarProps) => {
  const form = useForm<TAttendanceFilterSchema>({
    defaultValues: {
      Search: '',
      Period: undefined,
      AttendanceStatus: undefined,
      MeetingType: undefined,
      StartAt: undefined,
      EndAt: undefined
    },
    mode: 'onSubmit',
    resolver: zodResolver(AttendanceFilterSchema)
  });

  const handleReset = () => {
    form.reset({
      Search: '',
      Period: undefined,
      AttendanceStatus: undefined,
      MeetingType: undefined,
      StartAt: undefined,
      EndAt: undefined
    });
    onReset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)}>
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
              <Select
                value={field.value !== undefined ? field.value.toString() : ''}
                onValueChange={(v) => field.onChange(v === '' ? undefined : Number(v))}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Period" />
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
            name="AttendanceStatus"
            render={({ field }) => (
              <Select
                value={field.value !== undefined ? field.value.toString() : ''}
                onValueChange={(v) => field.onChange(v === '' ? undefined : Number(v))}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Statuses</SelectItem>
                  <SelectItem value="1">Present</SelectItem>
                  <SelectItem value="2">Absent</SelectItem>
                  <SelectItem value="4">Traveled</SelectItem>
                  <SelectItem value="5">Sick</SelectItem>
                  <SelectItem value="3">Non-church Member</SelectItem>
                  <SelectItem value="6">Unmarked</SelectItem>
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
                  onChange={(val) => field.onChange(val ? new Date(val).toISOString() : undefined)}
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
                  onChange={(val) => field.onChange(val ? new Date(val).toISOString() : undefined)}
                />
              </div>
            )}
          />

          <div className="flex items-center gap-2">
            {isFiltered && (
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
              <Funnel className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default DataTableToolbar;
