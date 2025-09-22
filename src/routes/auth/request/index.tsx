import RegisterForm from '@/features/auth/Request';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/request/')({
  component: RouteComponent
});

function RouteComponent() {
  return <RegisterForm />;
}
