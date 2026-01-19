// import Cookies from 'js-cookie';
// import { Outlet, useNavigate } from '@tanstack/react-router';
// import { cn } from '@/lib/utils';
// import { SearchProvider } from '@/context/searchContext';
// import { SidebarProvider } from '@/components/ui/sidebar';
// import AppSidebar from '@/components/layout/app-sidebar';
// import SkipToMain from '@/components/skipToMain';
// import { useFetchProfile } from '@/hooks/profile/useFetchProfile';
// import { useEffect } from 'react';
// import { Route as loginRoute } from '@/routes/auth/login';
// import PageLoading from '@/components/Loaders/PageLoading';
// import { useStore } from '@/store';
// import { observer } from 'mobx-react-lite';
// import { Header } from '@/components/layout/header';
// import ProfileDropdown from '@/components/Profiledropdown';
// import { ThemeSwitch } from '@/components/themeSwitch';
// import { Search } from '@/components/search';

// const AuthLayout = () => {
//   const defaultOpen = Cookies.get('sidebar_state') !== 'false';
//   const {
//     AuthStore: { updateUser, accessToken, refreshToken }
//   } = useStore();
//   const { data, isLoading, status } = useFetchProfile();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isLoading && data != undefined) {
//       updateUser(data);
//     }
//   }, [isLoading, data]);

//   useEffect(() => {
//     if (!accessToken && !refreshToken) {
//       navigate({ to: loginRoute.fullPath, replace: true });
//       return;
//     }

//     if (status === 'error') {
//       navigate({ to: loginRoute.fullPath, replace: true });
//       return;
//     }
//   }, [accessToken, refreshToken, status, navigate]);

//   if (!accessToken && !refreshToken) {
//     return <PageLoading />;
//   }

//   if (status === 'pending') {
//     return <PageLoading />;
//   }

//   if (status === 'error') {
//     return <PageLoading />;
//   }

//   return (
//     <SearchProvider>
//       <SidebarProvider defaultOpen={defaultOpen}>
//         <SkipToMain />
//         <AppSidebar />
//         <div
//           id="content"
//           className={cn(
//             'ml-auto w-full max-w-full',
//             'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
//             'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
//             'sm:transition-[width] sm:duration-200 sm:ease-linear',
//             'flex h-svh flex-col',
//             'group-data-[scroll-locked=1]/body:h-full',
//             'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
//           )}
//         >
//           <Header fixed>
//             <Search />
//             <div className="ml-auto flex items-center space-x-4">
//               <ThemeSwitch />
//               <ProfileDropdown />
//             </div>
//           </Header>
//           <Outlet />
//         </div>
//       </SidebarProvider>
//     </SearchProvider>
//   );
// };

// export default observer(AuthLayout);


import Cookies from 'js-cookie';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { SearchProvider } from '@/context/searchContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import SkipToMain from '@/components/skipToMain';
import { useFetchProfile } from '@/hooks/profile/useFetchProfile';
import { useEffect } from 'react';
import { Route as loginRoute } from '@/routes/auth/login';
import PageLoading from '@/components/Loaders/PageLoading';
import { useStore } from '@/store';
import { observer } from 'mobx-react-lite';
import { Header } from '@/components/layout/header';
import ProfileDropdown from '@/components/Profiledropdown';
import { ThemeSwitch } from '@/components/themeSwitch';
import { Search } from '@/components/search';

const AuthLayout = () => {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false';
  const {
    AuthStore: { updateUser, accessToken, refreshToken }
  } = useStore();
  const { data, isLoading, status } = useFetchProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && data != undefined) {
      updateUser(data);
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      navigate({ to: loginRoute.fullPath, replace: true });
      return;
    }

    if (status === 'error') {
      navigate({ to: loginRoute.fullPath, replace: true });
      return;
    }
  }, [accessToken, refreshToken, status, navigate]);

  if (!accessToken && !refreshToken) {
    return <PageLoading />;
  }

  if (status === 'pending') {
    return <PageLoading />;
  }

  if (status === 'error') {
    return <PageLoading />;
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SearchProvider>
        <SkipToMain />
        <AppSidebar />
        <div
          id="content"
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'sm:transition-[width] sm:duration-200 sm:ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
          )}
        >
          <Header fixed>
            <Search />
            <div className="ml-auto flex items-center space-x-4">
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
          <Outlet />
        </div>
      </SearchProvider>
    </SidebarProvider>
  );
};

export default observer(AuthLayout);