import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Route } from '@/routes/auth/login';
import { useForm } from 'react-hook-form';
import { ForgotPwdSchema, TForgotPwd } from './validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import InputField from '@/components/fields/InputField';
import { useStore } from '@/store';
import { Loader } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from '@tanstack/react-router';
import { Route as FORGOTPASSWORD } from '@/routes/auth/password-reset';

function ForgotPwdForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const {
    AuthStore: { forgotPwd, isLoading }
  } = useStore();
  const form = useForm<TForgotPwd>({
    mode: 'onSubmit',
    resolver: zodResolver(ForgotPwdSchema),
    reValidateMode: 'onSubmit'
  });

  const navigate = useNavigate();

  function onSubmit(data: TForgotPwd) {
    forgotPwd(data, ()=>{
        navigate({to: FORGOTPASSWORD.fullPath+"?email="+data.emailAddress, replace: true});
    });
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to receive an otp to change your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset disabled={isLoading.forgotPwd} className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <InputField
                      label="Email"
                      id="email"
                      type="email"
                      placeholder="ifeanyi.nwakuche@gmail.com"
                      required
                      {...field}
                    />
                  )}
                />
                <Button disabled={isLoading.forgotPwd} type="submit" className="w-full">
                  {isLoading.forgotPwd && <Loader className="animate-spin" />}
                  submit
                </Button>
              </fieldset>
              <div className="mt-4 text-center text-sm">
                Remember your password ?{' '}
                <a href={Route.fullPath} className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default observer(ForgotPwdForm);
