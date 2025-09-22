import { ADMIN } from '@/constants/api';
import { TAccessRequestSchema } from '@/features/admin/requests/access/components/modal/AccessModal';
import { TUpdateRoleSchema } from '@/features/admin/users/components/modals/UpdateRoleModal';
import dcviServer from '@/servers/dcvi';

export const postGrantAccess = async (payload: TAdminGrantAccessPayload) =>
  dcviServer.post(ADMIN.GRANT_ACCESS, {
    ...payload,
    zoneId: payload.zoneId,
    cellId: payload.cellId,
    requestId: payload.requestId,
    roles: payload.roles.map((role) => role)
  });

export const putRequest = async (payload: TAccessRequestSchema) =>
  dcviServer.put(ADMIN.REQUEST_APPROVE_REJECT, payload);

export const putUpdateRole = async (payload: TUpdateRoleSchema) =>
  dcviServer.put<IDCVIServerRes<boolean>>(ADMIN.UPDATE_USER_ROLE, payload);

export const putMergeZone = async (payload: TAdminMergeReqs) =>
  dcviServer.put<IDCVIServerRes<boolean>>(ADMIN.MERGE_ZONE, payload);

export const putMergeCell = async (payload: TAdminMergeReqs) =>
  dcviServer.put<IDCVIServerRes<boolean>>(ADMIN.MERGE_CELL, payload);
