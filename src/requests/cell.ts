import { ATTENDANCE, CELL } from '@/constants/api';
import { TNewCellSchema } from '@/features/admin/zones/components/validation';
import { TOnboardMemberSchema } from '@/features/cells/members/validation';
import dcviServer from '@/servers/dcvi';

// post requests
export const postCell = (payload: TNewCellSchema) =>
  dcviServer.post<IDCVIServerRes<TLoginRes>>(CELL.GET, {
    ...payload,
    cellType: Number(payload.cellType)
  });

export const postCellMember = (payload: TOnboardMemberSchema) =>
  dcviServer.post<IDCVIServerRes<TLoginRes>>(CELL.ONBOARD, {
    ...payload,
    trainings: payload.trainings.map((training) => training.value),
    departments: payload.departments.map((dept) => dept.value),
    gender: Number(payload.gender),
    maritalStatus: Number(payload.maritalStatus),
    cellId: payload.cellId,
    zoneId: payload.zoneId,
    isConsideredLeader: payload.isConsideredLeader,
    isDcMember: payload.isDcMember,

  });

export const postUploadMember = (payload: TOnboardMemberSchema) =>
  dcviServer.post<IDCVIServerRes<TLoginRes>>(CELL.ONBOARD, payload);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const postMarkAttendance = (payload: any) => {
  console.log("Attendance to be marked", payload);
  const newPayload = { ...payload };

  newPayload.tuesdayService.attendanceStatus = parseInt(payload.tuesdayService.attendanceStatus);
  newPayload.cellMeeting.attendanceStatus = parseInt(payload.cellMeeting.attendanceStatus);
  newPayload.sundayMeeting.attendanceStatus = parseInt(payload.sundayMeeting.attendanceStatus);

  return dcviServer.post(ATTENDANCE.MARK_ATTENDANCE.replace(':id', payload.id), newPayload);
};

export const postUploadCellMember = (payload: { File: File }) =>
  dcviServer.post(CELL.UPLOAD_MEMBERS, payload, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  });

export const delCell = async (id: string) => 
  dcviServer.delete(CELL.DELETE_CELL.replace(':id', id));

export const delCellMember = async (id: string) =>
  dcviServer.delete(CELL.DELETE_MEMBER.replace(':id', id));
