import { useFetchStatusSummary } from './useFetchStatusSummary';
import { useFetchServiceSummary } from './useFetchServiceSummary';
import { EnumRoles } from '@/constants/mangle';

interface Params {
  id: string | undefined;
  period: number;
  roleType: EnumRoles;
}

export const useFetchAttendanceSummaries = ({ id, period, roleType }: Params) => {
  const enabled = Boolean(id);

  const { data: statusSummary, isLoading: statusLoading } = useFetchStatusSummary(
    { Period: period, RolesUnitAccessType: roleType, Id: id },
    enabled
  );

  const { data: serviceSummary, isLoading: serviceLoading } = useFetchServiceSummary(
    { Period: period, RolesUnitAccessType: roleType, Id: id },
    enabled
  );

  return {
    statusSummary,
    serviceSummary,
    isLoading: statusLoading || serviceLoading
  };
};
