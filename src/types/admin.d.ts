type TAdminGrantAccessPayload = {
  requestId: string;
  zoneId: string;
  cellId: string;
  roles: Array<number>;
};

type TAdminRequestPayload = {
  requestStatus: number;
  id: string;
  comment: string;
};

type TAdminUserItem = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  trainings: Array<string>;
  departments: Array<string>;
  occupation: string;
  address: string;
  gender: number;
  maritalStatus: number;
  roles: Array<number>;
  userId: string;
  zoneId: string;
  cellId: string;
  status: number;
};

type TAdminAccessReqsItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  trainings: Array<string>;
  departments: Array<string>;
  zoneId: string;
  cellId: string;
  occupation: string;
  address: string;
  gender: number;
  maritalStatus: number;
  isConsideredLeader: boolean;
  phoneNumber: string;
  isAssistantCellLeader: boolean;
  status: number;
  emailConfirmed: boolean;
};

type TAdminActionReqsUserInfo = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
};

type TAdminActionReqsItem = {
  requestType: number;
  requestStatus: number;
  actionId: string;
  subActionId?: string;
  requesterUserInfo: TAdminActionReqsUserInfo;
  approverUserInfo?: TAdminActionReqsUserInfo;
  requesterComments: Array<string>;
  adminComments?: Array<string>;
  id: string;
};

type TAdminMergeReqs = {
  unmapFromId: string;
  mapToId: string;
};

// ─── Leader info shared shape ─────────────────────────────────────────────────
type TLeaderInfo = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastLogin: string | null;
};

type TPerformanceKPI = {
  total?: number;
  sundayPresent?: number;
  tuesdayPresent?: number;
  cellPresent?: number;
  contributingCells?: number;
  sundayPct: number;
  tuesdayPct: number;
  cellPct: number;
  totalRecords?: number;
};

// ─── Dept Attendance Summary ──────────────────────────────────────────────────
type TDeptAttPeriodPoint = {
  label: string;
  total: number;
  sundayPresent: number;
  sundayAbsent: number;
  tuesdayPresent: number;
  tuesdayAbsent: number;
  sundayPct: number;
  tuesdayPct: number;
};

type TDeptAttendanceSummaryItem = {
  departmentId: string;
  name: string;
  isActive: boolean;
  leader: TLeaderInfo | null;
  summary: {
    total: number;
    sundayPct: number;
    tuesdayPct: number;
    overallPct: number;
  };
  periodData: TDeptAttPeriodPoint[];
};

// ─── Zone Overview ────────────────────────────────────────────────────────────
type TCellOverviewItem = {
  cellId: string;
  name: string;
  cellStatus: number;
  memberCount: number;
  leader: TLeaderInfo | null;
  performance: TPerformanceKPI;
};

type TZoneOverviewItem = {
  zoneId: string;
  name: string;
  zoneStatus: number;
  cellCount: number;
  memberCount: number;
  leader: TLeaderInfo | null;
  performance: TPerformanceKPI;
  cells: TCellOverviewItem[];
};

// ─── Dept Overview ────────────────────────────────────────────────────────────
type TDeptOverviewItem = {
  departmentId: string;
  name: string;
  isActive: boolean;
  leader: TLeaderInfo | null;
  assistants: TLeaderInfo[];
  performance: {
    totalRecords: number;
    sundayPct: number;
    tuesdayPct: number;
    overallPct: number;
  };
};

// ─── Leaders Overview ─────────────────────────────────────────────────────────
type TZonalLeaderItem = TLeaderInfo & {
  zone: string;
  zoneId: string;
  cellCount: number;
  memberCount: number;
  performance: TPerformanceKPI;
};

type TCellLeaderItem = TLeaderInfo & {
  cell: string;
  cellId: string;
  zone: string;
  zoneId: string;
  isAssistant: boolean;
  memberCount: number;
  performance: TPerformanceKPI;
};

type TDeptAssistantItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastLogin: string | null;
};

type TDeptLeaderItem = TLeaderInfo & {
  department: string;
  departmentId: string;
  performance: TPerformanceKPI;
  assistants: TDeptAssistantItem[];
};

type TLeadersOverview = {
  zonalLeaders: TZonalLeaderItem[];
  cellLeaders: TCellLeaderItem[];
  deptLeaders: TDeptLeaderItem[];
};

// ─── Admin Overview Analytics ─────────────────────────────────────────────────
type TAttTrendPoint = {
  label: string;
  sundayPresent: number;
  tuesdayPresent: number;
  cellPresent: number;
  total: number;
  sundayPct: number;
  tuesdayPct: number;
  cellPct: number;
};

type TZonePerfItem = {
  zone: string;
  zoneId: string;
  members: number;
  cells: number;
  total: number;
  sundayPresent: number;
  tuesdayPresent: number;
  cellPresent: number;
  sundayPct: number;
  tuesdayPct: number;
  cellPct: number;
};

type TDeptPerfItem = {
  dept: string;
  deptId: string;
  isActive: boolean;
  total: number;
  sundayPresent: number;
  tuesdayPresent: number;
  cellPresent: number;
  sundayPct: number;
  tuesdayPct: number;
  cellPct: number;
};

type TAdminOverview = {
  counts: { members: number; cells: number; zones: number; depts: number };
  cellKpi: {
    total: number;
    sundayPresent: number;
    tuesdayPresent: number;
    cellPresent: number;
    sundayPct: number;
    tuesdayPct: number;
    cellPct: number;
  };
  deptKpi: {
    total: number;
    sundayPresent: number;
    tuesdayPresent: number;
    cellPresent: number;
    sundayPct: number;
    tuesdayPct: number;
    cellPct: number;
  };
  cellTrend: TAttTrendPoint[];
  deptTrend: TAttTrendPoint[];
  zonePerformance: TZonePerfItem[];
  deptPerformance: TDeptPerfItem[];
};
