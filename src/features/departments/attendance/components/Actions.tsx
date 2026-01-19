// import { DotsHorizontalIcon } from '@radix-ui/react-icons';
// import { Row } from '@tanstack/react-table';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu';
// import { useStore } from '@/store';
// import { AppModals } from '@/store/AppConfig/appModalTypes';
// import { EnumAttendanceStatus } from '@/constants/mangle';

// interface DataTableRowActionsProps {
//   row: Row<TDeptAttendanceItem>;
//   weekDateRange: string;
// }

// // export function DataTableRowActions({ row, weekDateRange }: DataTableRowActionsProps) {
// //   const {
// //     AppConfigStore: { toggleModals }
// //   } = useStore();

// //   // const { memberId, cellAttenanceResponseVMs } = row.original;
// //   const { deptAttenanceResponseVMs } = row.original;

// //   // pick the right week's data
// //   const weekData = deptAttenanceResponseVMs.find((w) => w.dateRange === weekDateRange);

// //   if (!weekData) return null; // nothing to manage

// //   const { tuesdayDate, cellDate, sundayDate, record, departmentId } = weekData;
// //   const { cellAttendanceStatus, sundayAttendanceStatus, tuesdayAttendanceStatus } = record;

// //   const isAttendaceUpdate =
// //     cellAttendanceStatus !== EnumAttendanceStatus.UNMARKED ||
// //     sundayAttendanceStatus !== EnumAttendanceStatus.UNMARKED ||
// //     tuesdayAttendanceStatus !== EnumAttendanceStatus.UNMARKED;

// //   return (
// //     <DropdownMenu modal={false}>
// //       <DropdownMenuTrigger asChild>
// //         <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
// //           <DotsHorizontalIcon className="h-4 w-4" />
// //           <span className="sr-only">Open menu</span>
// //         </Button>
// //       </DropdownMenuTrigger>
// //       <DropdownMenuContent align="end" className="w-fit">
// //         <DropdownMenuItem
// //           onClick={() =>
// //             toggleModals({
// //               open: true,
// //               name: AppModals.DEPARTMENT_MARK_ATTENDANCE_MODAL,
// //               // id: memberId,
// //               //id: row.original.cellId,
// //               id: row.original.memberId,
// //               isAttendaceUpdate,
// //               tuesdayServiceDate: tuesdayDate,
// //               cellMeetingDate: cellDate,
// //               sundayServiceDate: sundayDate,
// //               departmentId: departmentId 
// //             })
// //           }
// //         >
// //           Manage attendance
// //         </DropdownMenuItem>
// //       </DropdownMenuContent>
// //     </DropdownMenu>
// //   );
// // }


// import { DotsHorizontalIcon } from '@radix-ui/react-icons';
// import { Row } from '@tanstack/react-table';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu';
// import { useStore } from '@/store';
// import { AppModals } from '@/store/AppConfig/appModalTypes';
// import { EnumAttendanceStatus } from '@/constants/mangle';

// interface DataTableRowActionsProps {
//   row: Row<TDeptAttendanceItem>;
//   weekDateRange: string;
// }

// export function DataTableRowActions({ row, weekDateRange }: DataTableRowActionsProps) {
//   const {
//     AppConfigStore: { toggleModals }
//   } = useStore();

//   // Use cellAttenanceResponseVMs (the actual property from API)
//   const { deptAttenanceResponseVMs } = row.original;

//   // Safety check
//   if (!deptAttenanceResponseVMs || deptAttenanceResponseVMs.length === 0) {
//     return null;
//   }

//   // Pick the right week's data
//   const weekData = deptAttenanceResponseVMs.find((w) => w.dateRange === weekDateRange);

//   if (!weekData) return null; // nothing to manage

//   const { tuesdayDate, cellDate, sundayDate, record } = weekData;
  
//   // Safety check for record
//   if (!record) return null;

//   const { cellAttendanceStatus, sundayAttendanceStatus, tuesdayAttendanceStatus } = record;

//   const isAttendaceUpdate =
//     cellAttendanceStatus !== EnumAttendanceStatus.UNMARKED ||
//     sundayAttendanceStatus !== EnumAttendanceStatus.UNMARKED ||
//     tuesdayAttendanceStatus !== EnumAttendanceStatus.UNMARKED;

//   return (
//     <DropdownMenu modal={false}>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
//           <DotsHorizontalIcon className="h-4 w-4" />
//           <span className="sr-only">Open menu</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-fit">
//         <DropdownMenuItem
//           onClick={() =>
//             toggleModals({
//               open: true,
//               name: AppModals.DEPARTMENT_MARK_ATTENDANCE_MODAL,
//               id: row.original.memberId,
//               isAttendaceUpdate,
//               tuesdayServiceDate: tuesdayDate,
//               cellMeetingDate: cellDate,
//               sundayServiceDate: sundayDate,
//               departmentId: weekData.id // Use the weekData id as departmentId
//             })
//           }
//         >
//           Manage attendance
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


// export function DataTableRowActions({ row, weekDateRange }: DataTableRowActionsProps) {
//   const {
//     AppConfigStore: { toggleModals }
//   } = useStore();

//   const { deptAttenanceResponseVMs } = row.original;

//   if (!deptAttenanceResponseVMs || deptAttenanceResponseVMs.length === 0) {
//     return null;
//   }

//   const weekData = deptAttenanceResponseVMs.find((w) => w.dateRange === weekDateRange);

//   if (!weekData) return null;

//   const { tuesdayDate, cellDate, sundayDate, record, departmentId } = weekData;
  
//   if (!record) return null;

//   const { cellAttendanceStatus, sundayAttendanceStatus, tuesdayAttendanceStatus } = record;

//   const isAttendaceUpdate =
//     cellAttendanceStatus !== EnumAttendanceStatus.UNMARKED ||
//     sundayAttendanceStatus !== EnumAttendanceStatus.UNMARKED ||
//     tuesdayAttendanceStatus !== EnumAttendanceStatus.UNMARKED;

//   // const handleManageAttendance = (e: React.MouseEvent) => {
//   //   e.stopPropagation(); // Prevent row selection
    
//   //   toggleModals({
//   //     open: true,
//   //     name: AppModals.DEPARTMENT_MARK_ATTENDANCE_MODAL,
//   //     id: row.original.memberId,
//   //     isAttendaceUpdate,
//   //     tuesdayServiceDate: tuesdayDate,
//   //     cellMeetingDate: cellDate,
//   //     sundayServiceDate: sundayDate,
//   //     departmentId: departmentId || weekData.id // Fallback to weekData.id if departmentId doesn't exist
//   //   });
//   // };

//   const handleManageAttendance = (e: React.MouseEvent) => {
//     e.stopPropagation();
    
//     const modalParams = {
//       open: true,
//       name: AppModals.DEPARTMENT_MARK_ATTENDANCE_MODAL,
//       id: row.original.memberId,
//       isAttendaceUpdate,
//       tuesdayServiceDate: tuesdayDate,
//       cellMeetingDate: cellDate,
//       sundayServiceDate: sundayDate,
//       departmentId: departmentId || weekData.id
//     };
    
//     console.log('Opening modal with params:', modalParams);
//     console.log('Row original:', row.original);
//     console.log('Week data:', weekData);
//     // In your AppConfigStore
//     toggleModals(modalParams?: any) {
//       if (!modalParams || Object.keys(modalParams).length === 0) {
//         // Close all modals
//         this.isOpen = {
//           DEPARTMENT_MARK_ATTENDANCE_MODAL: false,
//           // ... other modals
//         };
//         this.departmentAttendance = {}; // Clear data
//       } else {
//         // Open specific modal and store data
//         this.isOpen[params.name] = params.open;
        
//         // Store the attendance data
//         if (params.name === AppModals.DEPARTMENT_MARK_ATTENDANCE_MODAL) {
//           this.departmentAttendance = {
//             id: params.id,
//             isAttendaceUpdate: params.isAttendaceUpdate,
//             tuesdayServiceDate: params.tuesdayServiceDate,
//             cellMeetingDate: params.cellMeetingDate,
//             sundayServiceDate: params.sundayServiceDate,
//             departmentId: params.departmentId
//           };
//         }
//       }
//     }
//   };

//   return (
//     <DropdownMenu modal={false}>
//       <DropdownMenuTrigger asChild>
//         <Button 
//           variant="ghost" 
//           className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
//           onClick={(e) => e.stopPropagation()} // Prevent row selection
//         >
//           <DotsHorizontalIcon className="h-4 w-4" />
//           <span className="sr-only">Open menu</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-fit">
//         <DropdownMenuItem onClick={handleManageAttendance}>
//           Manage attendance
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useStore } from '@/store';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { EnumAttendanceStatus } from '@/constants/mangle';
import AuthStore from '@/store/AuthStore';

interface DataTableRowActionsProps {
  row: Row<TDeptAttendanceItem>;
  weekDateRange: string;
}

export function DataTableRowActions({ row, weekDateRange }: DataTableRowActionsProps) {
  const {
    AppConfigStore: { toggleModals },
    AuthStore: { userExtraInfo }
  } = useStore();

  const { deptAttenanceResponseVMs, memberId } = row.original;

  // Safety check: ensure we have attendance data
  if (!deptAttenanceResponseVMs || deptAttenanceResponseVMs.length === 0) {
    console.warn('No attendance data available for member:', memberId);
    return null;
  }

  // Find the attendance data for the specified week
  const weekData = deptAttenanceResponseVMs.find((w) => w.dateRange === weekDateRange);

  if (!weekData) {
    console.warn('No attendance data found for week:', weekDateRange);
    return null;
  }

  // Destructure week data with safety checks
  const { 
    tuesdayDate, 
    cellDate, 
    sundayDate, 
    record, 
    departmentId,
    id 
  } = weekData;
  
  // Safety check for record
  if (!record) {
    console.warn('No record found in week data');
    return null;
  }

  const { 
    cellAttendanceStatus, 
    sundayAttendanceStatus, 
    tuesdayAttendanceStatus 
  } = record;

  // Determine if this is an update or new entry
  const isAttendaceUpdate =
    cellAttendanceStatus !== EnumAttendanceStatus.UNMARKED ||
    sundayAttendanceStatus !== EnumAttendanceStatus.UNMARKED ||
    tuesdayAttendanceStatus !== EnumAttendanceStatus.UNMARKED;

  const handleManageAttendance = (e: React.MouseEvent) => {
    // Prevent event bubbling to avoid triggering row selection
    e.stopPropagation();
    
    toggleModals({
      open: true,
      name: AppModals.DEPARTMENT_MARK_ATTENDANCE_MODAL,
      id: memberId,
      isAttendaceUpdate: true,
      tuesdayServiceDate: tuesdayDate,
      cellMeetingDate: cellDate,
      sundayServiceDate: sundayDate,
      departmentId: userExtraInfo.departmentId || departmentId || id // Use departmentId if available, fallback to id
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuItem 
          onClick={handleManageAttendance}
          className="cursor-pointer"
        >
          {isAttendaceUpdate ? 'Update attendance' : 'Mark attendance'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}