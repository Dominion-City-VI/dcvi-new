import { ATTENDANCE, CELL, DEPARTMENTS, PROFILE } from '@/constants/api';
import { TNewCellSchema } from '@/features/admin/zones/components/validation';
import { TOnboardMemberSchema } from '@/features/cells/members/validation';
import dcviServer from '@/servers/dcvi';

// post requests
export const postCell = (payload: TNewCellSchema) =>
  dcviServer.post<IDCVIServerRes<TLoginRes>>(DEPARTMENTS.GET_BY_ID_AND_MEMBERS, {
    ...payload,
    cellType: Number(payload.cellType)
  });

type PostDeptMemberVars = {
  payload: TOnboardMemberSchema;
  departmentId: string;
};

export const postDepartmentMember = ({ payload, departmentId }: PostDeptMemberVars) =>
  dcviServer.post<IDCVIServerRes<TLoginRes>>(
    DEPARTMENTS.ONBOARD.replace(':departmentId', departmentId),
    {
      ...payload,
      trainings: payload.trainings.map((t) => t.value),
      departments: (payload as any).departments?.map((d: any) => d.value) ?? [],
      gender: Number(payload.gender),
      maritalStatus: Number(payload.maritalStatus),
      cellId: payload.cellId || null,
      zoneId: payload.zoneId || null,
      isConsideredLeader: payload.isConsideredLeader,
      isDcMember: payload.isDcMember
    }
  );

export const postUploadMember = (payload: TOnboardMemberSchema) =>
  dcviServer.post<IDCVIServerRes<TLoginRes>>(DEPARTMENTS.ONBOARD, payload);

export const postMarkAttendance = (payload: any) => {
  const newPayload = { ...payload };

  newPayload.tuesdayService.attendanceStatus = parseInt(payload.tuesdayService.attendanceStatus);
  newPayload.cellMeeting.attendanceStatus = parseInt(payload.cellMeeting.attendanceStatus);
  newPayload.sundayMeeting.attendanceStatus = parseInt(payload.sundayMeeting.attendanceStatus);
  newPayload.departmentId = parseInt(payload.departmentId);

  return dcviServer.post(ATTENDANCE.MARK_DEPARTMENT_ATTENDANCE.replace(':departmentId', payload.departmentId), newPayload);
};

export const postUploadDepartmentMember = (payload: { File: File }) =>
  dcviServer.post(DEPARTMENTS.UPLOAD_MEMBERS, payload, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  });

export const removeDeptMember = async ({ id,deptId}: 
  {id: string;deptId: string;}) =>
    dcviServer.delete(DEPARTMENTS.REMOVE_MEMBER.replace(':userId', id).replace(':departmentId', deptId));

export const getUserInfo = (userId: string) =>
  dcviServer.get<IDCVIServerRes<TUserData>>(
    PROFILE.GET_USER_INFO.replace(':id', userId)
  );

// Update user info
type UpdateUserVars = {
  userId: string;
  payload: TUpdateUserPayload;
};

export const updateUserInfo = ({ userId, payload }: UpdateUserVars) =>
  dcviServer.put<IDCVIServerRes<TUserData>>(
    PROFILE.UPDATE_USER_INFO.replace(':id', userId),
    payload
  );


type TUserData = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  trainings: string[];
  departments: string[];
  occupation: string;
  address: string;
  gender: number;
  maritalStatus: number;
  zoneId: string;
  cellId: string;
  status: number;
  dateOfBirth: Date;
};

type TUpdateUserPayload = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  trainings: string[];
  departments: string[];
  occupation: string;
  address?: string;
  gender: number;
  maritalStatus: number;
  zoneId?: string;
  cellId?: string;
  status?: number;
  dateOfBirth?: Date;
};
