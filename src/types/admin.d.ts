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
