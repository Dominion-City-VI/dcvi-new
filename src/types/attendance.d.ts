type TCellAttendanceQuery = TGeneralQuery & {
  Search: string;
  UserRole: number;
  Identifier: string;
  MeetingType: number;
  Period: number;
  AttendanceStatus: number;
};

type TZoneAttendanceQuery = TGeneralQuery & {
  Period: number;
};

type TCellAttendancePercentageMarkedQuery = {
  ZoneId: string;
  StartAt: string;
  EndAt: string;
};

type TCellAttendanceSummaryQuery = {
  Period: number;
  RolesUnitAccessType: number;
  Id: string;
};

type TcellAttenanceResponseVMsItem = {
  id: string;
  dateRange: string;
  tuesdayDate: string;
  sundayDate: string;
  cellDate: string;
  serviceDates: string;
  record: {
    attendanceId: null;
    cellAttendanceStatus: number;
    sundayAttendanceStatus: number;
    tuesdayAttendanceStatus: number;
  };
};

type TCellAttendanceItem = {
  memberId: string;
  cellId: string;
  memberName: string;
  cellAttenanceResponseVMs: Array<TcellAttenanceResponseVMsItem>;
};

type TCellAttendanceCellLeader = {
  name: string;
  cellLeaderId: string;
  email: string;
  phoneNumber: string;
};

type TZonalAttendanceItem = {
  cellId: string;
  cellName: string;
  cellLeader: TCellAttendanceCellLeader;
  cellAttenanceResponseVMs: Array<TcellAttenanceResponseVMsItem>;
};

type TCellAttendanceStatusSummary = {
  total: number;
  totalPresent: number;
  totalAbsent: number;
  totalSick: number;
  totalTravel: number;
  totalNCM: number;
};

type TCellAttendanceServiceSummary = {
  total: number;
  totalSunday: number;
  totalTuesday: number;
  totalCellAttendees: number;
  totalSundayPercentage: number;
  totalTuesdayPercentage: number;
  totalCellAttendeesPercentage: number;
  totalPercentage: number;
};
type TAdminZonalLeaderItem = {
  name: string;
  email: string;
  phoneNumber: string;
  zonalLeaderId: string;
};

type TAdminZonalAttendanceQuery = TGeneralQuery & {
  ZoneId: string;
};

type TAdminAttendanceItem = {
  zoneId: string;
  name: string;
  zonalLeader: TAdminZonalLeaderItem;
  cellAttendances: Array<TZonalAttendanceItem>;
};


const transformToZonalAttendance = (adminAttendance: TAdminAttendanceItem): TZonalAttendanceItem => {
  return {
    cellId: adminAttendance.cellId,  // Ensure that the required fields exist
    cellName: adminAttendance.cellName,
    cellLeader: adminAttendance.cellLeader,
    cellAttenanceResponseVMs: adminAttendance.cellAttendances.map((attendanceItem) => ({
      id: attendanceItem.id,
      dateRange: attendanceItem.dateRange,
      tuesdayDate: attendanceItem.tuesdayDate,
      sundayDate: attendanceItem.sundayDate,
      cellDate: attendanceItem.cellDate,
      serviceDates: attendanceItem.serviceDates,
      record: attendanceItem.record
    }))
  };
};