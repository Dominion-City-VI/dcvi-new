import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Route as loginRoute } from '@/routes/auth/login';
import InputField from '@/components/fields/InputField';
import { PersonalInfoSchema, TPersonalInfoSchema } from '../validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import { MoveRight } from 'lucide-react';
import InputSelect from '@/components/fields/InputSelect';
import { gender, maritalStatus } from '@/constants/data';
import { useStore } from '@/store';
import { observer } from 'mobx-react-lite';

const LoginForm = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
  const {
    AuthStore: { changeReqForm, setPersonalInfo, personalInfo }
  } = useStore();
  const form = useForm<TPersonalInfoSchema>({
    mode: 'onSubmit',
    defaultValues: personalInfo,
    resolver: zodResolver(PersonalInfoSchema),
    reValidateMode: 'onChange'
  });

  function onSubmit(data: TPersonalInfoSchema) {
    setPersonalInfo(data);
    changeReqForm();
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Personal</CardTitle>
          <CardDescription>All fields are required</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <div className="flex w-full flex-col gap-2">
                <div className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-y-0 md:space-x-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <InputField
                        label="First Name"
                        id="fName"
                        type="text"
                        placeholder="Ifeanyi"
                        required
                        {...field}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <InputField
                        label="Last Name"
                        id="lName"
                        type="text"
                        placeholder="Nwakuche"
                        required
                        {...field}
                      />
                    )}
                  />
                </div>

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

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <InputField
                      label="Phone Number"
                      id="pNo"
                      type="text"
                      placeholder="08012345678"
                      required
                      {...field}
                    />
                  )}
                />

                <div className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-y-0 md:space-x-2">
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <InputSelect
                        items={maritalStatus}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        label="Marital Status"
                        placeholder="select status"
                        required
                        {...field}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <InputSelect
                        items={gender}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        label="Gender"
                        placeholder="select gender"
                        required
                        {...field}
                      />
                    )}
                  />
                </div>

                 <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <InputField
                      label="Address"
                      id="address"
                      type="text"
                      placeholder="No 234 Block B1 Alausa way, Lagos."
                      required
                      {...field}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <InputField
                      label="Password"
                      id="password"
                      type="password"
                      required
                      {...field}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <InputField
                      label="Confirm Password"
                      id="cPassword"
                      type="password"
                      required
                      {...field}
                    />
                  )}
                />

                <Button type="submit" className="w-full">
                  Next
                  <MoveRight />
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <a href={loginRoute.fullPath} className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default observer(LoginForm);
