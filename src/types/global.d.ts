type Option = { value: string; label: string; disable?: boolean };

interface SessionPayload extends Pick<TProfileInfo, 'id' | 'roles'> {
  token: string;
  exp?: number;
}

interface IDCVIServerRes<T> {
  data: T;
  statusCode: number;
  status: boolean;
  message: string;
}

interface IEnumStatus<T> {
  enum: T;
  name: string;
  text: string;
}

type TDCVIDepartmentResp = IDCVIServerRes<Array<string>>;
type TDCVITrainingResp = IDCVIServerRes<Array<string>>;
type TDCVIZoneItem = {
  name: string;
  statusReason: string | null;
  zoneStatus: number;
  pastorId: number | null;
  zonalLeader: number | null;
  cells: Array<{
    name: string;
    statusReason: string;
    cellStatus: number;
    cellType: number;
    zoneId: string;
    members: null;
    cellLeader: null;
    id: string;
    createdAt: string;
    updatedAt: string;
  }>;
  id: string;
  createdAt: string;
  updatedAt: string;
};

type TAuthTokenObj = {
  token: string;
  refreshToken: string;
};

type TUserProfile = {
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  trainings?: Array<string>;
  departments: null;
  occupation: null;
  address?: string;
  gender: number;
  maritalStatus: number;
};

type TProfileExtraInfo = {
  $type: string;
  id: string;
  cellId?: string;
  myProperty: number;
  zonalId?: string;
};

type TLoginRes = {
  token: string;
  refreshToken: string;
  expires: number;
  email: string;
  isEmailVerified: boolean;
  isPhoneNumberVerified: boolean;
  extraInfo: TProfileExtraInfo;
  roles: Array<number>;
};

type TGeneralQuery = {
  StartAt: string;
  EndAt: string;
  Page: number;
  Limit: number;
};

interface IQueryHookResponse<T> {
  data: T;
  isLoading: boolean;
  error: unknown;
  status: 'error' | 'success' | 'pending';
}

type TPaginatedRes = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pathUrl: string;
  previousPageUrl?: string;
  nextPageUrl?: string;
};

type TDCVIPaginatedRes<T> = TPaginatedRes & {
  items: Array<T>;
};

interface IDCVIPaginatedServerRes<T> {
  data: TDCVIPaginatedRes<T>;
  statusCode: number;
  status: boolean;
  message: string;
}

type TPaystackStatus = 0 | 1 | 2 | 3;

type TFundingConfirmation = {
  userId: string;
  walletId: string;
  balanceBefore: number;
  balanceAfter: number;
  amount: number;
  narration: string;
  transactionDirection: number;
  status: TPaystackStatus;
  reference: string;
  id: string;
  createdAt: string;
  updatedAt: string;
};

type TPerformanceInPercentage = {
  cellStrength: number;
  sundayService: number;
  cellAttendance: number;
  tuesdayAttendance: number;
};

type TPeriodicAnalysisDatapointItem = {
  label: string;
  cellCount: number;
  tuesdayServiceCount: number;
  sundayServiceCount: number;
};
