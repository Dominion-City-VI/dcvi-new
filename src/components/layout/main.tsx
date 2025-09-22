import React from 'react';
import { cn } from '@/lib/utils';

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Main = ({ fixed, ...props }: MainProps) => {
  return (
    <main
      className={cn('mt-16', 'px-4 py-6', fixed && '!mt-0 flex flex-col overflow-y-scroll !py-0')}
      {...props}
    />
  );
};

Main.displayName = 'Main';
