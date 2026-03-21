import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

function DefaultNotFound() {
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-2 text-muted-foreground">
      <p className="text-lg font-semibold">Page not found</p>
      <p className="text-sm">The page you are looking for does not exist.</p>
    </div>
  );
}

function DefaultError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-2 text-muted-foreground">
      <p className="text-lg font-semibold text-destructive">Something went wrong</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: DefaultNotFound,
  defaultErrorComponent: DefaultError
});

export default function App() {
  return <RouterProvider router={router} />;
}
