'use client';
import { forwardRef, type ReactNode } from 'react';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface IInputProps extends React.ComponentProps<'textarea'> {
  label: string;
  description?: ReactNode;
}

const TextareaField = forwardRef<HTMLTextAreaElement, IInputProps>(
  ({ description, label, ...props }, ref) => {
    return (
      <FormItem className="w-full">
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea {...{ ref }} {...props} />
        </FormControl>
        <FormDescription>{description}</FormDescription>
        <FormMessage />
      </FormItem>
    );
  }
);

TextareaField.displayName = 'TextareaField';

export default TextareaField;
