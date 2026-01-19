type TCellQuery = {
  ZoneId: string;
  Search: string;
  CellType: number;
  CellStatus: number;
} & TGeneralQuery;

type TCellItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  statusReason: string;
  cellStatus: number;
  cellType: number;
  zoneId: string;
  members: [
    {
      id: string;
      createdAt: string;
      updatedAt: string;
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
      trainings: [string];
      departments: [string];
      onboardedBy: string;
      status: number;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      cellLeader: {
        id: string;
        createdAt: string;
        updatedAt: string;
        userId: string;
        cellId: string;
        zonalLeader: {
          id: string;
          createdAt: string;
          updatedAt: string;
          userId: string;
          pastorId: string;
          zoneId: string;
          status: number;
          pastor: {
            id: string;
            createdAt: string;
            updatedAt: string;
            userId: string;
            zones: [
              {
                id: string;
                createdAt: string;
                updatedAt: string;
                name: string;
                statusReason: string;
                zoneStatus: number;
                pastorId: string;
                zonalLeader: string;
                cells: [string];
              }
            ];
          };
          zone: {
            id: string;
            createdAt: string;
            updatedAt: string;
            name: string;
            statusReason: string;
            zoneStatus: number;
            pastorId: string;
            zonalLeader: string;
            cells: [string];
          };
        };
        members: [string];
      };
    }
  ];
  cellLeader: {
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    cellId: string;
    zonalLeader: {
      userId: string;
      pastorId: string;
      zoneId: string;
      status: number;
      pastor: {
        userId: string;
        zones: [
          {
            name: string;
            statusReason: string;
            zoneStatus: number;
            pastorId: string;
            zonalLeader: string;
            cells: [string];
          }
        ];
      };
      zone: {
        name: string;
        statusReason: string;
        zoneStatus: number;
        pastorId: string;
        zonalLeader: string;
        cells: [string];
      };
    };
    members: [string];
  };
};

type TGetCellRes = { items: Array<TCellItem> } & TPaginatedRes;

type TCellAnalyticsQuery = {
  period: number;
};

type TCellAnalyticsResp = {
  cellCount: number;
  performanceInPercentage: TPerformanceInPercentage;
  periodicAnalysisDatapoint: Array<TPeriodicAnalysisDatapointItem>;
};

type TCellMemberQuery = TGeneralQuery & {
  ZoneId: string;
  CellId: string;
  MemberId: string;
  Search: string;
  Status: number;
};

type TCellMember = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type TGetCellMemberResp = {
  items: Array<TCellMember>;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pathUrl: string;
  previousPageUrl: string | null;
  nextPageUrl: string | null;
};

type TGetSingleCellMember = {
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
  trainings: Array<string>;
  departments: Array<string>;
  status: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  id: string;
  cellLeader: string | null;
  dateOfBirth: date | null
};
