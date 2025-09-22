'use client';
import { forwardRef, InputHTMLAttributes, type ReactNode } from 'react';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: ReactNode;
}

const InputField = forwardRef<HTMLInputElement, IInputProps>(
  ({ description, label, ...props }, ref) => {
    return (
      <FormItem className="w-full">
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...{ ref }} {...props} />
        </FormControl>
        <FormDescription>{description}</FormDescription>
        <FormMessage />
      </FormItem>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
