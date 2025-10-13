// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import InputField from '@/components/fields/InputField';
// import { Form, FormField } from '@/components/ui/form';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { PwdResetSchema, TPwdResetSchema } from './validation';
// import { Route } from '@/routes/auth/password-reset';
// import { Route as loginRoute } from '@/routes/auth/login';
// import { useStore } from '@/store';
// import { useNavigate } from '@tanstack/react-router';
// import { Loader } from 'lucide-react';

// export default function PwdReset({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
//   const { email } = Route.useSearch();

//   const {
//     AuthStore: { resetPwd, isLoading }
//   } = useStore();
//   const navigate = useNavigate();

//   const form = useForm<TPwdResetSchema>({
//     mode: 'onSubmit',
//     defaultValues: { emailAddress: email },
//     resolver: zodResolver(PwdResetSchema),
//     reValidateMode: 'onSubmit'
//   });

//   function onSubmit(data: TPwdResetSchema) {
//     resetPwd(data, () => navigate({ to: loginRoute.fullPath, replace: true }));
//   }

//   return (
//     <div className={cn('flex flex-col gap-6', className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">Reset Password</CardTitle>
//           <CardDescription>
//             Enter your new password and the token sent to your mail.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
//               <fieldset disabled={isLoading.reset} className="flex flex-col gap-2">
//                 <FormField
//                   control={form.control}
//                   name="newPassword"
//                   render={({ field }) => (
//                     <InputField
//                       label="Password"
//                       id="newPassword"
//                       type="password"
//                       required
//                       {...field}
//                     />
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="rePassword"
//                   render={({ field }) => (
//                     <InputField
//                       label="Confirm Password"
//                       id="rePassword"
//                       type="password"
//                       required
//                       {...field}
//                     />
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="otp"
//                   render={({ field }) => (
//                     <InputField label="Otp" id="otp" type="text" required {...field} />
//                   )}
//                 />
//               </fieldset>

//               <Button disabled={isLoading.reset} type="submit" className="w-full">
//                 {isLoading.reset && <Loader className="animate-spin" />}
//                 Submit
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputField from '@/components/fields/InputField';
import { Form, FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PwdResetSchema, TPwdResetSchema } from './validation';
import { Route } from '@/routes/auth/password-reset';
import { Route as loginRoute } from '@/routes/auth/login';
import { useStore } from '@/store';
import { useNavigate } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { toast } from 'sonner';
import { useState } from 'react';

function PwdReset({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { email } = Route.useSearch();
  const [error, setError] = useState('');

  const {
    AuthStore: { resetPwd }
  } = useStore();
  const navigate = useNavigate();

  const form = useForm<TPwdResetSchema>({
    mode: 'onSubmit',
    defaultValues: { emailAddress: email },
    resolver: zodResolver(PwdResetSchema),
    reValidateMode: 'onSubmit'
  });

  async function onSubmit(data: TPwdResetSchema) {
    setError('');
    try {
      await resetPwd(data);
      toast.success('Password has been reset successfully!');
      form.reset();
      navigate({ to: loginRoute.fullPath, replace: true });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to reset password. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password and the token sent to your mail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <fieldset disabled={isSubmitting} className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <InputField
                      label="New Password"
                      id="newPassword"
                      type="password"
                      required
                      {...field}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="rePassword"
                  render={({ field }) => (
                    <InputField
                      label="Confirm Password"
                      id="rePassword"
                      type="password"
                      required
                      {...field}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <InputField label="OTP Token" id="otp" type="text" required {...field} />
                  )}
                />
              </fieldset>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button disabled={isSubmitting} type="submit" className="w-full">
                {isSubmitting && <Loader className="animate-spin mr-2" />}
                {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default observer(PwdReset);