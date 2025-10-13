type TZoneQuery = {
  take: string;
  ZoneId: string;
  Search: string;
  ZoneStatus: number;
} & TGeneralQuery;

type TZoneAnalyticsQuery = {
  id: string;
  period: number;
};

type TZoneZonalLeader = {
  name: string;
  email: string;
  phoneNumber: string;
  zonalLeaderId: string;
};

type TZoneCellLeader = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  cellId: string;
  zonalLeader: TZoneZonalLeader;
  members: Array<string>;
};

type TZoneCellMember = {
  id: string;
  createdAt: string;
  updatedAt: string;
  cellLeaderId: string;
  isConsideredLeader: true;
  zoneId: string;
  cellId: string;
  isAssistantCellLeader: true;
  email: string;
  occupation: string;
  address: string;
  gender: number;
  maritalStatus: number;
  trainings: Array<string>;
  departments: Array<string>;
  onboardedBy: string;
  status: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cellLeader: TZoneCellLeader;
};

type TCellItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  statusReason: string;
  cellStatus: number;
  cellType: number;
  zoneId: string;
  members: Array<TZoneCellMember>;
  cellLeader: TZoneCellLeader;
};

type TZoneItem = {
  id: string;
  name: string;
  zoneStatus: number;
  zonalLeader: TZoneZonalLeader;
  cellCount: number;
  updatedAt: string;
};

type TGetZoneRes = { items: Array<TZoneItem> } & TPaginatedRes;

type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type TPastor = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
  zones: string[];
};

type TZonalLeader = BaseEntity & {
  userId: string;
  pastorId: string;
  zoneId: string;
  status: number;
  pastor: TPastor;
  zone: string;
};

// Cell Leader type
type TCellLeader = BaseEntity & {
  userId: string;
  cellId: string;
  zonalLeader: TZonalLeader;
  members: string[];
};

// Cell Member type
type TCellMember = BaseEntity & {
  cellLeaderId: string;
  isConsideredLeader: boolean;
  zoneId: string;
  cellId: string;
  isAssistantCellLeader: boolean;
  email: string;
  occupation: string;
  address: string;
  gender: number;
  maritalStatus: number;
  trainings: string[];
  departments: string[];
  onboardedBy: string;
  status: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cellLeader: TCellLeader;
};

// Cell type
type TCell = {
  userId: string;
  cellLeaderName: string;
  cellLeaderEmail: string;
  cellLeaderPhoneNumber: string;
  cellName: string;
  cellId: string;
  holdingDayOfWeek :number;
  cellStatus: number;
  cellType : number;
  holdingTime: string;
  isVirtual: boolean;
  meetingAddress: string;
  meetingLink: string;
  statusReason: number;
};

type TSingleZoneRes = BaseEntity & {
  name: string;
  statusReason: string;
  zoneStatus: number;
  cellCount: number;
  zonalLeader: {
    name: string;
    email: string;
    phoneNumber: string;
    zonalLeaderId: string;
  };
  cells: TCell[];
};

// zone analytics resp
type TZoneAnalyticsResp = {
  cellCount: number;
  performanceInPercentage: TPerformanceInPercentage;
  periodicAnalysisDatapoint: Array<TPeriodicAnalysisDatapointItem>;
};

type TAllZoneItem = BaseEntity & {
  name: string;
  zoneStatus: number;
  zonalLeader: {
    name: string;
    email: string;
    phoneNumber: string;
    zonalLeaderId: string;
  };
  cellCount: number;
};
