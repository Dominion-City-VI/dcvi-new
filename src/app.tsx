import { useEffect } from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

export default function App() {
  useEffect(() => {
    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = 'https://embed.tawk.to/68af7a3786519f192da616a8/1j3mnaqno';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    const s0 = document.getElementsByTagName('script')[0];
    s0.parentNode?.insertBefore(s1, s0);

    return () => {
      s1.remove(); // cleanup on unmount
    };
  }, []);

  return <RouterProvider router={router} />;
}
