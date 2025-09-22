import { forwardRef, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';

export type TComboInputData = {
  value: string;
  label: string;
};

interface IInputComboProps extends React.HTMLAttributes<HTMLInputElement> {
  isLoading: boolean;
  data: Array<TComboInputData>;
  placeholder: string;
  empty: string;
  description?: string;
  value: string;
  label: string;
  setValue: (arg: string) => void;
}

const InputCombo = forwardRef<HTMLInputElement, IInputComboProps>(
  ({ placeholder, data, empty, description, label, value, setValue }) => {
    const [open, setOpen] = useState(false);
    return (
      <FormItem className="flex w-full flex-col">
        <FormLabel>{label}</FormLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn('w-full justify-between', !value && 'text-muted-foreground')}
              >
                {value ? data.find((datum) => datum.value === value)?.label : placeholder}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <Command className="w-full">
              <CommandInput placeholder={placeholder} className="h-9" />
              <CommandList>
                <CommandEmpty>{empty}</CommandEmpty>
                <CommandGroup>
                  {data.map((datum) => (
                    <CommandItem
                      value={datum.label}
                      key={datum.value}
                      onSelect={() => {
                        setValue(datum.value);
                        setOpen(false);
                      }}
                    >
                      {datum.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          datum.value === value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FormDescription>{description}</FormDescription>
        <FormMessage />
      </FormItem>
    );
  }
);

InputCombo.displayName = 'InputCombo';
export default InputCombo;
