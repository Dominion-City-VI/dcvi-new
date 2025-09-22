import { cn } from '@/lib/utils';
import { Route } from '@/routes/auth/verification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { CheckCheckIcon, Loader, X } from 'lucide-react';
import { useEffect } from 'react';

const VerifyEmail = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
  const { userId, token } = Route.useSearch();
  const {
    AuthStore: { verify, isLoading, errors }
  } = useStore();

  useEffect(() => {
    if (userId && token) {
      verify({ userId, token });
    }
  }, [userId, token, verify]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="flex w-full flex-col items-center justify-center space-y-2">
        {isLoading.verify ? (
          <>
            <CardContent>
              <Loader size={60} className="animate-spin text-indigo-800" />
            </CardContent>
            <CardHeader className="w-full text-center">
              <CardTitle className="text-2xl">Verifying Email</CardTitle>
              <CardDescription>Hang on, we are verifying your account...</CardDescription>
            </CardHeader>
          </>
        ) : errors.verify ? (
          <>
            <CardContent>
              <X size={60} className="animate-pulse text-red-600" />
            </CardContent>
            <CardHeader className="w-full text-center">
              <CardTitle className="text-2xl">Verification Failed</CardTitle>
              <CardDescription>Ensure you have the right link.</CardDescription>
            </CardHeader>
          </>
        ) : (
          <>
            <CardContent>
              <CheckCheckIcon size={60} className="animate-pulse text-indigo-800" />
            </CardContent>
            <CardHeader className="w-full text-center">
              <CardTitle className="text-2xl">Verification successful!</CardTitle>
              <CardDescription>Your email has been successfully verified.</CardDescription>
            </CardHeader>
          </>
        )}
      </Card>
    </div>
  );
};

export default observer(VerifyEmail);
