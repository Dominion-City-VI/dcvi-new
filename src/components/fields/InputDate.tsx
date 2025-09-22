'use client';
import { forwardRef, type ReactNode } from 'react';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  DateTimePicker,
  DateTimePickerProps,
  DateTimePickerRef
} from '@/components/ui/DateTimePicker';

interface IInputProps extends DateTimePickerProps {
  label: string;
  description?: ReactNode;
}

const InputDate = forwardRef<DateTimePickerRef, IInputProps>(
  ({ description, label, ...props }, ref) => {
    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <DateTimePicker {...{ ref }} {...props} />
        </FormControl>
        <FormDescription>{description}</FormDescription>
        <FormMessage />
      </FormItem>
    );
  }
);

InputDate.displayName = 'InputDate';

export default InputDate;
