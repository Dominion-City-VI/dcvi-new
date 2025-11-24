import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { password } from '@/features/auth/validation';
import InputField from '@/components/fields/InputField';
import { useMutation } from '@tanstack/react-query';
import { putPwdUpdate } from '@/requests/user';
import { useStyledToast } from '@/hooks/custom/useStyledToast';
import { parseError } from '@/utils/errorHandler';
import { Loader } from 'lucide-react';
import { AxiosError } from 'axios';

export const accountFormSchema = z
  .object({
    oldPassword: password,
    newPassword: password,
    confirmNewPassword: password
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match.',
    path: ['confirmNewPassword']
  });

export type TAccountFormSchema = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const toast = useStyledToast();
  const form = useForm<TAccountFormSchema>({
    resolver: zodResolver(accountFormSchema)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: putPwdUpdate,
    onError: (error: AxiosError<any>) => {
      toast.error(parseError(error));
    },
    onSuccess: () => {
      toast.success('Account password changed!');
      form.setValue('oldPassword', '');
      form.setValue('newPassword', '');
      form.setValue('confirmNewPassword', '');
    }
  });

  function onSubmit(data: TAccountFormSchema) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <InputField label="Old Password" id="oldPassword" type="password" required {...field} />
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <InputField label="New Password" id="newPassword" type="password" required {...field} />
          )}
        />

        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <InputField
              label="Confirm New Password"
              id="confirmNewPassword"
              type="password"
              required
              {...field}
            />
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader className="animate-spin" />}
          Change Password
        </Button>
      </form>
    </Form>
  );
}
