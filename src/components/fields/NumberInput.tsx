'use client';
import { forwardRef, type ReactNode } from 'react';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface IInputProps extends NumericFormatProps {
  label: string;
  description?: ReactNode;
}

const InputNumberField = forwardRef<HTMLInputElement, IInputProps>(
  ({ description, label, ...props }, ref) => {
    return (
      <FormItem className="w-full">
        <FormLabel>{label}</FormLabel>
        <FormControl className="w-full">
          <NumericFormat
            className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            {...{ ref }}
            {...props}
          />
        </FormControl>
        <FormDescription>{description}</FormDescription>
        <FormMessage />
      </FormItem>
    );
  }
);

InputNumberField.displayName = 'InputNumberField';

export default InputNumberField;
