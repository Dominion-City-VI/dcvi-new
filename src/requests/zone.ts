import { ZONE } from '@/constants/api';
import { TNewZoneSchema, TDelZoneSchema } from '@/features/admin/zones/components/validation';
import dcviServer from '@/servers/dcvi';

export const postZone = async (payload: TNewZoneSchema) => dcviServer.post(ZONE.CREATE, payload);

export const putZone = async ({ id, payload }: { id: string; payload: TNewZoneSchema }) =>
  dcviServer.post(ZONE.GET_BY_ID.replace(':id', id), payload);

export const delZone = async ({ id, params }: { id: string; params: TDelZoneSchema }) =>
  dcviServer.delete(ZONE.GET_BY_ID.replace(':id', id), { params });
