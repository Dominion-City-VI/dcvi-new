import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Route as forgotRoute } from '@/routes/auth/forgot-password';
import { Route as registerRoute } from '@/routes/auth/request';
import InputField from '@/components/fields/InputField';
import { LoginValidationSchema, TLogin } from './validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/_authenticated';
import { Loader } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const LoginForm = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
  const {
    AuthStore: { login, isLoading }
  } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<TLogin>({
    mode: 'onSubmit',
    resolver: zodResolver(LoginValidationSchema),
    reValidateMode: 'onSubmit'
  });

  function onSubmit(data: TLogin) {
    login(data, () => {
      queryClient.resetQueries();
      navigate({ to: Route.path, replace: true });
    });
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset disabled={isLoading.login} className="w-full space-y-6">
                <div className="flex w-full flex-col gap-2">
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

                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <InputField
                          label="Password"
                          id="password"
                          type="password"
                          placeholder='Password123@'
                          required
                          {...field}
                        />
                      )}
                    />
                    <div className="flex items-center">
                      <div></div>
                      <a
                        href={forgotRoute.fullPath}
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading.login}>
                    {isLoading.login && <Loader className="animate-spin" />}
                    Login
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <a href={registerRoute.fullPath} className="underline underline-offset-4">
                    Request access
                  </a>
                </div>
              </fieldset>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default observer(LoginForm);
