// import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
// import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';

// interface ServerPaginationProps {
//   pagination: TPaginatedRes;
//   Limit: number;
//   setLimit: (arg: number) => void;
//   setPage: (arg: number) => void;
// }

// export function ServerPagination({ pagination, Limit, setLimit, setPage }: ServerPaginationProps) {
//   return (
//     <div
//       className="flex items-center justify-between overflow-clip px-2"
//       style={{ overflowClipMargin: 1 }}
//     >
//       <div className="text-muted-foreground hidden flex-1 text-sm sm:block"></div>
//       <div className="flex items-center sm:space-x-6 lg:space-x-8">
//         <div className="flex items-center space-x-2">
//           <p className="hidden text-sm font-medium sm:block">Rows per page</p>
//           <Select
//             value={`${Limit}`}
//             onValueChange={(value) => {
//               setLimit(Number(value));
//             }}
//           >
//             <SelectTrigger className="h-8 w-[70px]">
//               <SelectValue placeholder={Limit} />
//             </SelectTrigger>
//             <SelectContent side="top">
//               {[10, 20, 30, 40, 50].map((pageSize) => (
//                 <SelectItem key={pageSize} value={`${pageSize}`}>
//                   {pageSize}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="flex w-fit items-center justify-center text-sm font-medium">
//           Page {pagination.currentPage} of {pagination.totalPages}
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button
//             variant="outline"
//             className="h-8 w-8 p-0"
//             onClick={() => {
//               if (pagination.previousPageUrl) {
//                 const url = new URL(pagination.previousPageUrl);
//                 const page = url.searchParams.get('page');
//                 if (page) setPage(Number(page));
//               }
//             }}
//             disabled={!pagination.previousPageUrl}
//           >
//             <span className="sr-only">Go to previous page</span>
//             <ChevronLeftIcon className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             className="h-8 w-8 p-0"
//             onClick={() => {
//               if (pagination.nextPageUrl) {
//                 const url = new URL(pagination.nextPageUrl);
//                 const page = url.searchParams.get('page');
//                 if (page) setPage(Number(page));
//               }
//             }}
//             disabled={!pagination.nextPageUrl}
//           >
//             <span className="sr-only">Go to next page</span>
//             <ChevronRightIcon className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ServerPaginationProps {
  pagination: TPaginatedRes;
  Limit: number;
  setLimit: (arg: number) => void;
  setPage: (arg: number) => void;
}

export function ServerPagination({ pagination, Limit, setLimit, setPage }: ServerPaginationProps) {
  const handleLimitChange = (value: string) => {
    const newLimit = Number(value);
    setLimit(newLimit);
    // Reset to page 1 when changing limit to avoid out-of-bounds issues
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      setPage(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPage(pagination.currentPage + 1);
    }
  };

  return (
    <div
      className="flex items-center justify-between overflow-clip px-2"
      style={{ overflowClipMargin: 1 }}
    >
      <div className="text-muted-foreground hidden flex-1 text-sm sm:block">
        Showing {((pagination.currentPage - 1) * Limit) + 1} to {Math.min(pagination.currentPage * Limit, pagination.totalItems)} of {pagination.totalItems} results
      </div>
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select
            value={`${Limit}`}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${Limit}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handlePreviousPage}
            disabled={pagination.currentPage <= 1 || !pagination.previousPageUrl}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleNextPage}
            disabled={pagination.currentPage >= pagination.totalPages || !pagination.nextPageUrl}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}