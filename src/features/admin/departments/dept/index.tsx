// import { Main } from '@/components/layout/main';
// import { Skeleton } from '@/components/ui/skeleton';
// import { observer } from 'mobx-react-lite';
// import { useStore } from '@/store';
// import { AppModals } from '@/store/AppConfig/appModalTypes';
// import { Button } from '@/components/ui/button';
// import { IconPlus } from '@tabler/icons-react';
// import { useFetchAllDepartmentsWithPeople } from '@/hooks/department/useFetchAllDepartmentsAndUsers';
// import UnitsTable from './components/UnitsTable';

// const Zones = () => {
//   const {
//     AppConfigStore: { toggleModals }
//   } = useStore();
//   const { data, isLoading } = useFetchAllDepartmentsWithPeople();

//   return (
//     <Main>
//       <div className="mb-2 flex w-full justify-between">
//         <h2 className="text-2xl font-bold tracking-tight">All Service Units</h2>
//       </div>
//       {isLoading ? (
//         <div className="mb-2 flex w-full flex-wrap items-center justify-between space-y-4">
//           <div className="mb-2 flex w-full flex-wrap items-center justify-between">
//             <Skeleton className="h-8 w-24" />
//             <Skeleton className="h-8 w-24" />
//           </div>

//           <Skeleton className="h-[50svh] w-full" />
//         </div>
//       ) : (
//         data && (
//           <div className="flex flex-col justify-between space-y-3">
//             {/* <div className="flex w-full justify-end">
//               <Button
//                 onClick={() => toggleModals({ name: AppModals.CREATE_ZONE, open: true })}
//                 className="space-x-1"
//               >
//                 <span>Create new zone</span> <IconPlus size={18} />
//               </Button>
//             </div> */}

//             <UnitsTable {...{ placeholder: 'search units...', data }} />
//           </div>
//         )
//       )}
//     </Main>
//   );
// };

// export default observer(Zones);



// Zones.tsx
import { Main } from '@/components/layout/main';
import { Skeleton } from '@/components/ui/skeleton';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useFetchAllDepartmentsWithPeople } from '@/hooks/department/useFetchAllDepartmentsAndUsers';
import UnitsTable from './components/UnitsTable';

const Departments = () => {
  const {
    AppConfigStore: { toggleModals }
  } = useStore();

  const { data, isLoading } = useFetchAllDepartmentsWithPeople();

  return (
    <Main>
      <div className="mb-2 flex w-full justify-between">
        <h2 className="text-2xl font-bold tracking-tight">All Service Units</h2>
      </div>

      {isLoading ? (
        <div className="mb-2 flex w-full flex-wrap items-center justify-between space-y-4">
          <div className="mb-2 flex w-full flex-wrap items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>

          <Skeleton className="h-[50svh] w-full" />
        </div>
      ) : (
        <div className="flex flex-col justify-between space-y-3">
          {/* <div className="flex w-full justify-end">
            <Button
              onClick={() => toggleModals({ name: AppModals.CREATE_ZONE, open: true })}
              className="space-x-1"
            >
              <span>Create new zone</span> <IconPlus size={18} />
            </Button>
          </div> */}

          {/* ✅ PASS AN ARRAY ALWAYS */}
          <UnitsTable placeholder="search units..." data={data ?? []} />
        </div>
      )}
    </Main>
  );
};

export default observer(Departments);
